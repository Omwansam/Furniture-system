import React, { useState } from "react";
import './ProductDetails.css'

const ProductDetails = () => {
  const [activeTab, setActiveTab] = useState("description");

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
          <p>
            Embodying the raw, wayward spirit of rock 'n' roll, the Kilburn
            portable active stereo speaker takes the unmistakable look and sound
            of Marshall, unplugs the chords, and takes the show on the road.
          </p>
          <p>
            Weighing in under 7 pounds, the Kilburn is a lightweight piece of
            vintage styled engineering. Setting the bar as one of the loudest
            speakers in its class, the Kilburn is a compact, stout-hearted hero
            with a well-balanced audio which boasts a clear midrange and
            extended highs for a sound that is both articulate and pronounced.
          </p>
        </div>
      )}

      {/* Product Images */}
      <div className="product-images">
        <img src="/images/sofa1.jpg" alt="Sofa 1" />
        <img src="/images/sofa2.jpg" alt="Sofa 2" />
      </div>
    </div>
  );
};

export default ProductDetails;
