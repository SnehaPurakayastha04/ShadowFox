import { Link } from "react-router-dom";
import "./Navbar.css";
import { useState } from "react";
export default function Navbar({searchTerm, onSearchChange, onFilterChange}){
    const handleSearchClick = () =>{
        if (searchTerm.trim()) {
            onFilterChange(searchTerm);
        }
    };
    return(
        <div className="navbar">
            <div className="logo-navbar"><img src="https://images.seeklogo.com/logo-png/35/1/nykaa-logo-png_seeklogo-358073.png" alt="NykaaLogo" /></div>
            <div className="nav-links">
                <ul>
                    <li className="nav-item">Categories
                    </li>
                    <li className="nav-item">Brands
                    </li>
                    <li className="nav-item">Luxe</li>
                    <li className="nav-item">Nykaa Fashion</li>
                    <li className="nav-item">Beauty Advice</li>
                </ul>
            </div>
            <div className="search-bar">
                <input type="text" id="search-bar" placeholder="Search for products, brands,.." value={searchTerm} onChange={(e) => onSearchChange(e.target.value)} 
                onKeyDown={(e) => e.key === "Enter" && handleSearchClick}/>
                <button type="submit" onClick={handleSearchClick}>Search</button>
            </div>
            <div className="sign-in">
                <Link to="./login">Sign In</Link>
            </div>
            <div className="add-to-cart">
                <Link to='/cart'>
                <img src="https://www.shutterstock.com/image-vector/shopping-cart-icon-flat-design-600nw-570153007.jpg" alt="Add-to-cart" />
                </Link>
            </div>
        </div>
    );
}