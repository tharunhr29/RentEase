import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";

function Checkout() {

const { cartItems, clearCart } = useContext(CartContext);

const [paymentMethod,setPaymentMethod] = useState("");
const [success,setSuccess] = useState(false);

/* Address State */

const [address,setAddress] = useState({
name:"",
phone:"",
street:"",
city:"",
pincode:""
});

/* Delivery Scheduling */

const [deliveryDate,setDeliveryDate] = useState("");
const [deliverySlot,setDeliverySlot] = useState("");

/* Total Price Calculation */

const totalPrice = cartItems.reduce(
(total,item)=> total + (item.price * (item.tenure || 1)),
0
);

const totalDeposit = cartItems.reduce(
(total,item)=> total + (item.deposit || 0),
0
);

const finalTotal = totalPrice + totalDeposit;

/* Address Handler */

const handleAddressChange = (e)=>{
setAddress({
...address,
[e.target.name]:e.target.value
});
};

/* Payment Handler */

const handlePayment = ()=>{

if(!paymentMethod){
alert("Please select payment method");
return;
}

if(!deliveryDate || !deliverySlot){
alert("Please select delivery schedule");
return;
}

if(!address.name || !address.phone || !address.street){
alert("Please fill delivery address");
return;
}

setSuccess(true);
clearCart();

};

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-5 gap-12">
        
        {/* 📦 Main Checkout Flow */}
        <div className="lg:col-span-3 space-y-8">
           <h1 className="text-4xl font-black tracking-tight mb-8">Secure Checkout.</h1>

           {/* SECTION 1: ADDRESS */}
           <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                 <span className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">1</span>
                 <h2 className="text-xl font-bold">Delivery Destination</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input name="name" placeholder="Receiver Name" className="bg-gray-50 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-green-500 transition" onChange={handleAddressChange} />
                <input name="phone" placeholder="Contact Number" className="bg-gray-50 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-green-500 transition" onChange={handleAddressChange} />
                <input name="street" placeholder="Street & Landmark" className="bg-gray-50 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-green-500 transition col-span-2" onChange={handleAddressChange} />
                <input name="city" placeholder="City" className="bg-gray-50 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-green-500 transition" onChange={handleAddressChange} />
                <input name="pincode" placeholder="Pincode" className="bg-gray-50 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-green-500 transition" onChange={handleAddressChange} />
              </div>
           </div>

           {/* SECTION 2: SCHEDULE */}
           <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                 <span className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">2</span>
                 <h2 className="text-xl font-bold">Preferred Schedule</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="date" className="bg-gray-50 border-none rounded-2xl p-4 outline-none" value={deliveryDate} onChange={(e)=>setDeliveryDate(e.target.value)} />
                <select className="bg-gray-50 border-none rounded-2xl p-4 outline-none" value={deliverySlot} onChange={(e)=>setDeliverySlot(e.target.value)}>
                   <option value="">Select Time Slot</option>
                   <option value="9AM-12PM">Morning (9AM-12PM)</option>
                   <option value="12PM-3PM">Afternoon (12PM-3PM)</option>
                   <option value="3PM-6PM">Evening (3PM-6PM)</option>
                </select>
              </div>
           </div>

           {/* SECTION 3: PAYMENT */}
           <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                 <span className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">3</span>
                 <h2 className="text-xl font-bold">Method of Payment</h2>
              </div>
              <div className="space-y-3">
                 {["COD", "UPI", "CARD"].map(method => (
                   <label key={method} className={`flex items-center justify-between p-4 rounded-2xl border-2 transition cursor-pointer ${paymentMethod === method ? "border-green-600 bg-green-50" : "border-gray-50 bg-gray-50"}`}>
                      <div className="flex items-center gap-3">
                         <input type="radio" name="payment" value={method} onChange={(e)=>setPaymentMethod(e.target.value)} className="w-5 h-5 accent-green-600" />
                         <span className="font-bold">{method === "COD" ? "Cash on Delivery" : method === "UPI" ? "Secure UPI Transfer" : "Credit / Debit Card"}</span>
                      </div>
                      <span className="text-xl opacity-40">{method === "CARD" ? "💳" : method === "UPI" ? "📱" : "💵"}</span>
                   </label>
                 ))}
              </div>
           </div>
        </div>

        {/* 🧾 Order Summary Panel */}
        <div className="lg:col-span-2">
           <div className="bg-gray-900 text-white p-10 rounded-[3rem] sticky top-10 shadow-2xl shadow-gray-400">
              <h3 className="text-2xl font-bold mb-8">Order Summary</h3>
              
              <div className="space-y-6 mb-10">
                 {cartItems.map((item, i) => (
                   <div key={i} className="flex justify-between items-center group">
                      <div>
                         <p className="font-bold text-lg group-hover:text-green-400 transition">{item.name}</p>
                         <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{item.tenure || 1} Month Plan</p>
                      </div>
                      <p className="font-bold">₹{item.price}</p>
                   </div>
                 ))}
              </div>

              <div className="border-t border-gray-800 pt-8 space-y-4 mb-8">
                 <div className="flex justify-between text-gray-400 text-sm">
                    <span>Subtotal</span>
                    <span>₹{totalPrice}</span>
                 </div>
                 <div className="flex justify-between text-gray-400 text-sm">
                    <span>Security Deposit (Refundable)</span>
                    <span>₹{totalDeposit}</span>
                 </div>
                 <div className="flex justify-between text-2xl font-black text-white pt-4">
                    <span>Final Amount</span>
                    <span className="text-green-400">₹{finalTotal}</span>
                 </div>
              </div>

              <button 
                onClick={handlePayment}
                className="w-full bg-green-600 text-white py-5 rounded-[2rem] font-black text-lg hover:bg-green-500 transition-all shadow-xl shadow-green-900/40 transform active:scale-95"
              >
                Complete Payment
              </button>

              {success && (
                <div className="mt-8 bg-green-900/50 p-6 rounded-3xl border border-green-700 animate-bounce">
                   <p className="text-center font-bold">✨ Order Confirmed Successfully!</p>
                </div>
              )}

              <p className="mt-8 text-[10px] text-gray-600 text-center uppercase tracking-widest font-bold">🛡️ SSL Encrypted • Secure Transaction</p>
           </div>
        </div>

      </div>
    </div>
  )
}

export default Checkout;