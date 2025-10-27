import Slider from "react-slick";
import "./Herosection.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css"

export default function Herosection(){
    const banners =[
        {
            id:1,
            img: "https://imgmediagumlet.lbb.in/media/2024/07/669e2e6d5b38bb58d30bd6ab_1721642605087.jpg",
            title:"Luxury Beauty Picks",
            desc:"Indulge in top-tier beauty brands for that flawless glow",
            btn:"Shop Luxe"
        },
        {
            id:2,
            img: "https://www.nykaa.com/beauty-blog/wp-content/uploads/2024/11/sale-banner.jpg",
            title:"Festive Glam Sale",
            desc:"Upto 60% off on skincare, makeup & more",
            btn:"Grab offers"
        },
        {
            id:3,
            img: "https://cdn.shopify.com/s/files/1/0361/1987/1619/files/Honey_Infused_Haircare_Set_Gisou.jpg?v=1631261472",
            title:"Haircare Essentials",
            desc:"Nourish you your hair with our latest collection",
            btn:"Explore Now"
        }
    ];

    const settings={
        dots: true,
        infinite:true,
        speed:900,
        slidesToShow:1,
        slidesToScroll:1,
        autoplay: true,
        arrows: false,
        fade: true
    };

    return(
        <div className="hero-slider">
            <h2>GET GLOWING</h2>
            <Slider {...settings}>
                {banners.map((banners)=>(
                    <div className="hero-slide" key={banners.id}>
                        <img src={banners.img} alt={banners.title} />
                        <div className="hero-content">
                        <div className="hero-text">
                            <h1>{banners.title}</h1>
                            <p>{banners.desc}</p>
                            </div>
                            <div className="hero-button">
                            <button>{banners.btn}</button>
                        </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
}