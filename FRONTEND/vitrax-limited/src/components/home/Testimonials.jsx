import React from "react";
import "./Testimonials.css";

const QUOTES = [
  {
    quote: "The sofa arrived exactly as pictured—soft light, perfect proportions. Our living room finally feels finished.",
    name: "Amara K.",
    role: "Nairobi",
  },
  {
    quote: "Understated quality. Delivery was smooth and the team communicated every step.",
    name: "James O.",
    role: "Kisumu",
  },
  {
    quote: "We outfitted a full apartment from the shop grid filters. Saved weeks of decision fatigue.",
    name: "Lena M.",
    role: "Mombasa",
  },
];

const Testimonials = () => {
  return (
    <section className="testimonials section-pad">
      <div className="container">
        <header className="testimonials-header">
          <p className="eyebrow">From our homes to yours</p>
          <h2>Loved by customers</h2>
        </header>
        <div className="testimonials-grid">
          {QUOTES.map((t) => (
            <figure key={t.name} className="testimonial-card">
              <blockquote>&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption>
                <span className="name">{t.name}</span>
                <span className="role">{t.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
