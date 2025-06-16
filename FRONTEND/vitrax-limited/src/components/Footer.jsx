import React from 'react'
import './Footer.css'
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className='footer'>
        <div className='footer-container'>
            {/**Address Section */}
            <div className='footer-column'>
                <p className='footer-title'>400 University Drive Suite 200 Coral Gables,</p>
                <p className='footer-subtitle'>FL 33134 USA</p>
            </div>

            {/**Links Section */}
            <div className='footer-column'>
                <h4>Links</h4>

                <ul className='footer-links'>
                    <li><Link to="/"  className='footer-link'>Home</Link></li>
                    <li><Link to="/shop"  className='footer-link'>Shop</Link></li>
                    <li><Link to="/about"  className='footer-link'>About</Link></li>
                    <li><Link to="/contact"  className='footer-link'>Contact</Link></li>
                </ul>
            </div>

            {/**Help Section */}
            <div className='footer-column newsletter'>
                <h4>Newsletter</h4>

                <div className='newsletter-input'>
                    <input type="email" placeholder="Enter your email" />
                    <Link to=''>
                        <button className='newsletter-btn'>Subscribe</button>
                    </Link>
                </div>
            </div>
        </div>

        {/**Copyright Section */}
        <div className='footer-bottom'>
            <p>2025 Vitrax Limted. All rights reserved</p>
        </div>
    </footer>
  )
}

export default Footer
