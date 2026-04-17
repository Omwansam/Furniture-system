import React from "react";
import { Link } from "react-router-dom";
import "./ShopByCategory.css";

const CATEGORIES = [
  { slug: "sofas", label: "Living", blurb: "Sofas & lounges" },
  { slug: "dining", label: "Dining", blurb: "Tables & seating" },
  { slug: "beds", label: "Bedroom", blurb: "Restful layers" },
  { slug: "office", label: "Office", blurb: "Focused workspaces" },
  { slug: "storage", label: "Storage", blurb: "Calm utility" },
  { slug: "lighting", label: "Lighting", blurb: "Warmth & tone" },
];

const ShopByCategory = () => {
  return (
    <section className="shop-cats section-pad">
      <div className="container">
        <header className="shop-cats-header">
          <p className="eyebrow">Shop by category</p>
          <h2>Rooms to build around</h2>
        </header>
        <div className="shop-cats-grid">
          {CATEGORIES.map((c) => (
            <Link key={c.slug} to={`/shop/${c.slug}`} className="shop-cat-card">
              <span className="shop-cat-label">{c.label}</span>
              <span className="shop-cat-blurb">{c.blurb}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;
