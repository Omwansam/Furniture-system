import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [itemsCount, setItemsCount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Fetch cart data when user changes (but only if backend is available)
  useEffect(() => {
    if (user) {
      // Only fetch cart if we have a valid user
      // For now, initialize with empty cart to prevent hanging
      setCartItems([]);
      setCartTotal(0);
      setItemsCount(0);
    } else {
      // Clear cart when user logs out
      setCartItems([]);
      setCartTotal(0);
      setItemsCount(0);
    }
  }, [user]);

  const fetchCart = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/cart', {
        headers: {
          'Authorization': `Bearer ${user.access_token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCartItems(data.items || []);
        setCartTotal(parseFloat(data.total_price) || 0);
        setItemsCount(data.items ? data.items.reduce((sum, item) => sum + item.quantity, 0) : 0);
      } else {
        console.error('Failed to fetch cart');
        // Initialize with empty cart if fetch fails
        setCartItems([]);
        setCartTotal(0);
        setItemsCount(0);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      // Initialize with empty cart if fetch fails
      setCartItems([]);
      setCartTotal(0);
      setItemsCount(0);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      alert('Please log in to add items to cart');
      return false;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/cart/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.access_token}`,
        },
        body: JSON.stringify({
          product_id: productId,
          quantity: quantity,
        }),
      });

      if (response.ok) {
        await fetchCart(); // Refresh cart data
        return true;
      } else {
        console.error('Failed to add item to cart');
        return false;
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    if (!user) return false;

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/cart/items/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.access_token}`,
        },
        body: JSON.stringify({ quantity }),
      });

      if (response.ok) {
        await fetchCart(); // Refresh cart data
        return true;
      } else {
        console.error('Failed to update cart item');
        return false;
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    if (!user) return false;

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/cart/items/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.access_token}`,
        },
      });

      if (response.ok) {
        await fetchCart(); // Refresh cart data
        return true;
      } else {
        console.error('Failed to remove item from cart');
        return false;
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!user) return false;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/cart', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.access_token}`,
        },
      });

      if (response.ok) {
        setCartItems([]);
        setCartTotal(0);
        setItemsCount(0);
        return true;
      } else {
        console.error('Failed to clear cart');
        return false;
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <CartContext.Provider value={{
      cartItems,
      cartTotal,
      itemsCount,
      isCartOpen,
      loading,
      addToCart,
      updateCartItem,
      removeFromCart,
      clearCart,
      openCart,
      closeCart,
      fetchCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
