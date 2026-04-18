import { useEffect, useState } from "react";
import API from "../../services/api";

function AdminOrders() {

  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const res = await API.get("/orders/admin");
    setOrders(res.data.data.orders);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status, damageReport = "") => {
    try {
      await API.put(`/orders/${id}/status`, { status, damageReport });
      fetchOrders();
    } catch (err) {
      alert("Status update failed");
    }
  };

  return (
    <div className="p-10 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-sans">Master Order Feed</h1>
          <p className="text-gray-500">Track and manage every transaction</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Order & User</th>
              <th className="p-4 font-semibold text-gray-600">Financials</th>
              <th className="p-4 font-semibold text-gray-600">Status</th>
              <th className="p-4 font-semibold text-gray-600">Damage Report / Notes</th>
              <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(orders || []).map(order => (
              <tr key={order._id} className="border-b last:border-0 hover:bg-gray-50 transition">
                <td className="p-4">
                  <p className="font-bold"># {order.orderId || order._id.slice(-6).toUpperCase()}</p>
                  <p className="text-sm text-gray-500">{order.userEmail || order.user?.email}</p>
                </td>
                <td className="p-4 font-medium text-green-700">₹ {order.amount.toLocaleString()}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    order.trackingStatus === "completed" ? "bg-green-100 text-green-700" :
                    order.trackingStatus === "return_requested" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                  }`}>
                    {order.trackingStatus}
                  </span>
                </td>
                <td className="p-4">
                  <input 
                    type="text" 
                    placeholder="Add condition notes..."
                    defaultValue={order.damageReport}
                    onBlur={(e) => updateStatus(order._id, order.trackingStatus, e.target.value)}
                    className="w-full p-2 border rounded text-xs focus:ring-1 focus:ring-black outline-none transition"
                  />
                </td>
                <td className="p-4 text-right">
                  <select 
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    value={order.trackingStatus}
                    className="p-2 border rounded-lg text-xs bg-white cursor-pointer"
                  >
                    <option value="placed">Placed</option>
                    <option value="shipped">Shipped</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="active">Active</option>
                    <option value="picked_up">Picked Up</option>
                    <option value="completed">Completed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminOrders;