import React, { useContext, useState, useEffect } from "react"
import { CartContext } from "../context/CartContext"
import { useLocation, useNavigate } from "react-router-dom"
import API from "../services/api"

function Payment() {

const { cart, clearCart } = useContext(CartContext)

const location = useLocation()
const navigate = useNavigate()

const product = location.state?.product
const initialTenure = location.state?.tenure || 3

const items = product ? [product] : cart

/* RENTAL TENURE */

const [selectedTenure,setSelectedTenure] = useState(initialTenure)

/* ADDRESS */

const [address,setAddress] = useState({
name:"",
phone:"",
street:"",
city:"",
pincode:""
})

/* DELIVERY */

const [deliveryDate,setDeliveryDate] = useState("")

/* ADDED: DELIVERY SLOT */

const [deliverySlot,setDeliverySlot] = useState("")

/* 🏛️ DYNAMIC SERVICE AREAS */

const [serviceAreas, setServiceAreas] = useState([])
const [selectedArea, setSelectedArea] = useState(null)

useEffect(() => {
    const fetchAreas = async () => {
        try {
            const res = await API.get("/admin/service-areas")
            if (res.data.success) {
                // Only show active areas
                setServiceAreas(res.data.data.filter(a => a.isActive))
            }
        } catch (err) {
            console.error("Failed to fetch service areas:", err)
        }
    }
    fetchAreas()
}, [])

const handleCityChange = (cityName) => {
    const area = serviceAreas.find(a => a.name === cityName)
    setSelectedArea(area)
    setAddress({ ...address, city: cityName })
}

/* PRICE CALCULATION */

const calculateMonthlyPrice = (item)=>{

if(selectedTenure === 3) return item.price + 200
if(selectedTenure === 6) return item.price + 100

return item.price

}

/* RENTAL EXPIRY DATE */

const calculateExpiryDate = () => {

if(!deliveryDate) return ""

const date = new Date(deliveryDate)

date.setMonth(date.getMonth() + selectedTenure)

return date.toISOString().split("T")[0]

}

const expiryDate = calculateExpiryDate()

/* RENTAL TOTAL */

const rentalTotal = items.reduce((sum,item)=>{

const monthly = calculateMonthlyPrice(item)

return sum + (monthly * selectedTenure)

},0)

const deposit = items.reduce((sum,item)=> sum + (item.deposit || 0),0)

/* ⚡ DYNAMIC DELIVERY CHARGE */
const delivery = selectedArea ? selectedArea.deliveryCharge : 0

const totalPayable = rentalTotal + deposit + delivery

/* PAYMENT */

const handlePayment = async () => {

if(!address.name || !address.phone || !address.street || !address.city){
alert("Please complete the delivery address")
return
}

if(!deliveryDate){
alert("Please select delivery date")
return
}

/* ADDED: SERVICE AREA VALIDATION */

if(!selectedArea){
alert("Sorry! Delivery is available only in selected service areas.")
return
}

try{

const orderRes = await fetch("http://localhost:5000/api/payment/create-order",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({amount:totalPayable})
})

const order = await orderRes.json()

const options = {

key:"rzp_test_SFGAri9Oepkkkc",

amount:order.amount,

currency:"INR",

name:"RentEase",

description:"Furniture Rental Payment",

order_id:order.id,

handler:async function(response){

const verifyRes = await fetch("http://localhost:5000/api/payment/verify-payment",{

method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({

...response,
products:items,
tenure:selectedTenure,
amount:totalPayable,
address:address,
deliveryDate:deliveryDate,
deliverySlot:deliverySlot,

/* ADDED PICKUP DATE */
pickupDate:expiryDate

})

})

const result = await verifyRes.json()

if(result.success){

clearCart()

navigate("/order-success",{

state:{
order:{
orderId:response.razorpay_order_id,
paymentId:response.razorpay_payment_id,
amount:totalPayable,
products:items,
tenure:selectedTenure,
address:address,
deliveryDate:deliveryDate,
deliverySlot:deliverySlot,

/* ADDED PICKUP DATE */
pickupDate:expiryDate
}
}

})

}else{

alert("Payment Verification Failed")

}

}

}

const rzp = new window.Razorpay(options)
rzp.open()

}catch(error){

console.error(error)
alert("Payment failed")

}

}

