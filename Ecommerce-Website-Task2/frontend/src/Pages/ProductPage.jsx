
import "./ProductPage.css";
import Slider from 'react-slick';
import BrandSection from '../Components/BrandSection';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Exclusivelaunch from "../Components/ExclusiveLaunch";
import { useState, useEffect } from "react";
import axios from "axios";
import Filter from "../Components/Filter";

const ProductPage = ({ filters, searchTerm, onFilterChange }) => {
  const [brandsData, setBrandsData] = useState([]);
  const [brandsDataOriginal, setBrandsDataOriginal] = useState([]); 
  const [exclusiveLaunchData, setExclusiveLaunchData] = useState(null);
  const [exclusiveLaunchOriginal, setExclusiveLaunchOriginal] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get("https://nykaaclone-backend.onrender.com/api/products", {
    params: {
        category: filters.category,
        brand: filters.brand,
        sort: filters.sort,
        search: searchTerm 
    }
})
      .then(res => {
        const products = res.data;
        setAllProducts(products); 

        const brandMetadata = {
          "Kay Beauty": {
            logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgJmjvpp3WwBC-K_NEZwAApN1lGIGMfx2bSw&s",
            description: "It's Kay To Be You"
          },
          "Dot & Key": {
            logo: "https://m.media-amazon.com/images/I/41NyOliezAL._AC_UF350,350_QL80_.jpg",
            description: "Natural & Clinically Proven Skincare Products."
          }
        };

        const exclusive = products.filter(p => p.brand === "Nykaa Perfumes");
        const otherBrands = {};

        products.forEach(p => {
          if (p.brand !== "Nykaa Perfumes") {
            if (!otherBrands[p.brand]) {
              const metadata = brandMetadata[p.brand];
              otherBrands[p.brand] = {
                id: p.id,
                brandName: p.brand,
                brandLogo: metadata?.logo || "",
                brandDescription: metadata?.description || "",
                products: []
              };
            }
            otherBrands[p.brand].products.push(p);
          }
        });

        const exclusiveData = {
          id: 1,
          brandName: "Nykaa Perfumes",
          brandLogo: "https://thoughtoverdesign.com/wp-content/uploads/2017/12/nykaa_section7-1.jpg",
          collectionName: "Gourmand Collection",
          tagline: "Exclusive Launch Alert",
          subtitle: "Indulge in Sweet Sensations",
          brandDescription: "Be the first to experience our luxurious new fragrance collection. Crafted with premium ingredients for an unforgettable olfactory journey.",
          products: exclusive
        };

        setExclusiveLaunchData(exclusiveData);
        setExclusiveLaunchOriginal(exclusiveData); 
        setBrandsData(Object.values(otherBrands));
        setBrandsDataOriginal(Object.values(otherBrands)); 
        setLoading(false);
      })
      .catch(err => console.log(err));
  }, [filters, searchTerm]);

  const handleFilterChange = (filters) => {
    const sortProducts = (products, sortType) => {
      const parsePrice = (price) => {
        if (!price) return 0;
        return parseFloat(price.toString().replace(/[^0-9.-]+/g, ""));
      };
      switch (sortType) {
        case "price_low":
          return [...products].sort((a, b) =>parsePrice(a.price) - parsePrice(b.price));
        case "price_high":
          return [...products].sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
        case "discount":
          return [...products].sort((a, b) => (b.discount || 0) - (a.discount || 0));
        default:
          return products;
      }
    };

    const filteredExclusive = sortProducts(
      exclusiveLaunchOriginal?.products.filter(p =>
        (p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()))) &&
        (!filters.category || p.category === filters.category) &&
        (!filters.brand || p.brand === filters.brand)
      ),
      filters.sort
    );

    setExclusiveLaunchData(prev => ({
      ...prev,
      products: filteredExclusive
    }));
    const filteredBrands = brandsDataOriginal
      .map(brand => ({
        ...brand,
        products: sortProducts( brand.products.filter(p =>
          (p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()))) &&
          (!filters.category || p.category === filters.category) &&
          (!filters.brand || p.brand === filters.brand)
        ),
        filters.sort)
      }))
      .filter(brand => brand.products.length > 0);

    setBrandsData(filteredBrands);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    pauseOnHover: true,
    arrows: true,
    fade: true,
  };

  const bannerImages = [
    { image: "https://www.esteelauder.in/media/export/cms/25_modernized_homepage/HP_Cat_Nav_Skincare_623x623.jpg", showBadge: true },
    { image: "https://media.johnlewiscontent.com/i/JohnLewis/charlotte-tilbury-pillow-hero-040425?fmt=auto", showBadge: true },
    { image: "https://storage.googleapis.com/impact-news-photo/news-photo/9309.Untitled%20design%20(6).jpg", showBadge: true },
    { image: "https://mesugatra.com/cdn/shop/products/Card---2_c8b4baa7-8c43-44b6-9650-368457f6affd_1445x.webp?v=1680696766", showBadge: true }
  ];

  if (loading) return <div>Loading...</div>;

  return (
    <div className="product-page">
      {!searchTerm &&( <>
      <div className="diwali-marquee">
        <div className="marquee-content">
          <span className="marquee-text"> Diwali Sale Is Live! </span>
          <span className="marquee-text">Up to 60% OFF + Extra 15% OFF</span>
          <span className="marquee-text">Free Gift Worth ₹1999 on Orders Above ₹2999 </span>
          <span className="marquee-text"> Free Shipping Above ₹499 </span>
          <span className="marquee-text"> Limited Time Offer - Shop Now! </span>
        </div>
      </div>

      <div className="brands-carousel">
        <Slider {...settings}>
          {bannerImages.map((banner, index) => (
            <div key={index} className="carousel-slide">
              <img src={banner.image} alt={`Banner ${index + 1}`} />
              {banner.showBadge && <div className="carousel-badge">Top Brands</div>}
            </div>
          ))}
        </Slider>
      </div>
      </>)}

  
      <Filter onFilterChange={handleFilterChange} products={allProducts} />


      {exclusiveLaunchData && exclusiveLaunchData.products.length > 0 &&
        <Exclusivelaunch launchData={exclusiveLaunchData} />
      }

      {brandsData?.map(brand => (
        brand.products.length > 0 &&
        <BrandSection
          key={brand.id}
          brand={brand}
        />
      ))}
    </div>
  );
};

export default ProductPage;
