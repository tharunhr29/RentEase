import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import OrderTimeline from "../components/OrderTimeline"

function Orders() {

  const [orders, setOrders] = useState([])
  const navigate = useNavigate()

  const userEmail = localStorage.getItem("userEmail")

  useEffect(() => {

    fetch(`http://localhost:5000/api/orders/user/${userEmail}`)
      .then(res => res.json())
      .then(data => setOrders(data))

  }, [userEmail])

  return (

    <div className="p-8 max-w-6xl mx-auto">

      <h2 className="text-3xl font-bold mb-8">
        My Orders
      </h2>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (

        orders.map(order => (

          <div key={order._id} className="bg-white shadow-md rounded-xl p-6 mb-6">

            {/* 🧾 Top Section */}
            <div className="flex justify-between items-center mb-4">

              <div>
                <p className="text-sm text-gray-500">
                  Order ID: {order._id}
                </p>
                <p className="font-semibold">
                  ₹{order.amount}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm">
                  Payment: {order.status}
                </p>
                <p className="text-sm font-medium text-blue-600">
                  {order.trackingStatus}
                </p>
              </div>

            </div>

            {/* 📦 Products */}
            <div className="flex gap-4 overflow-x-auto mb-4">

              {order.products.map(item => (
                <div key={item.productId} className="min-w-[120px]">

                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded"
                  />

                  <p className="text-sm">{item.name}</p>

                </div>
              ))}

            </div>

            {/* 🚚 Timeline */}
            <OrderTimeline
              status={order.trackingStatus}
              timeline={order.trackingTimeline}
            />

            {/* 📅 Dates */}
            <div className="flex justify-between mt-4 text-sm text-gray-600">

              <p>
                Delivery: {new Date(order.deliveryDate).toDateString()}
              </p>

              <p>
                Pickup: {new Date(order.pickupDate).toDateString()}
              </p>

            </div>

            {/* 🎯 Actions */}
            <div className="flex justify-end gap-3 mt-4">

              <button
                onClick={() => navigate(`/track-order/${order._id}`)}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Track Order
              </button>

            </div>

          </div>

        ))

      )}

    </div>

  )
}

export default Orders