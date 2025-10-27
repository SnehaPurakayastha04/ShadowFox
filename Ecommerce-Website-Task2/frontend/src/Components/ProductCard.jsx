import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./ProductCard.css";

const ProductCard = ({ product }) => {
const navigate = useNavigate();

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Please login to add items to cart');
        return;
      }

      const response = await axios.post(
        "https://nykaaclone-backend.onrender.com/api/cart", 
        { 
          product_id: product.id, 
          quantity: 1 
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
       alert("Added to cart successfully!");
      console.log('Cart response:', response.data);
      
    } catch (err) {
      console.log('Cart error:', err);
      if (err.response) {
        // Server responded with error status
        alert(`Failed to add to cart: ${err.response.data.message}`);
      } else if (err.request) {
        // Request was made but no response received
        alert('Failed to add to cart: Network error');
      } else {
        // Other errors
        alert('Failed to add to cart');
      }
    }
  };
  
  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} />
        {product.isNew && <span className="new-badge">New</span>}
        {product.discount && <span className="discount-badge">{product.discount}% OFF</span>}
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        
        {product.shades && (
          <p className="product-variants">{product.shades} Shades</p>
        )}
        {product.size && (
          <p className="product-size">{product.size}</p>
        )}
        
        <div className="product-rating">
          <span className="rating-stars">★★★★☆</span>
          <span className="rating-count">({product.ratingCount})</span>
        </div>
        
        <div className="product-price">
          <span className="current-price">₹{product.price}</span>
          {product.originalPrice && (
            <span className="original-price">₹{product.originalPrice}</span>
          )}
        </div>
        <div className="product-buttons">
        <button 
  className="view-reviews-btn"
  onClick={() => navigate(`/product/${product.id}/reviews`)}
>
  View Reviews
</button>

        <button className="add-to-cart-btn" onClick={handleAddToCart}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;