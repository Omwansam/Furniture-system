import React from "react";
import { Link } from "react-router-dom";
import Logo from '../../assets/Logo.png'
import "./ShopHeader.css";

const ShopHeader = () => {
  return (
    <div className="shop-header">
      <div className="shop-content">
        <img src={Logo} alt="Logo" className="shop-logo" />
        <h1>Shop</h1>
        <p className="breadcrumb">
          <Link to="/" className="breadcrumb-link">Home</Link> 
          <span className="breadcrumb-separator">&gt;</span>
          <span className="active">Shop</span>
        </p>
      </div>
    </div>
  );
};

export default ShopHeader;
