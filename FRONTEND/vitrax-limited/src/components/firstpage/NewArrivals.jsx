import React from 'react'
import './NewArrivals.css';
import { Link } from "react-router-dom";
import SofaImage from '../../assets/SofaImage.png'



const NewArrivals = () => {
    return(
        <section className='new-arrival'>
            <div className='arrivals-container'>
            <div className='arrivals-image'>
                    <img src={SofaImage} alt="Asgaard Sofa" />
                </div>
                
                <div className='arrivals-content'>
                    <p className='arrivals-subtitle'>New Arrivals</p>
                    <h2 className='arrivals-title'>Asgaard Sofa</h2>

                    <Link to=' '>
                        <button className='order-btn'> Order Now</button>
                    </Link>
                </div>

                
            </div>
        </section>
    )
}

export default NewArrivals;