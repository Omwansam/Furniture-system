import React from "react";
import { Link } from "react-router-dom";
import Logo from '../../assets/Logo.png'
import "./ShopHeader.css";

const ShopHeader = ({ categoryName = 'Shop' }) => {
  return (
    <div className="shop-header">
      <div className="shop-content">
        <img src={Logo} alt="Logo" className="shop-logo" />
        <h1>{categoryName}</h1>
        <p className="breadcrumb">
          <Link to="/" className="breadcrumb-link">Home</Link> 
          <span className="breadcrumb-separator">&gt;</span>
          <Link to="/shop" className="breadcrumb-link">Shop</Link>
          {categoryName !== 'Shop' && categoryName !== 'All Products' && (
            <>
              <span className="breadcrumb-separator">&gt;</span>
              <span className="active">{categoryName}</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default ShopHeader;
