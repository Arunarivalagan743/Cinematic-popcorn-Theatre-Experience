import React, { useState } from 'react';
import { imageMap } from '../utils/movieImages';

const MovieImage = ({ 
  src, 
  alt, 
  className = '', 
  fallbackSrc = null,
  aspectRatio = 'aspect-poster',
  objectFit = 'object-cover object-center',
  loading = 'lazy',
  onClick = null,
  ...props 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getImageSrc = () => {
    if (imageError && fallbackSrc) {
      return fallbackSrc;
    }
    
    if (src && src.startsWith('http')) {
      return src; // Use Cloudinary URL directly
    }
    
    if (src && imageMap[src]) {
      return imageMap[src];
    }
    
    return fallbackSrc || 'https://via.placeholder.com/300x400/333333/cccccc?text=No+Image';
  };

  const handleLoad = () => {
    setImageLoaded(true);
  };

  const handleError = (e) => {
    console.warn('Image failed to load:', src);
    setImageError(true);
    
    if (fallbackSrc && e.target.src !== fallbackSrc) {
      e.target.src = fallbackSrc;
    } else {
      e.target.src = 'https://via.placeholder.com/300x400/333333/cccccc?text=No+Image';
    }
  };

  return (
    <div 
      className={`movie-image-container ${aspectRatio} overflow-hidden ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <img
        src={getImageSrc()}
        alt={alt}
        className={`w-full h-full ${objectFit} transition-all duration-300 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
      
      {/* Loading placeholder */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          <div className="animate-pulse text-gray-400 text-sm">Loading...</div>
        </div>
      )}
    </div>
  );
};

export default MovieImage;