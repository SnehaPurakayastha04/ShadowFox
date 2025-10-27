
import Home from "./Pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CartPage from "./Pages/CartPage";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import ReviewPage from "./Pages/ReviewPage";

export default function App(){
  return(
     <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/product/:productId/reviews" element={<ReviewPage />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}