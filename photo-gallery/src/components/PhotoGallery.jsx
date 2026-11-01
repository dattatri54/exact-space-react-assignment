import React, { useState, useEffect, useRef, useCallback } from 'react';
import PhotoCard from './PhotoCard';

const PICSUM_API_BASE = 'https://picsum.photos/v2/list';

/**
 * PhotoGallery Component
 * Manages photo feed fetching, deduplication, infinite scroll,
 * error/loading states, and per-photo like counts.
 */
export function PhotoGallery() {
  const [photos, setPhotos] = useState([]);
  const [likes, setLikes] = useState({});
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // Guard against concurrent fetches (e.g., during rapid scroll or strict mode)
  const isFetchingRef = useRef(false);
  const observerTargetRef = useRef(null);

  /**
   * Fetch a specific page of photos from Picsum API
   */
  const fetchPhotos = useCallback(async (pageNumber) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${PICSUM_API_BASE}?page=${pageNumber}`);

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error('Unexpected API response format');
      }

      if (data.length === 0) {
        setHasMore(false);
      } else {
        setPhotos((prevPhotos) => {
          const existingIds = new Set(prevPhotos.map((p) => p.id));
          const uniqueNewPhotos = data.filter((item) => !existingIds.has(item.id));
          return [...prevPhotos, ...uniqueNewPhotos];
        });
      }
    } catch (err) {
      console.error('Error fetching photos:', err);
      setError(err.message || 'Failed to load photos. Please try again.');
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    fetchPhotos(1);
  }, [fetchPhotos]);

  // Infinite scroll using IntersectionObserver
  useEffect(() => {
    const sentinel = observerTargetRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (
          entry.isIntersecting &&
          !isFetchingRef.current &&
          !isLoading &&
          hasMore &&
          !error
        ) {
          setPage((prevPage) => {
            const nextPage = prevPage + 1;
            fetchPhotos(nextPage);
            return nextPage;
          });
        }
      },
      {
        root: null,
        rootMargin: '250px', // Preload before reaching the very bottom
        threshold: 0.1,
      }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [fetchPhotos, hasMore, isLoading, error]);

  /**
   * Increment like count for a specific photo
   */
  const handleLike = useCallback((photoId) => {
    setLikes((prevLikes) => ({
      ...prevLikes,
      [photoId]: (prevLikes[photoId] || 0) + 1,
    }));
  }, []);

  /**
   * Manual retry when an error occurs
   */
  const handleRetry = () => {
    setError(null);
    fetchPhotos(page);
  };

  return (
    <div className="gallery-container">
      {/* Photos feed */}
      <section className="photos-feed" aria-label="Photo list">
        {photos.map((photo) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            likes={likes[photo.id] || 0}
            onLike={handleLike}
          />
        ))}
      </section>

      {/* Loading state indicator */}
      {isLoading && (
        <div className="status-message loading-state" role="status" aria-live="polite">
          <div className="spinner" aria-hidden="true" />
          <span>{photos.length === 0 ? 'Loading gallery photos...' : 'Loading more photos...'}</span>
        </div>
      )}

      {/* Error state with retry option */}
      {error && !isLoading && (
        <div className="status-message error-state" role="alert">
          <p className="error-text">⚠️ {error}</p>
          <button type="button" className="retry-button" onClick={handleRetry}>
            Retry loading
          </button>
        </div>
      )}

      {/* End of feed indicator */}
      {!hasMore && photos.length > 0 && !isLoading && (
        <div className="status-message end-state">
          <span>🎉 You have reached the end of the photo gallery.</span>
        </div>
      )}

      {/* Intersection observer sentinel */}
      {hasMore && !error && (
        <div
          ref={observerTargetRef}
          className="scroll-sentinel"
          data-testid="scroll-sentinel"
          aria-hidden="true"
        />
      )}
    </div>
  );
}

export default PhotoGallery;
