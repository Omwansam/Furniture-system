import React from 'react'
import { Link } from 'react-router-dom'
import './Hero.css'
import hero1 from '../../assets/hero1.png'

const Hero = () => {
  return (
    <section className='hero-header'>
        <div className='hero-container'>

            {/**Left Side Text */}
            
                <div className='hero-text'>
                    <h1 className='heading'>Rocket single seater</h1>
                    <Link to='/shop'>
                    <p className='shop-now'>Shop Now</p>
                    </Link>
                
                </div>
                {/**Right Side Image */}
                <div className='hero-image'>
                    <img src={hero1} alt="Rocket single seater"/>
                </div>
            
        </div>
    </section>
  )
}

export default Hero
