import { useEffect, useState } from "react"
import API from "../services/api"
import ProductCard from "./ProductCard"

function FeaturedProducts(){

const [products,setProducts] = useState([])

useEffect(()=>{

API.get("/products")
.then(res => setProducts(res.data.products || res.data))

},[])

return(

<section className="py-20 bg-gray-50">

<div className="max-w-7xl mx-auto px-6">

{/* Section Title */}
<h2 className="text-3xl font-bold text-center mb-12">
Featured Rentals
</h2>

{/* Product Grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">

{products.slice(0,3).map(p => (

<ProductCard key={p._id} product={p}/>

))}

</div>

</div>

</section>

)

}

export default FeaturedProducts