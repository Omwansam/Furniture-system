import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaCouch, 
  FaBed, 
  FaChair, 
  FaTable, 
  FaLightbulb, 
  FaSquare,
  FaChevronRight,
  FaChevronLeft
} from 'react-icons/fa';
import './CategoryHeader.css';

const CategoryHeader = () => {
  const location = useLocation();

  const categories = [
    {
      id: 'sofas',
      name: 'Sofas & Couches',
      icon: <FaCouch />,
      path: '/shop/sofas'
    },
    {
      id: 'beds',
      name: 'Beds & Bedroom',
      icon: <FaBed />,
      path: '/shop/beds'
    },
    {
      id: 'chairs',
      name: 'Chairs & Seating',
      icon: <FaChair />,
      path: '/shop/chairs'
    },
    {
      id: 'tables',
      name: 'Tables & Desks',
      icon: <FaTable />,
      path: '/shop/tables'
    },
    {
      id: 'lighting',
      name: 'Lighting',
      icon: <FaLightbulb />,
      path: '/shop/lighting'
    },
    {
      id: 'rugs',
      name: 'Rugs & Carpets',
      icon: <FaSquare />,
      path: '/shop/rugs'
    },
    {
      id: 'dining',
      name: 'Dining Room',
      icon: <FaTable />,
      path: '/shop/dining'
    },
    {
      id: 'office',
      name: 'Office Furniture',
      icon: <FaChair />,
      path: '/shop/office'
    },
    {
      id: 'outdoor',
      name: 'Outdoor',
      icon: <FaCouch />,
      path: '/shop/outdoor'
    },
    {
      id: 'storage',
      name: 'Storage',
      icon: <FaTable />,
      path: '/shop/storage'
    }
  ];

  return (
    <div className="category-header">
      <div className="category-header-container">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={category.path}
            className={`category-item ${location.pathname.includes(category.path) ? 'active' : ''}`}
          >
            <div className="category-icon">
              {category.icon}
            </div>
            <span className="category-name">{category.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryHeader;
