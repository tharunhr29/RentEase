import { useState } from "react"
import { useNavigate } from "react-router-dom"

function VerifyOTP(){

const [otp,setOtp] = useState("")
const [loading,setLoading] = useState(false)
const navigate = useNavigate()

const email = localStorage.getItem("pendingEmail")

const handleVerify = async()=>{

if(!otp || otp.length !== 6){
alert("Please enter a valid 6 digit OTP")
return
}

try{

setLoading(true)

const res = await fetch("http://localhost:5000/api/auth/verify-otp",{

method:"POST",

headers:{"Content-Type":"application/json"},

body:JSON.stringify({
email: email,
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
name: localStorage.getItem("pendingName"),
email: email,
password: localStorage.getItem("pendingPassword")
})
})

alert("Email verified successfully")

// Clear temporary data
localStorage.removeItem("pendingEmail")
localStorage.removeItem("pendingName")
localStorage.removeItem("pendingPassword")

navigate("/login")

}else{

alert(data.message || "Invalid OTP")

}

}catch(err){
console.log(err)
alert("Something went wrong")

}finally{
setLoading(false)
}

}


// RESEND OTP
const handleResend = async()=>{

try{

const res = await fetch("http://localhost:5000/api/auth/resend-otp",{

method:"POST",

headers:{"Content-Type":"application/json"},

body:JSON.stringify({ email: email })

})

const data = await res.json()

alert(data.message)

}catch(err){
console.log(err)
}

}


return(

<div className="flex justify-center items-center h-screen bg-gray-100">

<div className="bg-white p-8 shadow-lg rounded-lg w-96">

<h2 className="text-2xl font-bold mb-4 text-center">
Enter OTP
</h2>

<input
type="text"
placeholder="6 digit OTP"
maxLength="6"
className="border p-3 mb-4 w-full rounded"
onChange={(e)=>setOtp(e.target.value)}
/>

<button
onClick={handleVerify}
disabled={loading}
className="bg-green-600 text-white w-full py-2 rounded mb-2">

{loading ? "Verifying..." : "Verify OTP"}

</button>

<button
onClick={handleResend}
className="border border-blue-600 text-blue-600 w-full py-2 rounded">
Resend OTP
</button>

</div>

</div>

)

}

export default VerifyOTP