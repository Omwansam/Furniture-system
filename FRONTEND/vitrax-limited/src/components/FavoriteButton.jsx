import React from 'react';
import { FaHeart } from 'react-icons/fa';
import { useFavorites } from '../context/FavoritesContext';
import './FavoriteButton.css';

const FavoriteButton = ({ product, size = 'medium', showText = false }) => {
  const { isFavorite, toggleFavorite } = useFavorites();

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product);
  };

  const favorite = isFavorite(product.id);

  return (
    <button
      className={`favorite-button ${size} ${favorite ? 'favorited' : ''}`}
      onClick={handleToggle}
      aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <FaHeart className="favorite-icon" />
      {showText && (
        <span className="favorite-text">
          {favorite ? 'Remove' : 'Add to Favorites'}
        </span>
      )}
    </button>
  );
};

export default FavoriteButton;
