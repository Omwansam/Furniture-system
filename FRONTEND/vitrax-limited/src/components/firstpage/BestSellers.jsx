import React from 'react'
import { Link } from "react-router-dom";
import './BestSeller.css'
import Seller1 from '../../assets/Seller1.png'
import Seller2 from '../../assets/Seller2.png'
import Seller3 from '../../assets/Seller3.png'
import Seller4 from '../../assets/Seller4.png'



const products = [
    { 
        name: "Trenton modular sofa",
        price: "Rs. 25,000.00", 
        image:  Seller1,
    },
    { 
        name: "Granite dining table with dining chair", 
        price: "Rs. 25,000.00", 
        image: Seller2,
    },
    { 
        name: "Outdoor bar table and stool", 
        price: "Rs. 25,000.00", 
        image: Seller3,
    },
    { 
        name: "Plain console with teak mirror", 
        price: "Rs. 25,000.00", 
        image: Seller4, 
    },
  ];

const BestSellers = () => {
  return (
    <section className='best-sellers'>
        <div className='sellers-container'>
            <div className='sellers-details'>
                <h2>Top Picks For You</h2>
                <p className='subtitle'>
                    Find a bright ideal to sut your great selection of 
                    suspension, floor and table lights.
                </p>
            </div>

            <div className='sellers-grid'>
                {products.map((product, index) => (
                    <div key={index} className='product-item'>
                        <img src={product.image}  alt={product.name}/>
                        <h3>{product.name}</h3>
                        <p className='product-price'>{product.price}</p>
                    </div>
                ))}
            </div>

            
            <Link to='' className='sellers-btn'  >
            <p >View More</p>
            </Link>
            
        </div>
    </section>
  )
}

export default BestSellers
