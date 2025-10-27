import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false); 

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (validateForm()) {
    const { firstName, lastName, email, password } = formData;

    try {
      const response = await fetch('https://nykaaclone-backend.onrender.com/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName, 
          lastName, 
          email, 
          password
        })
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        console.log('Signup successful:', data);
        setTimeout(() => navigate("/login"), 3000);
      } else {
        console.error('Signup error:', data.error);
        setServerError(data.error || "Signup failed")
      }
    } catch (error) {
      console.error('Network error:', error);
      setServerError("Network error. Please try again.")
    }
  }
};

if (isSuccess) {
    return (
      <div className="signup-page">
        <div className="signup-container">
          <div className="signup-card">
            <div className="success-message">
              <div className="success-icon">✓</div>
              <h2>Account Created Successfully!</h2>
              <p>Your account has been created. Redirecting to login page...</p>
              <p className="redirect-text">You will be automatically redirected in 3 seconds</p>
              <Link to="/login" className="login-redirect-btn">
                Go to Login Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-card">
          <div className="signup-header">
            <div className="logo">
              <img src="https://images.seeklogo.com/logo-png/35/1/nykaa-logo-png_seeklogo-358073.png" alt="Nykaa" />
            </div>
            <h2>Create Your Account</h2>
            <p>Join us and discover amazing beauty products</p>
          </div>
          <form className="signup-form" onSubmit={handleSubmit} noValidate>
            <div className="name-fields">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                  className={errors.firstName ? 'error' : ''}
                />
                {errors.firstName && <span className="error-message">{errors.firstName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={errors.email ? 'error' : ''}
                required
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                className={errors.password ? 'error' : ''}
                required
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
              <div className="password-hint">
                Must be at least 6 characters
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className={errors.confirmPassword ? 'error' : ''}
                required
              />
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>

            <div className="form-options">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                />
                <span className="checkmark"></span>
                I agree to the <a href="/terms" className="link">Terms & Conditions </a> and <a href="/privacy" className="link"> Privacy Policy</a>
              </label>
              {errors.agreeToTerms && <span className="error-message">{errors.agreeToTerms}</span>}
            </div>

            <div className="form-options">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  name="newsletter"
                  checked={formData.newsletter}
                  onChange={handleChange}
                />
                <span className="checkmark"></span>
                Send me beauty tips, new product updates, and exclusive offers
              </label>
            </div>

            <button type="submit" className="signup-btn">
              Create Account
            </button>
          </form>

          <div className="login-link">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Signup;