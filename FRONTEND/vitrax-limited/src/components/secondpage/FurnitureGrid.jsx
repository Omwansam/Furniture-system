import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiFilter } from "react-icons/fi";
import "./FurntureGrid.css";
import { getPrimaryImageUrl, handleImageError } from "../../utils/imageUtils";

const FurnitureGrid = ({
  products = [],
  loading = false,
  error = null,
  categoryName = "",
  searchQuery = "",
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [sortOrder, setSortOrder] = useState("default");
  const [priceMax, setPriceMax] = useState("");
  const [material, setMaterial] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortOrder, priceMax, material, products.length, categoryName]);

  const filteredSorted = useMemo(() => {
    let list = [...products];
    const q = (searchQuery || "").toLowerCase();
    if (q) {
      list = list.filter((p) => {
        const name = (p.product_name || "").toLowerCase();
        const desc = (p.product_description || "").toLowerCase();
        return name.includes(q) || desc.includes(q);
      });
    }
    const max = parseFloat(priceMax);
    if (!Number.isNaN(max) && max > 0) {
      list = list.filter((p) => Number(p.product_price) <= max);
    }
    const mat = (material || "").trim().toLowerCase();
    if (mat) {
      list = list.filter((p) => {
        const blob = `${p.product_name || ""} ${p.product_description || ""}`.toLowerCase();
        return blob.includes(mat);
      });
    }

    if (sortOrder === "priceLowToHigh") {
      list.sort((a, b) => Number(a.product_price) - Number(b.product_price));
    } else if (sortOrder === "priceHighToLow") {
      list.sort((a, b) => Number(b.product_price) - Number(a.product_price));
    } else if (sortOrder === "newest") {
      list.sort((a, b) => {
        const da = a.created_at ? new Date(a.created_at).getTime() : 0;
        const db = b.created_at ? new Date(b.created_at).getTime() : 0;
        if (db !== da) return db - da;
        return Number(b.product_id) - Number(a.product_id);
      });
    }

    return list;
  }, [products, searchQuery, priceMax, material, sortOrder]);

  const totalPages = Math.ceil(filteredSorted.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedProducts = filteredSorted.slice(startIndex, startIndex + itemsPerPage);

  if (loading) return <div className="loading-message">Loading products…</div>;
  if (error) return <div className="error-message">Error: {error}</div>;
  if (products.length === 0) {
    return (
      <div className="no-products-message">
        <h3>No products found</h3>
        <p>There are no products available in this category at the moment.</p>
        <Link to="/shop" className="back-to-shop-btn">
          Back to All Products
        </Link>
      </div>
    );
  }

  return (
    <section className="furnitures-section">
      <div className="furnitures-container">
        <div className="filter-bar">
          <button
            type="button"
            className="filter-btn"
            aria-expanded={showFilters}
            onClick={() => setShowFilters((v) => !v)}
          >
            <FiFilter className="filter-icon" />
          </button>
          <span>
            Showing {filteredSorted.length === 0 ? 0 : startIndex + 1} -{" "}
            {Math.min(startIndex + itemsPerPage, filteredSorted.length)} of {filteredSorted.length}{" "}
            results
            {categoryName ? ` · ${categoryName}` : ""}
          </span>
          <label>
            Per page
            <input
              type="number"
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              min="1"
              max="24"
            />
          </label>
          <label>
            Sort
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
              <option value="default">Featured</option>
              <option value="newest">Newest</option>
              <option value="priceLowToHigh">Price: Low to High</option>
              <option value="priceHighToLow">Price: High to Low</option>
            </select>
          </label>
        </div>

        {showFilters && (
          <div className="filter-panel" style={{ marginBottom: "1rem", display: "flex", flexWrap: "wrap", gap: "1rem" }}>
            <label>
              Max price (Ksh)
              <input
                type="number"
                min="0"
                placeholder="e.g. 50000"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                style={{ marginLeft: 8, padding: "0.35rem 0.5rem", borderRadius: 8 }}
              />
            </label>
            <label>
              Material / keyword
              <input
                type="text"
                placeholder="wood, leather…"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                style={{ marginLeft: 8, padding: "0.35rem 0.5rem", borderRadius: 8, minWidth: 160 }}
              />
            </label>
          </div>
        )}

        {filteredSorted.length === 0 ? (
          <div className="no-products-message">
            <h3>No matches</h3>
            <p>Try clearing filters or a different search.</p>
            <Link to="/shop" className="back-to-shop-btn">
              View all products
            </Link>
          </div>
        ) : (
          <div className="products-grid">
            {displayedProducts.map((product) => (
              <div key={product.product_id} className="essentials-card">
                <Link to={`/product/${product.product_id}`} className="essentials">
                  <img
                    src={getPrimaryImageUrl(product)}
                    alt={product.product_name}
                    onError={(e) => handleImageError(e)}
                  />
                  <h3>{product.product_name}</h3>
                  <p>Ksh {Number(product.product_price).toLocaleString()}</p>
                </Link>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <button type="button" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
              Previous
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                type="button"
                key={index}
                className={currentPage === index + 1 ? "active" : ""}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FurnitureGrid;
