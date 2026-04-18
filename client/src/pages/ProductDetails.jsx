import { useEffect, useState, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import API from "../services/api"
import Navbar from "../components/Navbar"
import { CartContext } from "../context/CartContext"

function ProductDetails(){

const { id } = useParams()
const navigate = useNavigate()

const { addToCart } = useContext(CartContext)

const [product,setProduct] = useState(null)
const [selectedTenure,setSelectedTenure] = useState(3)

useEffect(()=>{

API.get(`/products/${id}`)
.then(res => setProduct(res.data.product))

},[id])

if(!product) return <h2 className="p-10">Loading...</h2>

/* Price Calculation */

const calculatePrice = (months) => {

if(months === 3) return product.price + 200
if(months === 6) return product.price + 100
if(months === 12) return product.price
return product.price

}

/* Estimated Total */

const monthlyPrice = calculatePrice(selectedTenure)
const estimatedTotal = monthlyPrice * selectedTenure + product.deposit

/* Add To Cart */

const handleAddToCart = () => {

const price = calculatePrice(selectedTenure)

addToCart({
...product,
price,
tenure:selectedTenure
})

alert("Added to cart!")

}

/* Rent Now */

const handleRentNow = () => {

const price = calculatePrice(selectedTenure)

// 🔥 FIX: STORE DATA (IMPORTANT)
const checkoutData = {
product,
price,
tenure:selectedTenure
}

localStorage.setItem("checkoutData", JSON.stringify(checkoutData))

navigate("/payment",{
state: checkoutData
})

}

return(

<div>

<Navbar/>

<div className="max-w-6xl mx-auto p-10 grid md:grid-cols-2 gap-10">

{/* Image */}

<img
src={product.image}
alt={product.name}
className="rounded-lg shadow"
/>

{/* Info */}

<div>

<h1 className="text-3xl font-bold">
{product.name}
</h1>

<p className="text-gray-600 mt-2">
{product.description}
</p>

<p className="mt-3">
Material: {product.material}
</p>

<p>
Deposit: ₹{product.deposit}
</p>

{/* Ratings */}

<div className="flex items-center mt-3 text-yellow-500">

<span>⭐</span>
<span>⭐</span>
<span>⭐</span>
<span>⭐</span>

<span className="text-gray-600 ml-2">
{product.ratings} ({product.numReviews} reviews)
</span>

</div>

{/* Tenure */}

<h3 className="font-semibold mt-6 mb-2">
Choose Rental Duration
</h3>

<div className="flex gap-4 flex-wrap">

{product?.tenureOptions?.map(months => {

const price = calculatePrice(months)

return(

<button
key={months}
onClick={()=>setSelectedTenure(months)}
className={`border px-5 py-3 rounded-lg text-sm ${
selectedTenure === months
? "bg-green-600 text-white"
: "bg-white hover:bg-gray-100"
}`}
>

{months} Months  
<br/>

₹{price}/month

</button>

)

})}

</div>

{/* Price */}

<p className="text-2xl font-bold text-green-600 mt-6">
₹{calculatePrice(selectedTenure)} / month
</p>

{/* Total */}

<div className="mt-3 text-gray-700">

<p>
Rental Total ({selectedTenure} months): ₹{monthlyPrice * selectedTenure}
</p>

<p>
Refundable Deposit: ₹{product.deposit}
</p>

<p className="font-semibold">
Estimated Total: ₹{estimatedTotal}
</p>

</div>

{/* Info */}

<div className="mt-4 text-sm text-gray-500">

<p>✔ Free maintenance during rental</p>
<p>✔ Flexible return options</p>
<p>✔ Easy relocation support</p>

</div>

{/* Buttons */}

<div className="flex gap-4 mt-6">

<button
onClick={handleAddToCart}
className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900"
>
Add to Cart
</button>

<button
onClick={handleRentNow}
className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
>
Rent Now
</button>

</div>

</div>

</div>

</div>

)

}

export default ProductDetails