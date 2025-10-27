import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CartPage.css";
import Footer from "../Components/Footer";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate= useNavigate();


  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };
const fetchCart = () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert('Please login to view your cart');
      navigate('/login');
      return;
    }

    axios.get("https://nykaaclone-backend.onrender.com/api/cart", {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      setCartItems(res.data);
      const sum = res.data.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      setTotal(sum);
    })
    .catch(err => {
      console.log(err);
      if (err.response?.status === 401) {
        alert('Please login again');
        navigate('/login');
      }
    });
  };
  
  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = (id) => {
    const token = localStorage.getItem('token');
    
    axios.delete(`https://nykaaclone-backend.onrender.com/api/cart/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      fetchCart();
    })
    .catch(err => {
      console.log(err);
      if (err.response?.status === 401) {
        alert('Please login again');
        navigate('/login');
      }
    });
  };
  const handleCheckout = () => {
    const token = localStorage.getItem('token');
    
    axios.post("https://nykaaclone-backend.onrender.com/api/checkout", {}, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      alert("Order placed successfully!");
      setCartItems([]);
      setTotal(0);
    })
    .catch(err => {
      console.log(err);
      if (err.response?.status === 401) {
        alert('Please login again');
        navigate('/login');
      } else {
        alert(err.response?.data?.message || "Checkout failed");
      }
    });
  };
  const finalTotal = (total >= 499 ? total : total + 99) + total * 0.18;


  return (
    <div className="cart-page">
        <div className="heading">
      <h1>Your Shopping Bag</h1>
      </div>
      {cartItems.length === 0 ? (
        <div>
        <img src="https://images.icon-icons.com/3149/PNG/512/pink_shopping_bag_icon_192629.png" alt="Empty bag" />
        <h2>Your Shopping Bag is empty</h2>
        <p>This feels too light! Go on, add all your favourites</p>
        <div className="Continue-btn">
        <button onClick={() => navigate("/")}>Continue Shopping</button>
        </div>
        </div>
      ) : (
        <div>
          {cartItems.map(item => (
            <div key={item.id} className="cart-item">
                <img src={item.image || "https://via.placeholder.com/150?text=No+Image" } alt={item.name || "Product Image"} className="cart-product-image" />
                <div className="card-item-content">
                <h4>{item.name}</h4>
              <p>Product ID: {item.product_id}</p>
              <p>Quantity: {item.quantity}</p>
              <p className="price">Price: ₹{item.price}</p>
    {item.discount && <p className="discount">{item.discount}% OFF</p>}
              <button onClick={() => handleRemove(item.id)} className="remove-btn"><img src="https://cdn-icons-png.flaticon.com/512/3439/3439691.png" alt="delete-btn" /></button>
            </div>
            </div>
          ))}
          <div className="cart-summary">
            <h3>Price Details</h3>
            <p>Free Shipping on orders above ₹499</p>
            <div className="summary-details">
              <div className="summary-row">
                <span className="summary-label">Subtotal</span>
                <span className="summary-value">₹{total}</span>
              </div>
            <div className="summary-row">
                <span className="summary-label">Shipping</span>
                <span className="summary-value">
                  {total >= 499 ? "FREE" : "₹99"}
                </span>
              </div>
            <div className="summary-row">
                <span className="summary-label">Tax</span>
                <span className="summary-value">₹{(total * 0.18).toFixed(2)}</span>
              </div> 

          <h3 className="total-amount">You Pay: ₹{finalTotal.toFixed(2)}</h3>
          <button onClick={handleCheckout} className="checkout-btn">Proceed to Checkout</button>
          </div>
        </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default CartPage;
