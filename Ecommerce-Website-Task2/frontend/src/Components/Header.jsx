import "./Header.css";
export default function Header(){
    return(
        <div className="header">
            <span className="animated-text">Have you shopped from our Diwali Sale yet?</span>
            <span className="header-links">
                <a href="#">Get App</a>
                <a href="#">Store & Events</a>
                <a href="#">Gift Offers</a>
            </span>
        </div>
    );
}