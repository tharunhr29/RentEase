import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { CartContext } from "../context/CartContext"

function ProductCard({ product }) {

const { addToCart } = useContext(CartContext)
const navigate = useNavigate()

const handleAddToCart = () => {

const isLoggedIn = localStorage.getItem("isLoggedIn")   // ✅ added

if (!isLoggedIn) {                                      // ✅ added
navigate("/login")
return
}

addToCart(product)
}

const handleRentNow = () => {

const isLoggedIn = localStorage.getItem("isLoggedIn")   // ✅ added

if (!isLoggedIn) {                                      // ✅ added
navigate("/login")
return
}

navigate("/payment", { state:{product} })
}

const handleQuickView = () => {
navigate(`/product/${product._id}`)
}

  return (
    <div className="bg-white rounded-3xl overflow-hidden group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 flex flex-col h-full">
      {/* 🖼️ Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* 🔥 Status Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.isOutOfStock ? (
                <span className="bg-red-500/90 backdrop-blur-md text-white px-3 py-1 text-[10px] uppercase font-black rounded-full tracking-tighter">Out of Stock</span>
            ) : product.stock <= 5 ? (
                <span className="bg-orange-500/90 backdrop-blur-md text-white px-3 py-1 text-[10px] uppercase font-black rounded-full tracking-tighter">Low Stock</span>
            ) : (
                <span className="bg-green-600/90 backdrop-blur-md text-white px-3 py-1 text-[10px] uppercase font-black rounded-full tracking-tighter">In Stock</span>
            )}
        </div>

        {/* 👁️ Quick Actions */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
           <button 
             onClick={handleQuickView}
             className="bg-white text-black px-6 py-3 rounded-full font-bold text-sm shadow-xl hover:bg-black hover:text-white transition transform translate-y-4 group-hover:translate-y-0 duration-300"
           >
             View Details
           </button>
        </div>
      </div>

      {/* 📝 Content Section */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{product.category}</p>
          <div className="flex items-center text-yellow-400 text-xs">
            <span>★</span>
            <span className="text-gray-900 ml-1 font-bold">{product.ratings || "4.8"}</span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition truncate">
          {product.name}
        </h3>

        <div className="mt-4 flex items-baseline gap-2">
           <span className="text-2xl font-black text-green-600">₹{product.price}</span>
           <span className="text-gray-400 text-xs font-medium">/ month</span>
        </div>

        <p className="text-xs text-gray-500 mt-1">₹{product.deposit} Security Deposit • Refundable</p>

        {/* 🛒 Buttons */}
        <div className="mt-auto pt-6 flex gap-3">
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-gray-50 text-gray-900 py-3 rounded-2xl font-bold text-sm hover:bg-gray-900 hover:text-white transition-all shadow-sm"
          >
            Add
          </button>
          <button
            onClick={handleRentNow}
            className="flex-[2] bg-green-600 text-white py-3 rounded-2xl font-bold text-sm hover:bg-green-700 transition-all shadow-xl shadow-green-100"
          >
            Rent Now
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard