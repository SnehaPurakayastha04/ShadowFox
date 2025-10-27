import "./Exclusivelaunch.css"
import axios from "axios";
import React, {useEffect} from "react";
import { useNavigate } from "react-router-dom";
export default function Exclusivelaunch({launchData}){

  const navigate = useNavigate();
  const handleAddToCart = async(product) => {

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
      
      alert(`Item added to cart successfully!`);
      console.log('Cart response:', response.data);
      } catch (err) {
      console.error('Cart error:', err);
      if (err.response) {
        alert(`Failed to add to cart: ${err.response.data.message}`);
      } else if (err.request) {
        alert('Failed to add to cart: Network error');
      } else {
        alert('Failed to add to cart');
      }
    }
  };

  useEffect(() => {
    console.log("Launch data products:", launchData.products);
  }, [launchData]);
      
    return (
    <div className="exclusive-launch">
      <div className="launch-header">
        <div className="launch-badge">Exclusive Launch Alert !</div>
        <h2 className="launch-title">{launchData.collectionName}</h2>
        <p className="launch-subtitle">{launchData.subtitle}</p>
        <p className="launch-description">{launchData.description}</p>
        
        <div className="launch-features">
          <div className="feature">
            <span className="feature-text">First Launch in India</span>
          </div>
          <div className="feature">
            <span className="feature-text">Limited Edition Packaging</span>
          </div>
          <div className="feature">
            <span className="feature-text">Early Access Available</span>
          </div>
        </div>
      </div>

      <div className="launch-products-grid">
        {launchData.products.map(product => (
          <div key={product.id} className="launch-product-card">
            <div className="product-image-container">
              <img src={product.image} alt={product.name} className="product-image" />
              <div className="product-badges">
                <span className="new-badge">NEW LAUNCH</span>
              </div>
            </div>
            
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-variant">{product.variant}</p>
              
              <div className="product-rating">
                <span className="stars">★★★★☆</span>
                <span className="rating-count">({product.ratingCount})</span>
              </div>
              
              <div className="product-price">
                <span className="current-price">₹{product.price}</span>
                <span className="original-price">₹{product.originalPrice}</span>
              </div>
              <button 
                className="view-reviews-btn"
                onClick={() => navigate(`/product/${product.id}/reviews`)}
              >
                View Reviews
              </button>
              <button className="shop-now-btn" onClick={()=>handleAddToCart(product)}>Add To Cart</button>
              </div>
          </div>
        ))}
      </div>

      <div className="launch-footer">
        <button className="view-collection-btn">Explore Complete Collection</button>
        <p className="early-access-text">Be the first to experience these exclusive fragrances</p>
      </div>
    </div>
  );
}