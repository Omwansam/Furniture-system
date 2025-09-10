import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [itemsCount, setItemsCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user } = useAuth();

  // Reset cart when user changes (login/logout)
  useEffect(() => {
    if (!user) {
      setCartItems([]);
      setCartTotal(0);
      setItemsCount(0);
    } else {
      // Only fetch cart if user is logged in
      fetchCart();
    }
  }, [user]);

  const fetchCart = async () => {
    if (!user) return;

    // Get token from localStorage as fallback
    const token = user.access_token || localStorage.getItem('token');
    if (!token) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/cart', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCartItems(data.items || []);
        setCartTotal(parseFloat(data.total_price) || 0);
        setItemsCount(data.items_count || 0);
      } else if (response.status === 401) {
        // Token expired or invalid, clear cart and user data
        setCartItems([]);
        setCartTotal(0);
        setItemsCount(0);
        localStorage.removeItem('token');
        localStorage.removeItem('furniture_user');
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      // On network error, clear cart
      setCartItems([]);
      setCartTotal(0);
      setItemsCount(0);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    if (!user) {
      return false;
    }

    // Get token from localStorage as fallback
    const token = user.access_token || localStorage.getItem('token');
    if (!token) {
      return false;
    }

    try {
      const response = await fetch('http://localhost:5000/cart/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: product.product_id,
          quantity: quantity,
        }),
      });

      if (response.ok) {
        await fetchCart(); // Refresh cart data
        return true;
      } else if (response.status === 401) {
        // Clear invalid token
        localStorage.removeItem('token');
        localStorage.removeItem('furniture_user');
        return false;
      }
      return false;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return false;
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    if (!user) return false;

    const token = user.access_token || localStorage.getItem('token');
    if (!token) return false;

    try {
      const response = await fetch(`http://localhost:5000/cart/items/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity }),
      });

      if (response.ok) {
        await fetchCart(); // Refresh cart data
        return true;
      } else if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('furniture_user');
      }
      return false;
    } catch (error) {
      console.error('Error updating cart item:', error);
      return false;
    }
  };

  const removeFromCart = async (itemId) => {
    if (!user) return false;

    const token = user.access_token || localStorage.getItem('token');
    if (!token) return false;

    try {
      const response = await fetch(`http://localhost:5000/cart/items/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await fetchCart(); // Refresh cart data
        return true;
      } else if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('furniture_user');
      }
      return false;
    } catch (error) {
      console.error('Error removing from cart:', error);
      return false;
    }
  };

  const clearCart = async () => {
    if (!user) return false;

    const token = user.access_token || localStorage.getItem('token');
    if (!token) return false;

    try {
      const response = await fetch('http://localhost:5000/cart', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setCartItems([]);
        setCartTotal(0);
        setItemsCount(0);
        return true;
      } else if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('furniture_user');
      }
      return false;
    } catch (error) {
      console.error('Error clearing cart:', error);
      return false;
    }
  };

  // Cart popup functions
  const openCart = () => {
    setIsCartOpen(true);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  const value = {
    cartItems,
    cartTotal,
    itemsCount,
    loading,
    isCartOpen,
    openCart,
    closeCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    fetchCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
