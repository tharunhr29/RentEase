import { useEffect, useState } from "react"
import API from "../../services/api"

function AdminLocations() {
  const [areas, setAreas] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: "", deliveryCharge: 0 })

  useEffect(() => {
    fetchAreas()
  }, [])

  const fetchAreas = async () => {
    try {
      const res = await API.get("/admin/service-areas")
      setAreas(res.data.data)
      setLoading(false)
    } catch (err) {
      console.log(err)
      setLoading(false)
    }
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    try {
      await API.post("/admin/service-areas", form)
      setForm({ name: "", deliveryCharge: 0 })
      fetchAreas()
    } catch (err) {
      alert("Failed to add location")
    }
  }

  const toggleStatus = async (id) => {
    try {
      await API.put(`/admin/service-areas/${id}/toggle`)
      fetchAreas()
    } catch (err) {
      alert("Toggle failed")
    }
  }

  if (loading) return <div className="p-10 text-gray-500">Loading service areas...</div>

  return (
    <div className="p-10 max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold">Service Areas</h1>
        <p className="text-gray-500">Manage the cities and regions where RentEase operates</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        
        {/* ADD AREA FORM */}
        <div className="lg:col-span-1">
          <form onSubmit={handleAdd} className="bg-white p-8 rounded-3xl border shadow-sm sticky top-10">
            <h2 className="text-xl font-bold mb-6">Expand Network</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">City Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Bangalore" 
                  className="w-full mt-1 border-2 border-gray-100 rounded-xl p-3 focus:border-green-500 outline-none transition"
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Delivery Charge (₹)</label>
                <input 
                  type="number" 
                  className="w-full mt-1 border-2 border-gray-100 rounded-xl p-3 focus:border-green-500 outline-none transition"
                  value={form.deliveryCharge}
                  onChange={e => setForm({...form, deliveryCharge: e.target.value})}
                  required
                />
              </div>
              <button className="w-full bg-green-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-green-100 mt-4 hover:bg-green-700 transition">
                Add Location
              </button>
            </div>
          </form>
        </div>

        {/* LIST OF AREAS */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-bold text-gray-400 uppercase text-xs tracking-widest mb-4">Active Operations</h2>
          {areas.length === 0 ? (
            <p className="text-gray-400 italic">No locations added yet.</p>
          ) : (
            areas.map(area => (
              <div key={area._id} className="bg-white p-6 rounded-3xl border flex justify-between items-center shadow-sm hover:shadow-md transition">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg ${area.isActive ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                    📍
                  </div>
                  <div>
                    <p className="text-xl font-bold">{area.name}</p>
                    <p className="text-sm text-gray-500">Delivery Charge: ₹{area.deliveryCharge}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-xs font-bold uppercase ${area.isActive ? "text-green-600" : "text-red-500"}`}>
                    {area.isActive ? "Active" : "Disabled"}
                  </span>
                  <button 
                    onClick={() => toggleStatus(area._id)}
                    className={`w-14 h-8 rounded-full transition-all relative ${area.isActive ? "bg-green-600" : "bg-gray-300"}`}
                  >
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${area.isActive ? "right-1" : "left-1"}`} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  )
}

export default AdminLocations
