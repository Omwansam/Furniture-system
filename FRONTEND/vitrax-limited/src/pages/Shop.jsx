import React, { useState, useEffect, useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import FurnitureGrid from "../components/secondpage/FurnitureGrid";
import Features from "../components/secondpage/Features";
import ShopHeader from "../components/secondpage/ShopHeader";
import { getProducts, getProductsByCategory } from "../components/productService";

const Shop = () => {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const searchQuery = (searchParams.get("q") || "").trim();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryName, setCategoryName] = useState("");

  const categoryMap = useMemo(
    () => ({
      sofas: "Sofas & Couches",
      beds: "Beds & Bedroom",
      chairs: "Chairs & Seating",
      tables: "Tables & Desks",
      lighting: "Lighting",
      rugs: "Rugs & Carpets",
      dining: "Dining Room",
      office: "Office Furniture",
      outdoor: "Outdoor",
      storage: "Storage",
    }),
    []
  );

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        let data;
        if (category) {
          data = await getProductsByCategory(category);
          setCategoryName(categoryMap[category] || category);
        } else {
          data = await getProducts();
          setCategoryName("All Products");
        }
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message);
        try {
          const allProducts = await getProducts();
          setProducts(allProducts);
          setCategoryName("All Products");
        } catch {
          setError("Failed to load products");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, categoryMap]);

  return (
    <div>
      <ShopHeader categoryName={categoryName} />
      <FurnitureGrid
        products={products}
        loading={loading}
        error={error}
        categoryName={categoryName}
        searchQuery={searchQuery}
      />
      <Features />
    </div>
  );
};

export default Shop;
