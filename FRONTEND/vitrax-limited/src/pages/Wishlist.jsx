import React from "react";
import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import { getPrimaryImageUrl, handleImageError } from "../utils/imageUtils";
import "./Wishlist.css";

const Wishlist = () => {
  const { favorites, wishlistLoading, removeFromFavorites } = useFavorites();

  return (
    <div className="wishlist-page">
      <header className="wishlist-header">
        <h1>Wishlist</h1>
        <p>Saved pieces across devices when you are signed in.</p>
      </header>

      {wishlistLoading ? (
        <p className="text-muted">Loading…</p>
      ) : favorites.length === 0 ? (
        <div className="wishlist-empty">
          <p>No saved items yet.</p>
          <Link to="/shop" className="wishlist-cta">
            Browse shop
          </Link>
        </div>
      ) : (
        <ul className="wishlist-grid">
          {favorites.map((p) => {
            const id = p.product_id ?? p.id;
            return (
              <li key={id} className="wishlist-card">
                <Link to={`/product/${id}`} className="wishlist-thumb">
                  <img
                    src={getPrimaryImageUrl(p)}
                    alt={p.product_name || "Product"}
                    onError={(e) => handleImageError(e)}
                  />
                </Link>
                <div className="wishlist-meta">
                  <Link to={`/product/${id}`}>
                    <h2>{p.product_name || "Product"}</h2>
                  </Link>
                  <p className="wishlist-price">
                    Ksh {Number(p.product_price || 0).toLocaleString()}
                  </p>
                  <button type="button" className="wishlist-remove" onClick={() => void removeFromFavorites(id)}>
                    Remove
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Wishlist;
