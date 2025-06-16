import React, { useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import './SingleCart.css'

const SingleCart = () => {
  const navigate = useNavigate();

  // Sample cart data
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Asgaard Sofa",
      price: 250000,
      quantity: 1,
      image: "https://via.placeholder.com/80", // Replace with actual image URL
    },
  ]);

  // Calculate total price
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Remove item from cart
  const handleRemove = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  return (
    <div className="cart-container">
      {/* Cart Items Table */}
      <div className="cart-items">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.id}>
                <td className="cart-item">
                  <img src={item.image} alt={item.name} className="cart-item-img" />
                  <span>{item.name}</span>
                </td>
                <td>Rs. {item.price.toLocaleString()}</td>
                <td>
                  <input type="number" value={item.quantity} min="1" className="quantity-input" readOnly />
                </td>
                <td>Rs. {(item.price * item.quantity).toLocaleString()}</td>
                <td>
                  <button className="delete-btn" onClick={() => handleRemove(item.id)}>
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cart Summary Section */}
      <div className="cart-summary">
        <h3>Cart Totals</h3>
        <p>
          <strong>Subtotal:</strong> Rs. {subtotal.toLocaleString()}
        </p>
        <p className="cart-total">
          <strong>Total:</strong> Rs. {subtotal.toLocaleString()}
        </p>
        <button className="checkout-btn" onClick={() => navigate("/checkout")}>
          Check Out
        </button>
      </div>
    </div>
  );
};

export default SingleCart;
