import Header from "../Components/Header";
import Herosection from "../Components/Herosection";
import Navbar from "../Components/Navbar";
import ProductPage from "./ProductPage";
import Footer from "../Components/Footer"
import { useState } from "react";

export default function Home(){
    const [filters, setFilters] = useState({ category: "", brand: "", sort: "" });
  const [searchTerm, setSearchTerm] = useState("");

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

    return(
        <div>
            <Header />
            <Navbar searchTerm={searchTerm} onSearchChange={handleSearchChange} onFilterChange={handleFilterChange} />
            {searchTerm? (<> 
            <ProductPage 
                      filters={filters}
                      searchTerm={searchTerm}
                      onFilterChange={handleFilterChange} 
                    />
                    <Herosection />
            </>):(
              <>
            <Herosection />
            <ProductPage filters={filters}
            searchTerm={searchTerm}
            onFilterChange={handleFilterChange}/>
            </>
            )}
            <Footer />
        </div>
    );
}