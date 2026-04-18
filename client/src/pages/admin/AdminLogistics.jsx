import { useEffect, useState } from "react"
import API from "../../services/api"

function AdminLogistics() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders/admin")
      // We want to show orders that are either newly placed (for delivery) 
      // or active/return_requested (for pickup)
      setOrders(res.data.data.orders)
      setLoading(false)
    } catch (err) {
      console.log(err)
      setLoading(false)
    }
  }

  const updateTracking = async (id, status) => {
    try {
      await API.put(`/orders/${id}/tracking`, { status })
      fetchOrders()
    } catch (err) {
      alert(err.response?.data?.message || "Transition failed")
    }
  }

  const deliveries = orders.filter(o => ["placed", "shipped", "out_for_delivery"].includes(o.trackingStatus))
  const pickups = orders.filter(o => ["active", "return_requested"].includes(o.trackingStatus))

  if (loading) return <div className="p-10">Loading logistics data...</div>

  return (
    <div className="p-10 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Logistics & Scheduling</h1>
      <p className="text-gray-500 mb-10">Manage the flow of products from warehouse to doorstep</p>

      <div className="grid lg:grid-cols-2 gap-10">
        
        {/* DELIVERY SECTION */}
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold mb-4 text-blue-700">
            <span>🚚</span> Upcoming Deliveries
          </h2>
          <div className="space-y-4">
            {deliveries.length === 0 ? (
              <p className="p-6 bg-white rounded-xl border italic text-gray-400">No pending deliveries</p>
            ) : (
              deliveries.map(o => (
                <div key={o._id} className="bg-white p-5 rounded-2xl shadow-sm border hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-bold text-lg">{o.address?.name}</p>
                      <p className="text-xs text-gray-400">Order: {o.orderId}</p>
                    </div>
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
                      {o.trackingStatus}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-4 space-y-1">
                    <p>📍 {o.address?.street}, {o.address?.city}</p>
                    <p>📅 Delivery: <span className="font-bold">{o.deliveryDate}</span> ({o.deliverySlot})</p>
                  </div>
                  <div className="flex gap-2">
                    {o.trackingStatus === "placed" && (
                      <button onClick={() => updateTracking(o._id, "shipped")} className="flex-1 bg-black text-white py-2 rounded-lg text-sm font-bold">Mark Shipped</button>
                    )}
                    {o.trackingStatus === "shipped" && (
                      <button onClick={() => updateTracking(o._id, "out_for_delivery")} className="flex-1 bg-black text-white py-2 rounded-lg text-sm font-bold">Out for Delivery</button>
                    )}
                    {o.trackingStatus === "out_for_delivery" && (
                      <button onClick={() => updateTracking(o._id, "delivered")} className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-bold">Mark Delivered</button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* PICKUP SECTION */}
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold mb-4 text-orange-700">
            <span>📦</span> Return Pickups & Renewals
          </h2>
          <div className="space-y-4">
            {pickups.length === 0 ? (
              <p className="p-6 bg-white rounded-xl border italic text-gray-400">No upcoming pickups</p>
            ) : (
              pickups.map(o => (
                <div key={o._id} className="bg-white p-5 rounded-2xl shadow-sm border hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-bold text-lg">{o.address?.name}</p>
                      <p className="text-xs text-gray-400">Order: {o.orderId}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${o.trackingStatus === "return_requested" ? "bg-red-100 text-red-700 animate-pulse" : "bg-orange-100 text-orange-700"}`}>
                      {o.trackingStatus === "return_requested" ? "PICKUP READY" : "ACTIVE RENTAL"}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-4 space-y-1">
                    <p>📅 Rental Ends: <span className="font-bold text-red-600">{o.pickupDate || "Not Scheduled"}</span></p>
                    <p>📱 {o.address?.phone}</p>
                  </div>
                  {o.trackingStatus === "return_requested" && (
                    <button onClick={() => updateTracking(o._id, "picked_up")} className="w-full bg-orange-600 text-white py-2 rounded-lg text-sm font-bold">Complete Pickup</button>
                  )}
                  {o.trackingStatus === "active" && (
                    <button className="w-full bg-gray-100 text-gray-500 py-2 rounded-lg text-sm font-bold cursor-not-allowed">Monitoring Tenure...</button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

export default AdminLogistics
