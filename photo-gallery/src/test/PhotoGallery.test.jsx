import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import PhotoGallery from '../components/PhotoGallery';

describe('PhotoGallery Component', () => {
  const page1Photos = [
    {
      id: '0',
      author: 'Alejandro Escamilla',
      download_url: 'https://picsum.photos/id/0/5000/3333',
    },
    {
      id: '1',
      author: 'Alejandro Escamilla',
      download_url: 'https://picsum.photos/id/1/5000/3333',
    },
  ];

  const page2Photos = [
    {
      id: '2',
      author: 'Paul Jarvis',
      download_url: 'https://picsum.photos/id/2/5000/3333',
    },
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('fetches and displays photos on initial mount', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => page1Photos,
    });

    render(<PhotoGallery />);

    // Loading indicator is shown
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Photos appear
    await waitFor(() => {
      expect(screen.getByTestId('photo-item-0')).toBeInTheDocument();
      expect(screen.getByTestId('photo-item-1')).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledWith('https://picsum.photos/v2/list?page=1');
  });

  it('increments like count individually for clicked photo', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => page1Photos,
    });

    render(<PhotoGallery />);

    await waitFor(() => {
      expect(screen.getByTestId('photo-item-0')).toBeInTheDocument();
    });

    const likeBtn0 = screen.getByTestId('like-btn-0');
    const likeBtn1 = screen.getByTestId('like-btn-1');

    expect(screen.getByTestId('like-count-0')).toHaveTextContent('0');
    expect(screen.getByTestId('like-count-1')).toHaveTextContent('0');

    // Click photo 0 like button twice
    fireEvent.click(likeBtn0);
    fireEvent.click(likeBtn0);

    expect(screen.getByTestId('like-count-0')).toHaveTextContent('2');
    // Photo 1 remains 0
    expect(screen.getByTestId('like-count-1')).toHaveTextContent('0');

    // Click photo 1 once
    fireEvent.click(likeBtn1);
    expect(screen.getByTestId('like-count-1')).toHaveTextContent('1');
    expect(screen.getByTestId('like-count-0')).toHaveTextContent('2');
  });

  it('prevents duplicate photos when appending new pages', async () => {
    // API returns a duplicate ID in page 2
    const page2WithDuplicate = [
      { id: '1', author: 'Alejandro Escamilla', download_url: 'https://picsum.photos/id/1/5000/3333' },
      { id: '2', author: 'Paul Jarvis', download_url: 'https://picsum.photos/id/2/5000/3333' },
    ];

    let fetchCount = 0;
    global.fetch = vi.fn().mockImplementation(() => {
      fetchCount += 1;
      return Promise.resolve({
        ok: true,
        json: async () => (fetchCount === 1 ? page1Photos : page2WithDuplicate),
      });
    });

    render(<PhotoGallery />);

    await waitFor(() => {
      expect(screen.getByTestId('photo-item-0')).toBeInTheDocument();
    });

    // Simulate infinite scroll intersection
    const observerInstance = global.IntersectionObserver.instances[0];
    act(() => {
      observerInstance.triggerIntersect(true);
    });

    await waitFor(() => {
      expect(screen.getByTestId('photo-item-2')).toBeInTheDocument();
    });

    // Verify photo-item-1 only exists once
    const items = screen.getAllByTestId('photo-item-1');
    expect(items).toHaveLength(1);
  });

  it('displays error message and allows retry when API fails', async () => {
    global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network connection lost'));

    render(<PhotoGallery />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText(/Network connection lost/i)).toBeInTheDocument();
    });

    // Now mock success on retry
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => page1Photos,
    });

    const retryBtn = screen.getByRole('button', { name: /retry/i });
    fireEvent.click(retryBtn);

    await waitFor(() => {
      expect(screen.getByTestId('photo-item-0')).toBeInTheDocument();
    });
  });
});
