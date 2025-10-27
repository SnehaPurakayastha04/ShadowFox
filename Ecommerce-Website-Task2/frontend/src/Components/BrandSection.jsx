import "./BrandSection.css"
import ProductCard from './ProductCard';

const BrandSection = ({ brand }) => {
  return (
    <div className="brand-section">
      <div className="brand-header">
        <div className="brand-info">
          <img src={brand.brandLogo} alt={brand.brandName} className="brand-logo" />
          <div className="brand-details">
            <h2 className="brand-name">{brand.brandName}</h2>
            <p className="brand-description">{brand.brandDescription}</p>
          </div>
        </div>
        <button className="view-all-btn">View All</button>
      </div>
      <div className="brand-products-grid">
        {brand.products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <div className="brand-footer">
        <button className="explore-brand-btn">
          Explore {brand.brandName}
        </button>
      </div>
    </div>
  );
};

export default BrandSection;