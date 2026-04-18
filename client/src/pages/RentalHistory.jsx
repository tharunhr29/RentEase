import { useEffect, useState, useContext } from "react"
import API from "../services/api"
import Navbar from "../components/Navbar"
import { Link } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"

function RentalHistory({ isDashboard }){

const { user } = useContext(AuthContext)
const [history,setHistory] = useState([])
const [loading,setLoading] = useState(true)

const userEmail = user?.email

useEffect(()=>{

if(!userEmail){
setLoading(false)
return
}

API.get(`/orders/user/${userEmail}`)
.then(res=>{

const allOrders = res.data.orders || []
const completed = allOrders.filter(o =>
o.status === "Completed" || o.deliveryStatus === "Delivered" || o.trackingStatus === "completed"
)

setHistory(completed)
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
Loading rental history...
</div>

</div>

)

}

  return (
    <div>
      {!isDashboard && <Navbar/>}
      <div className="max-w-6xl mx-auto p-10">
        <h1 className="text-3xl font-bold mb-8">Rental History</h1>
        {history.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-20 text-center border shadow-sm">
            <div className="text-6xl mb-6">🗓️</div>
            <h2 className="text-2xl font-bold text-gray-900">No past rentals</h2>
            <p className="text-gray-500 mt-2 mb-8">You haven't completed any rental cycles yet.</p>
            <Link to="/products" className="bg-black text-white px-8 py-3 rounded-2xl font-bold hover:bg-gray-800 transition">Explore Store</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {history.map((order) => (
              <div key={order._id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-lg transition-all">
                <div className="flex gap-6 mb-6">
                  <img
                    src={order.products?.[0]?.image}
                    alt={order.products?.[0]?.name}
                    className="w-20 h-20 rounded-2xl object-cover grayscale opacity-60"
                  />
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Legacy Order</span>
                    <h2 className="text-xl font-bold text-gray-900">{order.products?.[0]?.name}</h2>
                    <p className="text-sm text-gray-500 font-medium">Order ID: {order.orderId}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
                   <div>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">Cycle Length</p>
                      <p className="text-sm font-bold">{order.tenure} Months</p>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">Status</p>
                      <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">Successfully Returned</span>
                   </div>
                </div>

                <div className="mt-6 flex gap-3">
                   <Link to={`/product/${order.products?.[0]?.productId}`} className="flex-1 bg-black text-white text-center py-3 rounded-xl font-bold text-sm shadow-xl shadow-gray-200">Rent Again</Link>
                   <button className="flex-1 bg-white border border-gray-200 text-gray-900 py-3 rounded-xl font-bold text-sm hover:bg-gray-50 transition">Invoice</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default RentalHistory