return(

<div className="max-w-6xl mx-auto p-10 grid md:grid-cols-2 gap-10">

{/* LEFT SIDE */}

<div>

<h2 className="text-2xl font-bold mb-6">
Order Details
</h2>

{items.map(item => (

<div key={item._id} className="flex gap-4 border-b pb-4 mb-4">

<img
src={item.image}
alt={item.name}
className="w-24 h-24 object-cover rounded"
/>

<div>

<p className="font-semibold">{item.name}</p>

<p className="text-gray-500">
Rental Duration: {selectedTenure} months
</p>

<p>
₹{calculateMonthlyPrice(item)} / month
</p>

</div>

</div>

))}

{/* TENURE SELECTOR */}

<h3 className="font-semibold mt-4 mb-2">
Select Rental Duration
</h3>

<div className="flex gap-3 mb-6">

{[3,6,12].map(months => (

<button
key={months}
onClick={()=>setSelectedTenure(months)}
className={`px-4 py-2 border rounded ${
selectedTenure === months
? "bg-green-600 text-white"
: "bg-white"
}`}
>

{months} Months

</button>

))}

</div>

{/* ADDRESS */}

<h3 className="text-xl font-semibold mb-3">
Delivery Address
</h3>

<input
type="text"
placeholder="Full Name"
className="border p-2 w-full mb-2 rounded"
onChange={(e)=>setAddress({...address,name:e.target.value})}
/>

<input
type="text"
placeholder="Phone Number"
className="border p-2 w-full mb-2 rounded"
onChange={(e)=>setAddress({...address,phone:e.target.value})}
/>

<input
type="text"
placeholder="Street Address"
className="border p-2 w-full mb-2 rounded"
onChange={(e)=>setAddress({...address,street:e.target.value})}
/>

<select
  className="border p-2 w-full mb-2 rounded bg-white"
  value={address.city}
  onChange={(e) => handleCityChange(e.target.value)}
>
  <option value="">Select city (Service Area)</option>
  {serviceAreas.map((area) => (
    <option key={area._id} value={area.name}>
      {area.name}
    </option>
  ))}
</select>

<input
type="text"
placeholder="Pincode"
className="border p-2 w-full mb-4 rounded"
onChange={(e)=>setAddress({...address,pincode:e.target.value})}
/>

{/* DELIVERY DATE */}

<h3 className="font-semibold mb-2">
Select Delivery Date
</h3>

<input
type="date"
className="border p-2 rounded w-full"
onChange={(e)=>setDeliveryDate(e.target.value)}
/>

{/* ADDED: DELIVERY SLOT */}

<h3 className="font-semibold mt-3 mb-2">
Select Delivery Time Slot
</h3>

<select
className="border p-2 rounded w-full"
onChange={(e)=>setDeliverySlot(e.target.value)}
>

<option value="">Select Time Slot</option>
<option value="9AM-12PM">9AM - 12PM</option>
<option value="12PM-3PM">12PM - 3PM</option>
<option value="3PM-6PM">3PM - 6PM</option>

</select>

{/* EXPIRY DATE DISPLAY */}

{expiryDate && (

<div className="mt-3 text-gray-700">

<p>
Rental Expiry Date: <strong>{expiryDate}</strong>
</p>

<p className="text-sm text-gray-500">
Pickup will be scheduled automatically on this date.
</p>

</div>

)}

</div>

{/* RIGHT SIDE */}

<div className="bg-white shadow-lg rounded-lg p-6 h-fit">

<h3 className="text-xl font-semibold mb-4">
Checkout Summary
</h3>

<div className="flex justify-between mb-2">
<span>Rental Total</span>
<span>₹{rentalTotal}</span>
</div>

<div className="flex justify-between mb-2">
<span>Refundable Deposit</span>
<span>₹{deposit}</span>
</div>

<div className="flex justify-between mb-2">
<span>Delivery Charge</span>
<span>₹{delivery}</span>
</div>

<hr className="my-4"/>

<div className="flex justify-between font-bold text-lg">
<span>Total Payable</span>
<span>₹{totalPayable}</span>
</div>

<button
onClick={handlePayment}
className="w-full bg-green-600 text-white py-3 mt-6 rounded-lg"
>
Pay ₹{totalPayable}
</button>

</div>

</div>

)

}

export default Payment