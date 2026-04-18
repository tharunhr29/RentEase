import { useState } from "react"
import { useNavigate } from "react-router-dom"

function ForgotPassword(){

const [email,setEmail] = useState("")
const navigate = useNavigate()

const handleSendOTP = async()=>{

const res = await fetch("http://localhost:5000/api/auth/forgot-password",{

method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({ email })

})

const data = await res.json()

if(data.success){

alert("OTP sent to your email")

localStorage.setItem("resetEmail", email)

navigate("/reset-password")

}else{

alert(data.message)

}

}

return(

<div className="flex justify-center items-center h-screen bg-gray-100">

<div className="bg-white p-8 rounded-lg shadow-lg w-96">

<h2 className="text-2xl font-bold mb-4 text-center">
Forgot Password
</h2>

<input
type="email"
placeholder="Enter your email"
className="border p-3 mb-4 w-full rounded"
onChange={(e)=>setEmail(e.target.value)}
/>

<button
onClick={handleSendOTP}
className="bg-blue-600 text-white w-full py-2 rounded">
Send OTP
</button>

</div>

</div>

)

}

export default ForgotPassword