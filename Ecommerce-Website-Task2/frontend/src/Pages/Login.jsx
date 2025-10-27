import { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });

  const [serverError, setServerError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  setServerError(""); 
  try {
    const response = await fetch('https://nykaaclone-backend.onrender.com/api/login', { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: formData.email, password: formData.password })
    });
    const data = await response.json();
    
    if (response.ok) {
      setIsSuccess(true);
      console.log('Login successful', data);
      
      // Store the token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } else {
      console.error('Login failed', data);
      if (data.message === "User not verified") {
        setServerError("No account found with this email. Please sign up.");
      } else if (data.message === "Incorrect credentials") {
        setServerError("Incorrect email or password. Please try again.");
      } else {
      setServerError(data.message || "Login failed. Please check your credentials"); 
    }
  }
  } catch(error) {
    console.error('Network error:', error);
    setServerError("Network error. Please try again");
  }
};

if (isSuccess) {
    return (
      <div className="login-page">
        <div className="login-container">
          <div className="login-card">
            <div className="success-message">
              <div className="success-icon">✓</div>
              <h2>Login Successful!</h2>
              <p>Welcome back! Redirecting you to the home page...</p>
              <p className="redirect-text">You will be automatically redirected in 2 seconds</p>
              <Link to="/" className="home-redirect-btn">
                Go to Home Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="logo">
              <img src="https://images.seeklogo.com/logo-png/35/1/nykaa-logo-png_seeklogo-358073.png" alt="Nykaa" />
            </div>
            <h2>Welcome Back</h2>
            <p>Sign in to your account</p>
          </div>
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="form-options">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <span className="checkmark"></span>
                Remember me
              </label>
              <a href="/forgot-password" className="forgot-password">
                Forgot password?
              </a>
            </div>

            <button type="submit" className="login-btn">
              Sign In
            </button>
            {serverError && <div className="server-error-message">{serverError}</div>}
          </form>
          <div className="signup-link">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;