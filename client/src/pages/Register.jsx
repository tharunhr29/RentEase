import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"

function Register(){

const navigate = useNavigate()

const [formData,setFormData] = useState({
name:"",
email:"",
password:"",
confirmPassword:""
})

const [otp,setOtp] = useState("")
const [showOtp,setShowOtp] = useState(false)

const [error,setError] = useState("")
const [strength,setStrength] = useState("")
const [showPassword,setShowPassword] = useState(false)

useEffect(()=>{

const isLoggedIn = localStorage.getItem("isLoggedIn")

if(isLoggedIn){
navigate("/")
}

},[navigate])

// INPUT CHANGE
const handleChange = (e)=>{

const {name,value} = e.target

setFormData({
...formData,
[name]:value
})

setError("")

// PASSWORD STRENGTH
if(name === "password"){

if(value.length < 6){
setStrength("Weak")
}
else if(value.match(/[A-Z]/) && value.match(/[0-9]/)){
setStrength("Medium")
}
else if(value.match(/[A-Z]/) && value.match(/[0-9]/) && value.match(/[@$!%*?&]/)){
setStrength("Strong")
}
}
}

// REGISTER → SEND OTP
const handleSubmit = async (e)=>{

e.preventDefault()

const passwordRegex =
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/

if(!passwordRegex.test(formData.password)){
setError("Password must contain uppercase, lowercase, number, special character and be 8+ characters.")
return
}

if(formData.password !== formData.confirmPassword){
setError("Passwords do not match")
return
}

try{

const res = await fetch("http://localhost:5000/api/auth/send-otp",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({ email: formData.email })
})

const data = await res.json()

if(data.success){
setShowOtp(true)
alert("OTP sent to your email")
}else{
setError(data.message)
}

}catch(err){
console.log(err)
}

}

// VERIFY OTP
const handleVerifyOtp = async ()=>{

try{

// VERIFY OTP
const res = await fetch("http://localhost:5000/api/auth/verify-otp",{

method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({
email: formData.email,
otp: otp
})

})

const data = await res.json()

if(data.success){

// REGISTER USER AFTER OTP SUCCESS
await fetch("http://localhost:5000/api/auth/register",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({
name: formData.name,
email: formData.email,
password: formData.password
})
})

alert("Account Created Successfully")

navigate("/login")

}else{

alert("Invalid OTP")

}

}catch(err){
console.log(err)
}

}

// RESEND OTP
const handleResendOtp = async ()=>{

await fetch("http://localhost:5000/api/auth/resend-otp",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({ email: formData.email })
})

alert("OTP resent successfully")

}

return(

<div className="min-h-screen grid md:grid-cols-2">

{/* LEFT SIDE */}

<div className="hidden md:flex bg-blue-600 text-white flex-col justify-center items-center p-12">

<h1 className="text-4xl font-bold mb-4">
RentEase
</h1>

<p className="text-lg text-center max-w-md">
Join RentEase and start renting furniture and appliances with flexible monthly plans.
</p>

<img
src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"
alt="Furniture"
className="mt-8 rounded-lg shadow-lg w-80"
/>

</div>

{/* RIGHT FORM */}

<div className="flex items-center justify-center bg-gray-100 p-6">

<form
onSubmit={handleSubmit}
className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md">

<h2 className="text-3xl font-bold mb-6 text-center">
Create Your Account
</h2>

{error && (
<p className="text-red-500 text-sm mb-3 text-center">
{error}
</p>
)}

<input
type="text"
name="name"
placeholder="Full Name"
className="w-full border p-3 mb-4 rounded-lg"
onChange={handleChange}
required
/>

<input
type="email"
name="email"
placeholder="Email Address"
className="w-full border p-3 mb-4 rounded-lg"
onChange={handleChange}
required
/>

{/* PASSWORD */}

<div className="relative">

<input
type={showPassword ? "text" : "password"}
name="password"
placeholder="Password"
className="w-full border p-3 mb-2 rounded-lg"
onChange={handleChange}
required
/>

<button
type="button"
onClick={()=>setShowPassword(!showPassword)}
className="absolute right-3 top-3 text-sm text-gray-500"
>
{showPassword ? "Hide" : "Show"}
</button>

</div>

{/* PASSWORD STRENGTH */}

{formData.password && (

<p className={`text-sm mb-3 ${
strength === "Weak"
? "text-red-500"
: strength === "Medium"
? "text-yellow-500"
: "text-green-600"
}`}>

Password Strength: {strength}

</p>

)}

<input
type={showPassword ? "text" : "password"}
name="confirmPassword"
placeholder="Confirm Password"
className="w-full border p-3 mb-4 rounded-lg"
onChange={handleChange}
required
/>

<button
className="w-full bg-blue-600 text-white py-3 rounded-lg">
Register
</button>

{/* OTP SECTION */}

{showOtp && (

<div className="mt-6">

<input
type="text"
placeholder="Enter OTP"
className="w-full border p-3 mb-3 rounded-lg"
onChange={(e)=>setOtp(e.target.value)}
/>

<button
type="button"
onClick={handleVerifyOtp}
className="w-full bg-green-600 text-white py-3 rounded-lg mb-2">
Verify OTP
</button>

<button
type="button"
onClick={handleResendOtp}
className="w-full border border-blue-600 text-blue-600 py-3 rounded-lg">
Resend OTP
</button>

</div>

)}

<p className="text-sm text-center mt-6">
Already have an account?{" "}
<Link to="/login" className="text-blue-600 hover:underline">
Login
</Link>
</p>

</form>

</div>

</div>

)

}

export default Register