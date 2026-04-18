
import FeaturedProducts from "../components/FeaturedProducts"
import { Link, useNavigate } from "react-router-dom"
import HowItWorks from "../components/HowItWorks"
import TrustSection from "../components/TrustSection"
import ProblemSection from "../components/ProblemSection"
import Footer from "../components/Footer"

function Home(){

const navigate = useNavigate()

return(

<div>

{/* Navbar */}

{/* Hero Section */}
<section className="bg-gray-100 py-20">

<div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">

{/* LEFT SIDE TEXT */}
<div>

<h1 className="text-5xl font-bold mb-6">
Rent Smart. Live Better.
</h1>

<p className="text-lg text-gray-600 mb-8">
Furniture & Appliances starting from ₹199/month
</p>

<Link
to="/products"
className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700"
>
Browse Products
</Link>

</div>

{/* RIGHT SIDE IMAGE */}
<div>

<img
src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc"
alt="Furniture"
className="rounded-xl shadow-lg"
/>

</div>

</div>

</section>


      {/* Categories Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {/* Beds */}
          <div
            onClick={() => navigate("/products?category=Beds")}
            className="bg-white shadow p-6 rounded-lg cursor-pointer hover:bg-gray-100 transition"
          >
            <h3 className="font-semibold text-lg">Beds</h3>
          </div>

          {/* Sofas */}
          <div
            onClick={() => navigate("/products?category=Sofas")}
            className="bg-white shadow p-6 rounded-lg cursor-pointer hover:bg-gray-100 transition"
          >
            <h3 className="font-semibold text-lg">Sofas</h3>
          </div>

          {/* Appliances */}
          <div
            onClick={() => navigate("/products?category=Appliances")}
            className="bg-white shadow p-6 rounded-lg cursor-pointer hover:bg-gray-100 transition"
          >
            <h3 className="font-semibold text-lg">Appliances</h3>
          </div>

          {/* Electronics */}
          <div
            onClick={() => navigate("/products?category=Electronics")}
            className="bg-white shadow p-6 rounded-lg cursor-pointer hover:bg-gray-100 transition"
          >
            <h3 className="font-semibold text-lg">Electronics</h3>
          </div>
        </div>
      </section>

      {/* ✅ NEW: THE PROBLEM WE SOLVE */}
      <ProblemSection />


{/* How Renting Works */}
<HowItWorks/>


{/* Featured Products */}
<FeaturedProducts/>

<TrustSection/>

<Footer/>

</div>

)

}

export default Home