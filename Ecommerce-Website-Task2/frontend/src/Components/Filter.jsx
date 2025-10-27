import React, { useState } from 'react';
import './Filter.css';

const Filter = ({ onFilterChange, products }) => {
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    sort: ''
  });

  const categories = [...new Set(products.map(p => p.category))];
  const brands = [...new Set(products.map(p => p.brand))];

  const handleFilterChange = (filterType, value) => {
    const newFilters = {
      ...filters,
      [filterType]: value
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = { category: '', brand: '', sort: '' };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="filter-container">
      <div className="filter-header">
        <h3>Refine Your Selection</h3>
        <button className="clear-btn" onClick={clearFilters}>Clear All</button>
      </div>


      <div className="filter-group">
        <label>Category</label>
        <select 
          value={filters.category} 
          onChange={(e) => handleFilterChange('category', e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

  
      <div className="filter-group">
        <label>Brand</label>
        <select 
          value={filters.brand} 
          onChange={(e) => handleFilterChange('brand', e.target.value)}
        >
          <option value="">All Brands</option>
          {brands.map(brand => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>
      </div>

  
      <div className="filter-group">
        <label>Sort By</label>
        <select 
          value={filters.sort} 
          onChange={(e) => handleFilterChange('sort', e.target.value)}
        >
          <option value="">Recommended</option>
          <option value="price_low">Price: Low to High</option>
          <option value="price_high">Price: High to Low</option>
          <option value="discount">Best Discount</option>
        </select>
      </div>
    </div>
  );
};

export default Filter;