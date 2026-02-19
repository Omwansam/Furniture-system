// Image utility functions for consistent image handling across the app

/**
 * Get the primary image URL for a product
 * @param {Object} product - Product object with images array or image_url
 * @param {string} fallback - Fallback image URL
 * @returns {string} - Image URL
 */
export const getPrimaryImageUrl = (product, fallback = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Crect width='60' height='60' fill='%23f8f9fa'/%3E%3Cpath d='M30 20c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10-4.5-10-10-10zm0 16c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z' fill='%236c757d'/%3E%3C/svg%3E") => {
  console.log('getPrimaryImageUrl called with product:', product);
  
  // If product has image_url (from cart/order), use it
  if (product.image_url) {
    console.log('Using image_url:', product.image_url);
    // Handle different URL formats
    if (product.image_url.startsWith('http')) {
      return product.image_url;
    } else if (product.image_url.startsWith('/')) {
      return `http://localhost:5000${product.image_url}`;
    } else if (product.image_url.startsWith('uploads/')) {
      // Backend returns "uploads/filename.jpg", convert to full URL
      return `http://localhost:5000/static/${product.image_url}`;
    } else {
      // This is just a filename, construct the full URL
      return `http://localhost:5000/static/uploads/${product.image_url}`;
    }
  }
  
  // If product has images array, find primary image
  if (product.images && Array.isArray(product.images)) {
    const primaryImage = product.images.find(img => img.is_primary) || product.images[0];
    if (primaryImage && primaryImage.image_url) {
      console.log('Using images array, primary image:', primaryImage.image_url);
      if (primaryImage.image_url.startsWith('http')) {
        return primaryImage.image_url;
      } else if (primaryImage.image_url.startsWith('/')) {
        return `http://localhost:5000${primaryImage.image_url}`;
      } else {
        return `http://localhost:5000/static/uploads/${primaryImage.image_url}`;
      }
    }
  }
  
  // If product has a single image field
  if (product.image) {
    console.log('Using single image field:', product.image);
    if (product.image.startsWith('http')) {
      return product.image;
    } else if (product.image.startsWith('/')) {
      return `http://localhost:5000${product.image}`;
    } else {
      return `http://localhost:5000/static/uploads/${product.image}`;
    }
  }
  
  console.log('No image found, using fallback');
  return fallback;
};

/**
 * Handle image load error
 * @param {Event} event - Image error event
 * @param {string} fallback - Fallback image URL
 */
export const handleImageError = (event, fallback = "/placeholder-image.jpg") => {
  event.target.src = fallback;
  event.target.onerror = null; // Prevent infinite loop
};

/**
 * Get optimized image URL for different sizes
 * @param {string} imageUrl - Original image URL
 * @param {string} size - Size variant (thumb, small, medium, large)
 * @returns {string} - Optimized image URL
 */
export const getOptimizedImageUrl = (imageUrl, size = 'medium') => {
  if (!imageUrl) return "/placeholder-image.jpg";
  
  // For now, return the original URL regardless of size
  // In the future, you can implement image optimization here based on size parameter
  console.log(`Requested size: ${size}`); // Use the parameter to avoid linter warning
  return imageUrl;
};
