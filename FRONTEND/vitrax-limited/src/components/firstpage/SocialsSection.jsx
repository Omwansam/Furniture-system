import React from 'react'
import './SocialsSection.css'
import {Link} from 'react-router-dom'

const SocialsSection = () => {
  return (
    <section className='socials-section'>
        <div className='socials-container'>
            
                <h2 className='socials-title'>Our Instagram</h2>
                <p className='socials-subtitle'>Follow our Store on Instagram</p>
            

            <Link to='' className='socials-btn'>
            Follow Us
            </Link>
        </div>
    </section>
  )
}

export default SocialsSection
