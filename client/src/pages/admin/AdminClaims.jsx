import { useEffect, useState } from "react"
import API from "../../services/api"

function AdminClaims() {
  const [claims, setClaims] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchClaims()
  }, [])

  const fetchClaims = async () => {
    try {
      const res = await API.get("/admin/claims")
      setClaims(res.data.data)
      setLoading(false)
    } catch (err) {
      console.log(err)
      setLoading(false)
    }
  }

  const updateClaim = async (id, status, notes = "") => {
    try {
      await API.put(`/admin/claims/${id}`, { status, resolutionNotes: notes })
      fetchClaims()
    } catch (err) {
      alert("Status update failed")
    }
  }

  if (loading) return <div className="p-10 text-gray-500">Loading claims...</div>

  return (
    <div className="p-10 max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold">Claims & Dispute Resolution</h1>
        <p className="text-gray-500">Professional management of damage claims and customer disputes</p>
      </div>

      <div className="space-y-6">
        {claims.length === 0 ? (
          <div className="bg-white p-20 text-center border-2 border-dashed rounded-3xl">
            <p className="text-3xl mb-2">🎈</p>
            <p className="text-gray-500 font-medium">Clean slate! No active disputes or claims found.</p>
          </div>
        ) : (
          claims.map(claim => (
            <div key={claim._id} className="bg-white rounded-3xl shadow-sm border p-6 hover:shadow-md transition grid lg:grid-cols-3 gap-6">
              
              <div className="lg:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    claim.status === "Settled" ? "bg-green-100 text-green-700" :
                    claim.status === "Dismissed" ? "bg-gray-100 text-gray-600" : "bg-red-100 text-red-700"
                  }`}>
                    {claim.status}
                  </span>
                  <span className="text-xs text-gray-400">Ref: {claim._id.slice(-6).toUpperCase()}</span>
                </div>
                
                <h3 className="text-xl font-bold mb-1">{claim.type}: {claim.productId?.name}</h3>
                <p className="text-sm text-gray-500 mb-4">Raised by: <span className="text-black font-medium">{claim.userId?.name}</span> ({claim.userId?.email})</p>
                
                <div className="bg-gray-50 p-4 rounded-2xl mb-4 border border-gray-100">
                  <p className="text-sm text-gray-700 leading-relaxed italic">"{claim.description}"</p>
                </div>

                {claim.resolutionNotes && (
                  <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                    <p className="text-xs text-blue-600 font-bold uppercase mb-1">Official Resolution</p>
                    <p className="text-sm text-blue-800">{claim.resolutionNotes}</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-between items-end">
                <div className="text-right">
                  <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Order ID</p>
                  <p className="font-mono text-gray-800 font-bold">{claim.orderId?.orderId || "N/A"}</p>
                </div>

                <div className="w-full space-y-2 mt-10">
                  <p className="text-xs text-gray-400 font-bold">Update Case Status</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => updateClaim(claim._id, "Investigating")} className="bg-blue-600 text-white py-2 rounded-xl text-xs font-bold shadow-lg shadow-blue-100">Investigate</button>
                    <button onClick={() => {
                        const notes = prompt("Enter resolution notes:")
                        if(notes) updateClaim(claim._id, "Settled", notes)
                    }} className="bg-green-600 text-white py-2 rounded-xl text-xs font-bold shadow-lg shadow-green-100">Settle Case</button>
                    <button onClick={() => updateClaim(claim._id, "Dismissed")} className="bg-gray-800 text-white py-2 rounded-xl text-xs font-bold col-span-2">Dismiss Claim</button>
                  </div>
                </div>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default AdminClaims
