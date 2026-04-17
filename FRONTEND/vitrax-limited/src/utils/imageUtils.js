import { assetUrl } from "../config/api";

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Crect width='60' height='60' fill='%23edeae3'/%3E%3Cpath d='M30 20c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10-4.5-10-10-10zm0 16c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z' fill='%239ca3af'/%3E%3C/svg%3E";

/**
 * Primary image URL for cart, PDP, wishlist, etc.
 */
export const getPrimaryImageUrl = (product, fallback = PLACEHOLDER) => {
  if (!product) return fallback;

  if (product.image_url) {
    const u = product.image_url;
    if (u.startsWith("http")) return u;
    return assetUrl(u);
  }

  if (product.images && Array.isArray(product.images)) {
    const primaryImage = product.images.find((img) => img.is_primary) || product.images[0];
    if (primaryImage?.image_url) {
      const u = primaryImage.image_url;
      if (u.startsWith("http")) return u;
      return assetUrl(u);
    }
  }

  if (product.image) {
    const u = product.image;
    if (u.startsWith("http")) return u;
    return assetUrl(u);
  }

  return fallback;
};

export const handleImageError = (event, fallback = PLACEHOLDER) => {
  event.target.src = fallback;
  event.target.onerror = null;
};

export const getOptimizedImageUrl = (imageUrl, size = "medium") => {
  if (!imageUrl) return PLACEHOLDER;
  void size;
  return imageUrl;
};
