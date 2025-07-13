import React, { useState } from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating = 0, onRatingChange, readOnly = false, size = 'normal' }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (rate) => {
    if (!readOnly && onRatingChange) {
      onRatingChange(rate);
    }
  };

  const handleMouseEnter = (rate) => {
    if (!readOnly) {
      setHoverRating(rate);
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverRating(0);
    }
  };

  const sizeClasses = {
    small: 'w-3 h-3',
    normal: 'w-6 h-6',
    large: 'w-8 h-8'
  };

  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, index) => {
        const rate = index + 1;
        return (
          <Star
            key={rate}
            onClick={() => handleClick(rate)}
            onMouseEnter={() => handleMouseEnter(rate)}
            onMouseLeave={handleMouseLeave}
            className={`
              ${sizeClasses[size]} cursor-${readOnly ? 'default' : 'pointer'}
              transition-colors duration-200
              ${rate <= (hoverRating || rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
            `}
          />
        );
      })}
    </div>
  );
};

export default StarRating; 