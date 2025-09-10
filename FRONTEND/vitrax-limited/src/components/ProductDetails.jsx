import React, { useState } from "react";
import './ProductDetails.css'

const ProductDetails = ({ product }) => {
  const [activeTab, setActiveTab] = useState("description");

  // Default content if no product is provided
  const defaultDescription = "This premium furniture piece combines style and functionality to enhance your living space. Crafted with attention to detail and quality materials, it's designed to provide comfort and elegance for years to come.";

  const productDescription = product?.product_description || defaultDescription;
  const productImages = product?.images || [];

  return (
    <div className="product-details">
      {/* Tab Navigation */}
      <div className="tabs">
        <button
          className={activeTab === "description" ? "active" : ""}
          onClick={() => setActiveTab("description")}
        >
          Description
        </button>
        <button
          className={activeTab === "additional-info" ? "active" : ""}
          onClick={() => setActiveTab("additional-info")}
        >
          Additional Information
        </button>
        <button
          className={activeTab === "reviews" ? "active" : ""}
          onClick={() => setActiveTab("reviews")}
        >
          Reviews <span className="review-count">[5]</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "description" && (
        <div className="tab-content">
          <p>{productDescription}</p>
          <p>
            This premium furniture piece is designed to complement modern living spaces. 
            With its elegant design and superior craftsmanship, it offers both style and 
            functionality that will enhance your home for years to come.
          </p>
        </div>
      )}

      {activeTab === "additional-info" && (
        <div className="tab-content">
          <div className="additional-info-grid">
            <div className="info-item">
              <h4>Dimensions</h4>
              <p>Length: 200cm | Width: 90cm | Height: 85cm</p>
            </div>
            <div className="info-item">
              <h4>Material</h4>
              <p>Premium wood frame with high-quality upholstery</p>
            </div>
            <div className="info-item">
              <h4>Weight</h4>
              <p>Approximately 45kg</p>
            </div>
            <div className="info-item">
              <h4>Assembly</h4>
              <p>Professional assembly recommended</p>
            </div>
            <div className="info-item">
              <h4>Warranty</h4>
              <p>1 year manufacturer warranty</p>
            </div>
            <div className="info-item">
              <h4>Care Instructions</h4>
              <p>Regular dusting and occasional professional cleaning</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "reviews" && (
        <div className="tab-content">
          <div className="reviews-section">
            <div className="reviews-summary">
              <div className="rating-overview">
                <span className="overall-rating">4.5</span>
                <div className="stars">⭐⭐⭐⭐☆</div>
                <span className="total-reviews">Based on 5 reviews</span>
              </div>
            </div>
            
            <div className="reviews-list">
              <div className="review-item">
                <div className="review-header">
                  <span className="reviewer-name">John M.</span>
                  <div className="review-rating">⭐⭐⭐⭐⭐</div>
                </div>
                <p className="review-text">Excellent quality and fast delivery. Very satisfied with my purchase!</p>
                <span className="review-date">2 days ago</span>
              </div>
              
              <div className="review-item">
                <div className="review-header">
                  <span className="reviewer-name">Sarah K.</span>
                  <div className="review-rating">⭐⭐⭐⭐☆</div>
                </div>
                <p className="review-text">Beautiful piece of furniture. Matches perfectly with my home decor.</p>
                <span className="review-date">1 week ago</span>
              </div>
              
              <div className="review-item">
                <div className="review-header">
                  <span className="reviewer-name">Mike R.</span>
                  <div className="review-rating">⭐⭐⭐⭐⭐</div>
                </div>
                <p className="review-text">Great value for money. Highly recommend this product!</p>
                <span className="review-date">2 weeks ago</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Images */}
      {productImages.length > 0 && (
        <div className="product-images">
          {productImages.slice(0, 4).map((img, index) => (
            <img 
              key={index}
              src={img.image_url.startsWith('http') ? img.image_url : `http://localhost:5000${img.image_url}`}
              alt={`${product?.product_name || 'Product'} ${index + 1}`}
              onError={(e) => {
                e.target.src = "/placeholder-image.jpg";
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
