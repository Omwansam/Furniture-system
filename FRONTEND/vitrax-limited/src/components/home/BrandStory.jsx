import React from "react";
import { Link } from "react-router-dom";
import "./BrandStory.css";

const BrandStory = () => {
  return (
    <section className="brand-story section-pad">
      <div className="brand-story-inner container">
        <div className="brand-story-copy">
          <p className="eyebrow">Designed for modern living</p>
          <h2>Quiet rooms. Honest materials.</h2>
          <p className="lead">
            Vitrax Home brings together sculptural silhouettes, tactile finishes, and layouts that feel
            calm the moment you walk in—so you can live with less noise and more intention.
          </p>
          <Link to="/about" className="btn-pill-secondary">
            Our story
          </Link>
        </div>
        <div className="brand-story-panel" aria-hidden="true" />
      </div>
    </section>
  );
};

export default BrandStory;
