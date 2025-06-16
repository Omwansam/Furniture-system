import React from 'react'
import FurnitureGrid from '../components/secondpage/FurnitureGrid'
import Features from '../components/secondpage/Features'
import ShopHeader from '../components/secondpage/ShopHeader'

const shop = () => {
  return (
    <div>
      <ShopHeader />
      <FurnitureGrid />
      <Features />
    </div>
  )
}

export default shop
