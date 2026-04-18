import { useState, useEffect, useContext } from "react"
import { useNavigate, Link } from "react-router-dom"
import API from "../services/api"
import { AuthContext } from "../context/AuthContext"

function Login(){

const navigate = useNavigate()

const [email,setEmail] = useState("")
const [password,setPassword] = useState("")
const [error,setError] = useState("")

useEffect(()=>{

const isLoggedIn = localStorage.getItem("isLoggedIn")

if(isLoggedIn){
navigate("/")
}

},[navigate])


  const { login } = useContext(AuthContext)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")

    try {
      const res = await API.post("/auth/login", { email, password })

      if (res.data.success) {
        const { token, user } = res.data
        login(user, token)

        if (user.role === "admin") {
          navigate("/admin")
        } else {
          navigate("/")
        }
      }
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || "Login failed")
    }
  }


return(

<div className="min-h-screen grid md:grid-cols-2">

{/* LEFT SIDE BRAND SECTION */}

<div className="hidden md:flex bg-green-600 text-white flex-col justify-center items-center p-12">

<h1 className="text-4xl font-bold mb-4">
RentEase
</h1>

<p className="text-lg text-center max-w-md">
Rent furniture & appliances with flexible plans.  
Affordable living made simple.
</p>

<img
src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc"
alt="Furniture"
className="mt-8 rounded-lg shadow-lg w-80"
/>

</div>


{/* RIGHT SIDE LOGIN FORM */}

<div className="flex items-center justify-center bg-gray-100 p-6">

<form
onSubmit={handleLogin}
className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md">

<h2 className="text-3xl font-bold mb-6 text-center">
Welcome Back
</h2>

<p className="text-gray-500 text-center mb-6">
Login to continue renting products
</p>

{error && (
<p className="text-red-500 text-sm mb-3 text-center">
{error}
</p>
)}

<input
type="email"
placeholder="Email Address"
className="w-full border p-3 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
value={email}
onChange={(e)=>setEmail(e.target.value)}
required
/>

<input
type="password"
placeholder="Password"
className="w-full border p-3 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
value={password}
onChange={(e)=>setPassword(e.target.value)}
required
/>

<button
className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
>
Login
</button>

<p className="text-sm text-center mt-4">
Forgot your password?{" "}
<Link to="/forgot-password" className="text-blue-600 hover:underline">
Forgot Password
</Link>
</p>

<p className="text-sm text-center mt-6">
Don't have an account?{" "}
<Link
to="/register"
className="text-green-600 font-medium hover:underline"
>
Create Account
</Link>
</p>

</form>

</div>

</div>

)

}

export default Login