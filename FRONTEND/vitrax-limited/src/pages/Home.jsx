import React from "react";
import Hero from "../components/firstpage/Hero";
import ShopByCategory from "../components/home/ShopByCategory";
import FeaturedProducts from "../components/firstpage/FeaturedProducts";
import BestSellers from "../components/firstpage/BestSellers";
import NewArrivals from "../components/firstpage/NewArrivals";
import BrandStory from "../components/home/BrandStory";
import BlogSection from "../components/firstpage/BlogSection";
import Testimonials from "../components/home/Testimonials";
import NewsletterSection from "../components/home/NewsletterSection";
import SocialsSection from "../components/firstpage/SocialsSection";

const Home = () => {
  return (
    <div>
      <Hero />
      <ShopByCategory />
      <FeaturedProducts />
      <BestSellers />
      <NewArrivals />
      <BrandStory />
      <BlogSection />
      <Testimonials />
      <NewsletterSection />
      <SocialsSection />
    </div>
  );
};

export default Home;
