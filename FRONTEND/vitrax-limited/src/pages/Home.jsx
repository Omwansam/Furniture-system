import React from 'react'
import Hero from '../components/firstpage/Hero'
import FeaturedProducts from '../components/firstpage/FeaturedProducts'
import BestSellers from '../components/firstpage/BestSellers'
import NewArrivals from '../components/firstpage/NewArrivals'
import BlogSection from '../components/firstpage/BlogSection'
import SocialsSection from '../components/firstpage/SocialsSection'


const Home = () => {
  return (
    <div>
      <Hero />
      <FeaturedProducts />
      <BestSellers />
      <NewArrivals />
      <BlogSection />
      <SocialsSection />
    </div>
  )
}

export default Home
