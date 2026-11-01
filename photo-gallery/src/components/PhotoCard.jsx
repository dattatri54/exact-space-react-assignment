import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';

/**
 * PhotoCard component renders a single photo item with:
 * - Photo thumbnail using `download_url`
 * - Photo author name
 * - Font Awesome thumbs-up button with individual like count
 */
export function PhotoCard({ photo, likes = 0, onLike }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleLikeClick = () => {
    setIsAnimating(true);
    onLike(photo.id);
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <article className="photo-item" data-testid={`photo-item-${photo.id}`}>
      <div className="photo-thumbnail-wrapper">
        {!imageLoaded && !imageError && (
          <div className="photo-skeleton" aria-hidden="true" />
        )}
        {imageError ? (
          <div className="photo-fallback">
            <span>Image unavailable</span>
          </div>
        ) : (
          <img
            src={photo.download_url}
            alt={`Captured by ${photo.author}`}
            loading="lazy"
            className={`photo-image ${imageLoaded ? 'loaded' : ''}`}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true);
              setImageLoaded(true);
            }}
          />
        )}
      </div>

      <div className="photo-info">
        <span className="photo-author">
          Author: <strong>{photo.author}</strong>
        </span>

        <button
          type="button"
          className={`like-button ${isAnimating ? 'liked-bounce' : ''}`}
          onClick={handleLikeClick}
          aria-label={`Like photo by ${photo.author}. Current likes: ${likes}`}
          title="Like this photo"
          data-testid={`like-btn-${photo.id}`}
        >
          <FontAwesomeIcon icon={faThumbsUp} className="thumbs-up-icon" />
          <span className="like-count" data-testid={`like-count-${photo.id}`}>
            {likes}
          </span>
        </button>
      </div>
    </article>
  );
}

export default PhotoCard;
