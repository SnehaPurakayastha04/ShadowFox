import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ReviewPage.css";

const ReviewPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
    user_name: ""
  });

  useEffect(() => {
    fetchProductAndReviews();
  }, [productId]);

  const fetchProductAndReviews = async () => {
    try {
      setLoading(true);
      
      const productResponse = await axios.get(`https://nykaaclone-backend.onrender.com/api/products`);
      const products = productResponse.data;
      const currentProduct = products.find(p => p.id === parseInt(productId));
      setProduct(currentProduct);

  
      const reviewsResponse = await axios.get(`https://nykaaclone-backend.onrender.com/api/reviews?product_id=${productId}`);
      setReviews(reviewsResponse.data);

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      const reviewData = {
        product_id: parseInt(productId),
        user_id: user.id || 1,
        user_name: newReview.user_name || user.firstName || 'Anonymous',
        rating: newReview.rating,
        comment: newReview.comment
      };

      await axios.post("https://nykaaclone-backend.onrender.com/api/reviews", reviewData);
      
      setNewReview({ rating: 5, comment: "", user_name: "" });
      setShowReviewForm(false);
      fetchProductAndReviews();
      
      alert("Review submitted successfully!");
      
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (rating) => {
    setNewReview(prev => ({
      ...prev,
      rating: rating
    }));
  };

  const renderStars = (rating, interactive = false, onStarClick = null) => {
    return (
      <div className={`stars ${interactive ? 'interactive' : ''}`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= rating ? 'filled' : ''}`}
            onClick={() => interactive && onStarClick(star)}
          >
            {star <= rating ? '★' : '☆'}
          </span>
        ))}
      </div>
    );
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating]++;
    });
    return distribution;
  };

  if (loading) {
    return (
      <div className="review-page loading">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="review-page">
        <div className="error-message">
          <h2>Product not found</h2>
          <button onClick={() => navigate("/")} className="review-back-button">
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const ratingDistribution = getRatingDistribution();
  const averageRating = calculateAverageRating();

  return (
    <div className="review-page-container">
      <div className="review-page-header">
        <button onClick={() => navigate(-1)} className="review-back-button">
          ← Back
        </button>
        <div className="review-product-info">
          <img src={product.image} alt={product.name} className="product-image" />
          <div className="review-product-details">
            <h1>{product.name}</h1>
            <div className="review-product-meta">
              <span className="review-brand">{product.brand}</span>
              <span className="review-category">{product.category}</span>
            </div>
            <div className="review-price">₹{product.price}</div>
          </div>
        </div>
      </div>

      <div className="review-content-wrapper">
        <div className="review-rating-summary">
          <div className="review-overall-rating">
            <div className="review-average-rating">
              <span className="review-rating-number">{averageRating}</span>
              <div className="review-rating-stars">
                {renderStars(Math.round(averageRating))}
              </div>
              <span className="review-rating-count">({reviews.length} reviews)</span>
            </div>
          </div>

          <div className="review-rating-breakdown">
            {[5, 4, 3, 2, 1].map(rating => (
              <div key={rating} className="review-rating-bar">
                <span className="review-rating-label">{rating} ★</span>
                <div className="review-bar-container">
                  <div 
                    className="review-bar-fill"
                    style={{ 
                      width: `${reviews.length ? (ratingDistribution[rating] / reviews.length) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
                <span className="review-rating-count">({ratingDistribution[rating]})</span>
              </div>
            ))}
          </div>
        </div>

        <div className="review-add-section">
          <button 
            className="review-add-btn"
            onClick={() => setShowReviewForm(!showReviewForm)}
          >
            {showReviewForm ? 'Cancel Review' : 'Write a Review'}
          </button>

          {showReviewForm && (
            <form className="review-submit-form" onSubmit={handleReviewSubmit}>
              <div className="review-form-group">
                <label>Your Name</label>
                <input
                  type="text"
                  name="user_name"
                  value={newReview.user_name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="review-form-group">
                <label>Rating</label>
                <div className="review-rating-input">
                  {renderStars(newReview.rating, true, handleRatingChange)}
                  <span className="review-rating-text">{newReview.rating} out of 5</span>
                </div>
              </div>

              <div className="review-form-group">
                <label>Your Review</label>
                <textarea
                  name="comment"
                  value={newReview.comment}
                  onChange={handleInputChange}
                  placeholder="Share your experience with this product..."
                  rows="5"
                  required
                />
              </div>

              <button type="submit" className="review-submit-btn">
                Submit Review
              </button>
            </form>
          )}
        </div>

        <div className="review-list-container">
          <h2>Customer Reviews ({reviews.length})</h2>
          
          {reviews.length === 0 ? (
            <div className="review-no-reviews">
              <p>No reviews yet. Be the first to review this product!</p>
            </div>
          ) : (
            reviews.map(review => (
              <div key={review.id} className="review-item-card">
                <div className="review-item-header">
                  <div className="reviewer-info">
                    <span className="review-item-name">{review.user_name}</span>
                    <div className="review-item-rating">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <span className="review-item-date">
                    {new Date(review.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="review-item-comment">{review.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;