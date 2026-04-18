import { useState } from "react"
import { useNavigate } from "react-router-dom"

function ResetPassword(){

const [otp,setOtp] = useState("")
const [password,setPassword] = useState("")
const [confirmPassword,setConfirmPassword] = useState("")
const [error,setError] = useState("")

const navigate = useNavigate()

const email = localStorage.getItem("resetEmail")

const handleReset = async()=>{

// CHECK PASSWORD MATCH
if(password !== confirmPassword){
setError("Passwords do not match")
return
}

try{

// VERIFY OTP
const verify = await fetch("http://localhost:5000/api/auth/verify-reset-otp",{

method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({ email, otp })

})

const verifyData = await verify.json()

if(!verifyData.success){

setError("Invalid OTP")
return

}

// RESET PASSWORD
const res = await fetch("http://localhost:5000/api/auth/reset-password",{

method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({ email, password })

})

const data = await res.json()

if(data.success){

alert("Password reset successfully")

localStorage.removeItem("resetEmail")

navigate("/login")

}

}catch(err){
console.log(err)
}

}

return(

<div className="flex justify-center items-center h-screen bg-gray-100">

<div className="bg-white p-8 shadow-lg rounded-lg w-96">

<h2 className="text-2xl font-bold mb-4 text-center">
Reset Password
</h2>

{error && (
<p className="text-red-500 text-sm mb-3 text-center">
{error}
</p>
)}

<input
type="text"
placeholder="Enter OTP"
className="border p-3 mb-3 w-full rounded"
onChange={(e)=>setOtp(e.target.value)}
/>

<input
type="password"
placeholder="New Password"
className="border p-3 mb-3 w-full rounded"
onChange={(e)=>setPassword(e.target.value)}
/>

<input
type="password"
placeholder="Confirm Password"
className="border p-3 mb-4 w-full rounded"
onChange={(e)=>setConfirmPassword(e.target.value)}
/>

<button
onClick={handleReset}
className="bg-green-600 text-white w-full py-2 rounded">
Reset Password
</button>

</div>

</div>

)

}

export default ResetPassword