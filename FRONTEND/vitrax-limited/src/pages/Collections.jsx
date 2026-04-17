import React from "react";
import { Link } from "react-router-dom";
import "./Collections.css";

const COLLECTIONS = [
  {
    slug: "living",
    title: "Living room",
    subtitle: "Sofas, tables, and calm layouts",
    path: "/shop/sofas",
  },
  {
    slug: "dining",
    title: "Dining",
    subtitle: "Gatherings made effortless",
    path: "/shop/dining",
  },
  {
    slug: "bedroom",
    title: "Bedroom",
    subtitle: "Rest, refined",
    path: "/shop/beds",
  },
  {
    slug: "office",
    title: "Workspace",
    subtitle: "Focus-friendly forms",
    path: "/shop/office",
  },
];

const Collections = () => {
  return (
    <div className="collections-page">
      <header className="collections-hero">
        <p className="collections-eyebrow">Curated</p>
        <h1>Collections</h1>
        <p className="collections-lead">
          Shop room-inspired edits from Vitrax Home—minimal silhouettes, warm materials, and pieces
          chosen to work together.
        </p>
      </header>
      <div className="collections-grid">
        {COLLECTIONS.map((c) => (
          <Link key={c.slug} to={c.path} className="collections-card">
            <div className="collections-card-inner">
              <h2>{c.title}</h2>
              <p>{c.subtitle}</p>
              <span className="collections-cta">Explore</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Collections;
