import './Footer.css';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-newsletter">
                    <p className="newsletter-text">Stay updated with our latest offers</p>
                    <button className="newsletter-btn">Subscribe to Newsletter</button>
                </div>

                <div className="footer-grid">
                    <div className="footer-section">
                        <h4>Shop</h4>
                        <div className="footer-links">
                            <a href="/new">New Arrivals</a>
                            <a href="/bestsellers">Bestsellers</a>
                            <a href="/deals">Special Deals</a>
                            <a href="/gifts">Gift Cards</a>
                        </div>
                    </div>
                    
                    <div className="footer-section">
                        <h4>Help</h4>
                        <div className="footer-links">
                            <a href="/contact">Contact Us</a>
                            <a href="/shipping">Shipping Info</a>
                            <a href="/returns">Returns</a>
                            <a href="/faq">FAQ</a>
                        </div>
                    </div>
                    
                    <div className="footer-section">
                        <h4>About</h4>
                        <div className="footer-links">
                            <a href="/about">Our Story</a>
                            <a href="/careers">Careers</a>
                            <a href="/press">Press</a>
                            <a href="/blog">Blog</a>
                        </div>
                    </div>
                    
                    <div className="footer-section">
                        <h4>Connect</h4>
                        <div className="footer-links">
                            <a href="/instagram">Instagram</a>
                            <a href="/facebook">Facebook</a>
                            <a href="/twitter">Twitter</a>
                            <a href="/pinterest">Pinterest</a>
                        </div>
                    </div>
                </div>
                
                <div className="footer-bottom">
                    <p>&copy; 2025 NykaaClone. Made with ❤️ for beautiful you.</p>
                </div>
            </div>
        </footer>
    );
}