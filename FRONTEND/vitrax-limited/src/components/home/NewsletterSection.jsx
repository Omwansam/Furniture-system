import React, { useState } from "react";
import { newsletterService } from "../newsletterService";
import "./NewsletterSection.css";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setBusy(true);
    setStatus(null);
    try {
      await newsletterService.subscribe(email.trim());
      setStatus({ ok: true, message: "Thanks—you are on the list." });
      setEmail("");
    } catch {
      setStatus({ ok: false, message: "Could not subscribe. Try again shortly." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="newsletter-section section-pad">
      <div className="newsletter-inner container">
        <div>
          <p className="eyebrow">Newsletter</p>
          <h2>Newsletter</h2>
        </div>
        <form className="newsletter-form" onSubmit={onSubmit}>
          <input
            type="email"
            required
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Email for newsletter"
          />
          <button type="submit" className="newsletter-submit" disabled={busy}>
            {busy ? "…" : "Subscribe"}
          </button>
        </form>
        {status && (
          <p className={`newsletter-status ${status.ok ? "ok" : "err"}`} role="status">
            {status.message}
          </p>
        )}
      </div>
    </section>
  );
};

export default NewsletterSection;
