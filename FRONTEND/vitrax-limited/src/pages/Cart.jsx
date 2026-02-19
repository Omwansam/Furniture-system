import React from 'react'
import SingleCart from '../components/SingleCart'
import './Cart.css'

const Cart = () => {
  return (
    <div className="cart-page">
      <div className="cart-page-container">
        <h1>Shopping Cart</h1>
        <SingleCart />
      </div>
    </div>
  )
}

export default Cart
