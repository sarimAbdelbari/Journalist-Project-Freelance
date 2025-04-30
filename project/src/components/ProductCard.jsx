import { useState } from 'react';
import './ProductCard.css';

function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <div 
      className={`product-card ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="product-image-container">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="product-image"
        />
        <div className="product-actions">
          <button className="action-button">Add to Cart</button>
          <button className="action-button secondary">View Details</button>
        </div>
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">${product.price.toFixed(2)}</p>
        <div className="product-rating">
          {Array(5).fill().map((_, index) => (
            <span key={index} className={`star ${index < product.rating ? 'filled' : ''}`}>★</span>
          ))}
          <span className="rating-count">({product.reviewCount})</span>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;