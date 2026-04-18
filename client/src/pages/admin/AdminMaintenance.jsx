import { useEffect, useState } from "react"
import API from "../../services/api"

function AdminMaintenance() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const res = await API.get("/maintenance")
      setRequests(res.data)
      setLoading(false)
    } catch (err) {
      console.log(err)
      setLoading(false)
    }
  }

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/maintenance/${id}`, { status })
      fetchRequests()
    } catch (err) {
      console.log(err)
    }
  }

  if (loading) return <div className="p-10">Loading maintenance requests...</div>

  return (
    <div className="p-10 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Maintenance Requests</h1>
          <p className="text-gray-500">Manage repairs and condition checks</p>
        </div>
        <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-bold text-sm">
          {requests.filter((r) => r.status === "Pending").length} Pending
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Product</th>
              <th className="p-4 font-semibold text-gray-600">Issue Reported</th>
              <th className="p-4 font-semibold text-gray-600">Status</th>
              <th className="p-4 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-10 text-center text-gray-500">
                  No maintenance requests found.
                </td>
              </tr>
            ) : (
              requests.map((r) => (
                <tr key={r._id} className="border-b last:border-0 hover:bg-gray-50 transition">
                  <td className="p-4">
                    <p className="font-bold">{r.productName || "Unknown Product"}</p>
                    <p className="text-xs text-gray-400">Order ID: {r.orderId?.slice(-6)}</p>
                  </td>
                  <td className="p-4 text-gray-600">{r.issue}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        r.status === "Resolved"
                          ? "bg-green-100 text-green-700"
                          : r.status === "In Progress"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {r.status !== "In Progress" && r.status !== "Resolved" && (
                        <button
                          onClick={() => updateStatus(r._id, "In Progress")}
                          className="bg-blue-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-blue-600 transition"
                        >
                          Start Fix
                        </button>
                      )}
                      {r.status !== "Resolved" && (
                        <button
                          onClick={() => updateStatus(r._id, "Resolved")}
                          className="bg-green-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-green-600 transition"
                        >
                          Resolve
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminMaintenance
