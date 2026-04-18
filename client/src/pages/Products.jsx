import { useState, useEffect } from "react"
import ProductCard from "../components/ProductCard"
import { useLocation, useNavigate } from "react-router-dom"   // ✅ added
import { useContext } from "react"                            // ✅ added
import { CartContext } from "../context/CartContext" 
         // ✅ added

function Products(){

const navigate = useNavigate()                                // ✅ added
const { addToCart } = useContext(CartContext)                 // ✅ added

const handleAddToCart = (product) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  if (!isLoggedIn) {
    navigate("/login");
    return;
  }

  addToCart(product);
};

const location = useLocation()
const params = new URLSearchParams(location.search)
const urlCategory = params.get("category")

const [products,setProducts] = useState([])
const [search,setSearch] = useState("")
const [selectedCategory,setSelectedCategory] = useState(urlCategory || "All")

// Fetch products from backend
useEffect(()=>{

fetch("http://localhost:5000/api/products")
.then(res => res.json())
.then(data => {

  console.log("API Response:", data)

  // Handle both cases: array OR {products: []}
  if(Array.isArray(data)){
    setProducts(data)
  }else if(Array.isArray(data.products)){
    setProducts(data.products)
  }else{
    setProducts([])
  }

})
.catch(err => console.log(err))

},[])

const filteredProducts = products.filter(product =>

(selectedCategory === "All" || product.category === selectedCategory) &&
product.name.toLowerCase().includes(search.toLowerCase())

)

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* 🏔️ Hero Section */}
        <div className="mb-12">
          <h1 className="text-5xl font-black tracking-tighter mb-4 text-gray-900">Discover & Rent.</h1>
          <p className="text-gray-500 max-w-lg text-lg leading-relaxed">
            Premium furniture and appliances delivered to your doorstep. Flexible tenures, zero commitment.
          </p>
        </div>

        {/* 🍱 Filter Bar */}
        <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between">
          <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-100 w-full md:w-auto">
            {["All", "Furniture", "Appliances", "Electronics", "Fitness"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                  selectedCategory === cat
                    ? "bg-green-600 text-white shadow-lg shadow-green-100"
                    : "text-gray-400 hover:text-gray-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-96 group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition">🔍</span>
            <input
              type="text"
              placeholder="Search items..."
              className="w-full bg-white border-2 border-gray-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-green-600 transition-all font-medium"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* 📦 Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-20 text-center border shadow-sm">
             <p className="text-5xl mb-4">🔍</p>
             <h2 className="text-2xl font-bold text-gray-900">Nothing found</h2>
             <p className="text-gray-500 mt-2">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                handleAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default Products