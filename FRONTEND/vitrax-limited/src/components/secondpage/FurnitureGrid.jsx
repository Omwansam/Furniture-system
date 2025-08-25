import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom';
import { FiFilter } from "react-icons/fi";
import "./FurntureGrid.css";
import { getProducts } from '../productService'



const FurnitureGrid = ({ products = [], loading = false, error = null, categoryName = '' }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(8);
    const [sortOrder, setSortOrder] = useState("default");

    const sortedProducts = [...products].sort((a, b) => {
        if (sortOrder === "priceLowToHigh") return a.product_price - b.product_price;
        if (sortOrder === "priceHighToLow") return b.product_price - a.product_price;
        return 0;
    });

    const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

    {/**  const handlePageChange = (page) => setCurrentPage(page);
    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    }; **/}


   {/**  const handleSortChange = (e) => setSortOrder(e.target.value);**/}
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const displayedProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage);

    if (loading) return <div className="loading-message">Loading products...</div>;
    if (error) return <div className="error-message">Error: {error}</div>;
    if (products.length === 0) return (
      <div className="no-products-message">
        <h3>No products found</h3>
        <p>There are no products available in this category at the moment.</p>
        <Link to="/shop" className="back-to-shop-btn">Back to All Products</Link>
      </div>
    );


  return (
    <section className='furnitures-section'>
    <div className='furnitures-container'>
        <div className='filter-bar'>
            <button className='filter-btn'>
                <FiFilter className='filter-icon' />
            </button>
            <span>Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, sortedProducts.length)} of {sortedProducts.length} results</span>
            <label>
                Show
                <input type="number" value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} min="1" max="16" />
            </label>
            <label>
                Sort by
                <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                    <option value="default">Default</option>
                    <option value="priceLowToHigh">Price: Low to High</option>
                    <option value="priceHighToLow">Price: High to Low</option>
                </select>
            </label>
        </div>

        <div className='products-grid'>
            {displayedProducts.map((product) => (
                <div key={product.product_id} className='essentials-card'>
                    <Link to={`/singleproduct/${product.product_id}`} className='essentials'>
                        {product.images.length > 0 && (
                            <img 
                                src={product.images[0].image_url} 
                                alt={product.product_name}
                                onError={(e) => { e.target.src = '/placeholder-image.jpg'; }}
                            />
                        )}
                        <h3>{product.product_name}</h3>
                        <p>Ksh: {product.product_price.toLocaleString()}</p>
                    </Link>
                </div>
            ))}
        </div>

        {totalPages > 1 && (
            <div className="pagination">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
                {[...Array(totalPages)].map((_, index) => (
                    <button key={index} className={currentPage === index + 1 ? "active" : ""} onClick={() => setCurrentPage(index + 1)}>
                        {index + 1}
                    </button>
                ))}
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
            </div>
        )}
    </div>
</section>
  )
}

export default FurnitureGrid
