import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Footer from "./components/Footer";
import Blog from "./pages/Blog";
import SingleProduct from "./pages/SingleProduct";
import CheckOut from "./pages/CheckOut";
import Cart from "./pages/Cart";
import LoginPage from "./auth/LoginPage";
import Dashboard from "./components/adminpage/Dashboard";
import AdminLoginPage from "./auth/AdminLoginPage";

// import DashboardOverview from "./components/adminpage/DashboardOverview";



// Component to conditionally render layout
const Layout = ({ children }) => {
  const location = useLocation();
  const hideLayout = location.pathname.startsWith("/admin") || location.pathname === "/login";

  return (
    <>
      {!hideLayout && <Navbar />}
      {children}
      {!hideLayout && <Footer />}
    </>
  );
};


function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/singleproduct/:productId" element={<SingleProduct />} />
          <Route path="/checkout" element={<CheckOut />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          
          {/***Admin Routes */}
          <Route path="/admin" element={<AdminLoginPage/>} />
          <Route 
            path="/admin/*"
            element={
             
                <Dashboard/>
              
            }
          />


          {/**Fallback **/}
          <Route path="*" element={<Navigate to="/" />} />        
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;