import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
  useParams,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { ProtectedRoute } from "./context/ProtectedRoute";
import { ErrorBoundary } from "./components/ErrorBoundary";

import Navbar from "./components/Navbar";
import SmallHeader from "./components/SmallHeader";
import CategoryHeader from "./components/CategoryHeader";
import Footer from "./components/Footer";
import AccountLayout from "./components/AccountLayout";

const Home = lazy(() => import("./pages/Home"));
const Shop = lazy(() => import("./pages/Shop"));
const Collections = lazy(() => import("./pages/Collections"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./components/BlogPost"));
const SingleProduct = lazy(() => import("./pages/SingleProduct"));
const CheckOut = lazy(() => import("./pages/CheckOut"));
const Cart = lazy(() => import("./pages/Cart"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation"));
const LoginPage = lazy(() => import("./auth/LoginPage"));
const AccountHome = lazy(() => import("./pages/Dashboard"));
const Orders = lazy(() => import("./pages/Orders"));
const Downloads = lazy(() => import("./pages/Downloads"));
const Addresses = lazy(() => import("./pages/Addresses"));
const AccountDetails = lazy(() => import("./pages/AccountDetails"));
const Coupons = lazy(() => import("./pages/Coupons"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const AdminDashboard = lazy(() => import("./components/adminpage/Dashboard"));
const AdminLoginPage = lazy(() => import("./auth/AdminLoginPage"));

const PageFallback = () => <div className="page-route-fallback">Loading…</div>;

const LegacyProductRedirect = () => {
  const { productId } = useParams();
  return <Navigate to={`/product/${productId}`} replace />;
};

const Layout = ({ children }) => {
  const location = useLocation();
  const hideLayout =
    location.pathname.startsWith("/admin") || location.pathname === "/login";
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
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <FavoritesProvider>
            <Router>
              <Layout>
                <Suspense fallback={<PageFallback />}>
                  <Routes>
                    {/* Legacy redirects */}
                    <Route path="/singleproduct/:productId" element={<LegacyProductRedirect />} />
                    <Route path="/dashboard" element={<Navigate to="/account" replace />} />
                    <Route path="/orders" element={<Navigate to="/account/orders" replace />} />
                    <Route path="/downloads" element={<Navigate to="/account/downloads" replace />} />
                    <Route path="/addresses" element={<Navigate to="/account/addresses" replace />} />
                    <Route path="/account-details" element={<Navigate to="/account/settings" replace />} />
                    <Route path="/coupons" element={<Navigate to="/account/coupons" replace />} />
                    <Route path="/wishlist" element={<Navigate to="/account/wishlist" replace />} />

                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/shop/:category" element={<Shop />} />
                    <Route path="/collections" element={<Collections />} />
                    <Route path="/product/:productId" element={<SingleProduct />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:slug" element={<BlogPost />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />

                    <Route
                      path="/cart"
                      element={
                        <ProtectedRoute>
                          <Cart />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/checkout"
                      element={
                        <ProtectedRoute>
                          <CheckOut />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/order-confirmation/:orderId"
                      element={
                        <ProtectedRoute>
                          <OrderConfirmation />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/account"
                      element={
                        <ProtectedRoute>
                          <AccountLayout />
                        </ProtectedRoute>
                      }
                    >
                      <Route index element={<AccountHome />} />
                      <Route path="orders" element={<Orders />} />
                      <Route path="downloads" element={<Downloads />} />
                      <Route path="addresses" element={<Addresses />} />
                      <Route path="settings" element={<AccountDetails />} />
                      <Route path="coupons" element={<Coupons />} />
                      <Route path="wishlist" element={<Wishlist />} />
                    </Route>

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

                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Suspense>
              </Layout>
            </Router>
          </FavoritesProvider>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
