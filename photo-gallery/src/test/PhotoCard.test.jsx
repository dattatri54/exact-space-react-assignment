import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PhotoCard from '../components/PhotoCard';

describe('PhotoCard Component', () => {
  const mockPhoto = {
    id: '10',
    author: 'Paul Jarvis',
    download_url: 'https://picsum.photos/id/10/2500/1667',
  };

  it('renders photo image with correct src and alt attributes', () => {
    render(<PhotoCard photo={mockPhoto} likes={0} onLike={() => {}} />);

    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', mockPhoto.download_url);
    expect(img).toHaveAttribute('alt', 'Captured by Paul Jarvis');
  });

  it('displays the author name correctly', () => {
    render(<PhotoCard photo={mockPhoto} likes={0} onLike={() => {}} />);

    expect(screen.getByText(/Author:/i)).toBeInTheDocument();
    expect(screen.getByText('Paul Jarvis')).toBeInTheDocument();
  });

  it('displays the initial like count of 0', () => {
    render(<PhotoCard photo={mockPhoto} likes={0} onLike={() => {}} />);

    const likeCount = screen.getByTestId('like-count-10');
    expect(likeCount).toHaveTextContent('0');
  });

  it('calls onLike with photo id when thumbs-up button is clicked', () => {
    const handleLike = vi.fn();
    render(<PhotoCard photo={mockPhoto} likes={0} onLike={handleLike} />);

    const button = screen.getByTestId('like-btn-10');
    fireEvent.click(button);
    expect(handleLike).toHaveBeenCalledTimes(1);
    expect(handleLike).toHaveBeenCalledWith('10');

    fireEvent.click(button);
    expect(handleLike).toHaveBeenCalledTimes(2);
  });

  it('renders updated like count when prop changes', () => {
    const { rerender } = render(<PhotoCard photo={mockPhoto} likes={3} onLike={() => {}} />);

    expect(screen.getByTestId('like-count-10')).toHaveTextContent('3');

    rerender(<PhotoCard photo={mockPhoto} likes={4} onLike={() => {}} />);
    expect(screen.getByTestId('like-count-10')).toHaveTextContent('4');
  });
});
