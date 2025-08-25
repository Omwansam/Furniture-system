import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { ProtectedRoute } from "./context/ProtectedRoute";

import Navbar from "./components/Navbar";
import SmallHeader from "./components/SmallHeader";
import CategoryHeader from "./components/CategoryHeader";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Footer from "./components/Footer";
import Blog from "./pages/Blog";
import BlogPost from "./components/BlogPost";
import SingleProduct from "./pages/SingleProduct";
import CheckOut from "./pages/CheckOut";
import Cart from "./pages/Cart";
import OrderConfirmation from "./pages/OrderConfirmation";
import LoginPage from "./auth/LoginPage";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Downloads from "./pages/Downloads";
import Addresses from "./pages/Addresses";
import AccountDetails from "./pages/AccountDetails";
import Coupons from "./pages/Coupons";
import Wishlist from "./pages/Wishlist";
import AdminDashboard from "./components/adminpage/Dashboard";
import AdminLoginPage from "./auth/AdminLoginPage";



const Layout = ({ children }) => {
  const location = useLocation();
  const hideLayout = location.pathname.startsWith("/admin") || location.pathname === "/login";
  return (
    <>
              {!hideLayout && <SmallHeader />}
        {!hideLayout && <Navbar />}
        {!hideLayout && <CategoryHeader />}
      {children}
      {!hideLayout && <Footer />}
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <Router>
            <Layout>
              <Routes>
                {/* Public */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/shop/:category" element={<Shop />} />
                <Route path="/singleproduct/:productId" element={<SingleProduct />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />

                {/* User Protected */}
                <Route
                  path="/checkout"
                  element={<CheckOut />}
                />
                <Route
                  path="/cart"
                  element={<Cart />}
                />
                <Route
                  path="/order-confirmation/:orderId"
                  element={<OrderConfirmation />}
                />
                
                {/* Account Routes - Temporarily without protection for testing */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/downloads" element={<Downloads />} />
                <Route path="/addresses" element={<Addresses />} />
                <Route path="/account-details" element={<AccountDetails />} />
                <Route path="/coupons" element={<Coupons />} />
                <Route path="/wishlist" element={<Wishlist />} />

                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/admin" element={<AdminLoginPage />} />
                
                <Route
                  path="/admin/dashboard/*"
                  element={
                    <ProtectedRoute roles={["admin"]}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Layout>
        </Router>
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
