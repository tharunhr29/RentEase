import { useEffect, useState, useContext } from "react"
import API from "../services/api"
import Navbar from "../components/Navbar"
import { Link } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"

function MyOrders({ isDashboard }){

const { user } = useContext(AuthContext)
const [orders,setOrders] = useState([])
const [loading,setLoading] = useState(true)

const userEmail = user?.email

useEffect(()=>{

if(!userEmail){
setLoading(false)
return
}

API.get(`/orders/user/${userEmail}`)
.then(res=>{
setOrders(res.data.orders || [])
setLoading(false)
})
.catch(err=>{
console.log(err)
setLoading(false)
})

},[userEmail])


if(loading){

return(

<div>

{!isDashboard && <Navbar/>}

<div className="p-10 text-gray-500">
Loading orders...
</div>

</div>

)

}

  return (
    <div>
      {!isDashboard && <Navbar/>}
      <div className="max-w-6xl mx-auto p-10">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        {orders.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-20 text-center border shadow-sm">
            <div className="text-6xl mb-6">🧾</div>
            <h2 className="text-2xl font-bold text-gray-900">No recent orders</h2>
            <p className="text-gray-500 mt-2 italic">Your order history will appear here once you make a purchase.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-6 w-full md:w-auto">
                  <img
                    src={order.products?.[0]?.image}
                    alt={order.products?.[0]?.name}
                    className="w-24 h-24 rounded-3xl object-cover shadow-lg"
                  />
                  <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest leading-none mb-1">Order #{order.orderId}</p>
                    <h3 className="text-xl font-bold text-gray-900">{order.products?.[0]?.name}</h3>
                    <p className="text-sm text-gray-500 font-medium">{order.tenure} Month Lease • {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex flex-col md:items-end w-full md:w-auto">
                   <div className="flex items-center gap-3 mb-2">
                      <span className={`w-2 h-2 rounded-full ${order.deliveryStatus === "Delivered" ? "bg-green-500" : "bg-blue-500 animate-pulse"}`} />
                      <span className="text-sm font-black uppercase tracking-tighter text-gray-900">{order.deliveryStatus || "Processing"}</span>
                   </div>
                   <p className="text-xs text-gray-400 font-medium mb-4">Delivery: {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : "TBD"}</p>
                   <div className="flex gap-2 w-full">
                      <button className="flex-1 bg-gray-50 text-gray-900 px-6 py-2 rounded-xl font-bold text-xs hover:bg-gray-200 transition">Track Detail</button>
                      <Link to={`/product/${order.products?.[0]?.productId}`} className="flex-1 bg-black text-white px-6 py-2 rounded-xl font-bold text-xs text-center hover:bg-gray-800 transition">Rent Again</Link>
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyOrders