import React from 'react'
import BillingForm from '../components/BillingForm'
import OrderSummary from '../components/OrderSummary'
import './CheckOut.css'
const CheckOut = () => {
  return (
    <div className='app-container'>
      <BillingForm />
      <OrderSummary />
           
      
    </div>
  )
}

export default CheckOut
