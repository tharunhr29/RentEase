import { useEffect, useState, useContext, useCallback } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import API from "../services/api"
import { CartContext } from "../context/CartContext"

function ProductDetails() {

  const { id } = useParams()
  const navigate = useNavigate()

  const { addToCart } = useContext(CartContext)

  const [product, setProduct] = useState(null)
  const [selectedTenure, setSelectedTenure] = useState(3)

  // ⭐ REVIEW STATE
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const fetchProduct = useCallback(async () => {
    try {
      const res = await API.get(`/products/${id}`)
      setProduct(res.data.product)
    } catch (err) {
      console.error(err)
    }
  }, [id])

  useEffect(() => {
    fetchProduct()
  }, [id, fetchProduct])

  /* Price Calculation */

  const calculatePrice = (months) => {
    if (months === 3) return product.price + 200
    if (months === 6) return product.price + 100
    if (months === 12) return product.price
    return product.price
  }

  /* Add To Cart */

  const handleAddToCart = () => {
    const price = calculatePrice(selectedTenure)
    addToCart({
      ...product,
      price,
      tenure: selectedTenure
    })
    alert("Added to cart!")
  }

  /* Rent Now */

  const handleRentNow = () => {
    const price = calculatePrice(selectedTenure)
    const checkoutData = {
      product,
      price,
      tenure: selectedTenure
    }
    localStorage.setItem("checkoutData", JSON.stringify(checkoutData))
    navigate("/payment", {
      state: checkoutData
    })
  }

  // ⭐ SUBMIT REVIEW
  const submitReview = async () => {
    if (!comment) return alert("Please add a comment")
    setSubmitting(true)
    try {
      await API.post(`/products/${id}/review`, { rating, comment })
      alert("Review posted!")
      setComment("")
      fetchProduct() // Refresh
    } catch (err) {
      alert(err.response?.data?.message || "Error posting review")
    } finally {
      setSubmitting(false)
    }
  }

  if (!product) return <h2 className="p-10">Loading...</h2>

  const monthlyPrice = calculatePrice(selectedTenure)
  const estimatedTotal = monthlyPrice * selectedTenure + product.deposit

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto p-10 grid md:grid-cols-2 gap-16">

        {/* 🖼️ Product Image */}
        <div className="relative group">
          <img
            src={product.image}
            alt={product.name}
            className="rounded-[3rem] shadow-2xl brightness-95 group-hover:brightness-100 transition duration-500 w-full object-cover aspect-square"
          />
          <div className="absolute top-6 left-6 flex gap-2">
            <span className="bg-white/90 backdrop-blur px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-900 shadow-sm">
              {product.category}
            </span>
            {product.availableStock < 5 && (
              <span className="bg-red-500 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                Low Stock
              </span>
            )}
          </div>
        </div>

        {/* 📝 Product Info */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-4">
             <div className="flex text-yellow-500 text-sm gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>{i < Math.round(product.ratings) ? "⭐" : "☆"}</span>
                ))}
             </div>
             <span className="text-xs font-bold text-gray-400">({product.numReviews} Reviews)</span>
          </div>

          <h1 className="text-5xl font-black tracking-tighter text-gray-900 mb-6 font-primary">
            {product.name}
          </h1>

          <p className="text-gray-500 text-lg leading-relaxed mb-8 font-medium">
            {product.description || "Premium quality product curated for modern urban living spaces. Designed for durability and aesthetic appeal."}
          </p>

          <div className="grid grid-cols-2 gap-8 mb-10 pb-8 border-b border-gray-100">
             <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Security Deposit</p>
                <p className="text-2xl font-bold">₹{product.deposit}</p>
                <p className="text-[10px] text-green-600 font-bold uppercase">100% Refundable</p>
             </div>
             <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Material</p>
                <p className="text-2xl font-bold">{product.material || "Premium"}</p>
             </div>
          </div>

          {/* 📅 Duration Selector */}
          <div className="mb-10">
             <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4 text-center md:text-left">Select Rental Duration</h3>
             <div className="flex gap-4 flex-wrap justify-center md:justify-start">
               {product.tenureOptions?.map(months => {
                 const price = calculatePrice(months)
                 const isActive = selectedTenure === months
                 return (
                   <button
                     key={months}
                     onClick={() => setSelectedTenure(months)}
                     className={`flex flex-col items-center justify-center w-28 h-28 rounded-3xl border-2 transition-all duration-300 ${isActive ? "border-green-600 bg-green-50 shadow-lg shadow-green-100" : "border-gray-100 bg-white hover:border-gray-300"}`}
                   >
                     <span className={`text-xl font-black ${isActive ? "text-green-700" : "text-gray-900"}`}>{months}</span>
                     <span className="text-[10px] font-bold uppercase text-gray-400">Months</span>
                     <div className={`mt-2 text-xs font-black ${isActive ? "text-green-600" : "text-gray-400"}`}>₹{price}/mo</div>
                   </button>
                 )
               })}
             </div>
          </div>

          {/* ⚡ Call to Action */}
          <div className="bg-gray-50 p-8 rounded-[2.5rem] mb-10">
             <div className="flex justify-between items-center mb-6">
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Monthly Cost</p>
                   <p className="text-4xl font-black text-green-600">₹{monthlyPrice}<span className="text-lg text-gray-400 font-medium">/mo</span></p>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Total Payble</p>
                   <p className="font-bold text-gray-900">₹{estimatedTotal}</p>
                </div>
             </div>
             
             <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-white border-2 border-gray-900 text-gray-900 py-4 rounded-2xl font-bold hover:bg-gray-900 hover:text-white transition-all shadow-lg active:scale-95"
                >
                  Add To Cart
                </button>
                <button
                  onClick={handleRentNow}
                  className="flex-2 bg-black text-white py-4 px-10 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 active:scale-95"
                >
                  Rent Now ⚡
                </button>
             </div>
          </div>
          
          <div className="flex justify-center gap-8 text-[10px] font-black uppercase tracking-widest text-gray-400">
             <span className="flex items-center gap-2">🛡️ Locked Price</span>
             <span className="flex items-center gap-2">🔄 Free Upgrades</span>
             <span className="flex items-center gap-2">🚚 Fast Delivery</span>
          </div>
        </div>
      </div>

      {/* ⭐ REVIEWS SECTION */}
      <div className="max-w-7xl mx-auto p-10 border-t border-gray-100">
        <h2 className="text-5xl font-black tracking-tighter mb-16 font-primary text-center md:text-left">
          Customer Voice.
        </h2>

        <div className="grid lg:grid-cols-3 gap-20">
          
          {/* LEFT: SUBMIT REVIEW */}
          <div className="lg:col-span-1">
             {localStorage.getItem("token") ? (
               <div className="bg-gray-50 p-10 rounded-[3rem] sticky top-24 border border-gray-100">
                  <h3 className="text-2xl font-bold mb-2">Write a Review</h3>
                  <p className="text-gray-500 text-sm mb-8 leading-relaxed">Your feedback helps thousands of renters find the right products.</p>
                  
                  <div className="space-y-6">
                     <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Rate your experience</label>
                        <div className="flex gap-3">
                           {[1,2,3,4,5].map(num => (
                             <button 
                                key={num}
                                onClick={() => setRating(num)}
                                className={`text-3xl transition-all duration-300 ${rating >= num ? "grayscale-0 scale-125" : "grayscale opacity-20 hover:opacity-100"}`}
                             >
                               {rating >= num ? "⭐" : "☆"}
                             </button>
                           ))}
                        </div>
                     </div>

                     <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Your Comment</label>
                        <textarea 
                          className="w-full bg-white border-2 border-transparent rounded-3xl p-6 outline-none focus:border-green-600 transition min-h-[160px] shadow-sm font-medium"
                          placeholder="Share details of your experience..."
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        />
                     </div>

                     <button 
                       onClick={submitReview}
                       disabled={submitting}
                       className="w-full bg-green-600 text-white py-5 rounded-3xl font-black text-lg hover:bg-green-700 transition shadow-xl shadow-green-100 disabled:opacity-50 active:scale-95"
                     >
                       {submitting ? "Publishing..." : "Post Review"}
                     </button>
                  </div>
               </div>
             ) : (
               <div className="bg-blue-50 p-10 rounded-[3rem] text-center border border-blue-100">
                  <div className="text-4xl mb-4">🔑</div>
                  <h3 className="text-xl font-bold text-blue-900 mb-2">Login to Review</h3>
                  <p className="text-blue-700/60 text-sm mb-8">Share your thoughts with the community.</p>
                  <Link to="/login" className="inline-block bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition">Get Started</Link>
               </div>
             )}
          </div>

          {/* RIGHT: REVIEWS LIST */}
          <div className="lg:col-span-2 space-y-12">
             {product.reviews && product.reviews.length > 0 ? (
               product.reviews.map((r, i) => (
                 <div key={i} className="group pb-12 border-b border-gray-100 last:border-0">
                    <div className="flex justify-between items-start mb-6">
                       <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-gray-900 text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg">
                             {r.user?.name?.charAt(0).toUpperCase() || "U"}
                          </div>
                          <div>
                             <p className="font-bold text-gray-900 text-lg uppercase tracking-tight">{r.user?.name || "Verified Member"}</p>
                             <div className="flex text-xs gap-0.5 text-yellow-500">
                                {[...Array(5)].map((_, idx) => (
                                  <span key={idx}>{idx < r.rating ? "★" : "☆"}</span>
                                ))}
                             </div>
                          </div>
                       </div>
                       <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full">{new Date(r.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-500 leading-relaxed text-lg font-medium pl-2">{r.comment}</p>
                 </div>
               ))
             ) : (
               <div className="text-center py-32 bg-gray-50 rounded-[4rem] border-2 border-dashed border-gray-200">
                  <div className="text-6xl mb-6">✨</div>
                  <h3 className="text-2xl font-bold text-gray-400">No reviews yet.</h3>
                  <p className="text-gray-400 font-medium mt-2">Rent this item and be the first to share your experience!</p>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails