import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import FurnitureGrid from '../components/secondpage/FurnitureGrid';
import Features from '../components/secondpage/Features';
import ShopHeader from '../components/secondpage/ShopHeader';
import { getProducts, getProductsByCategory } from '../components/productService';

const Shop = () => {
  const { category } = useParams();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryName, setCategoryName] = useState('');

  // Map category slugs to display names
  const categoryMap = {
    'sofas': 'Sofas & Couches',
    'beds': 'Beds & Bedroom',
    'chairs': 'Chairs & Seating',
    'tables': 'Tables & Desks',
    'lighting': 'Lighting',
    'rugs': 'Rugs & Carpets',
    'dining': 'Dining Room',
    'office': 'Office Furniture',
    'outdoor': 'Outdoor',
    'storage': 'Storage'
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let data;
        if (category) {
          // Fetch products by category
          data = await getProductsByCategory(category);
          setCategoryName(categoryMap[category] || category);
        } else {
          // Fetch all products
          data = await getProducts();
          setCategoryName('All Products');
        }
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
        // Fallback to all products if category fetch fails
        try {
          const allProducts = await getProducts();
          setProducts(allProducts);
          setCategoryName('All Products');
        } catch (fallbackErr) {
          setError('Failed to load products');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  return (
    <div>
      <ShopHeader categoryName={categoryName} />
      <FurnitureGrid 
        products={products} 
        loading={loading} 
        error={error}
        categoryName={categoryName}
      />
      <Features />
    </div>
  );
};

export default Shop;
