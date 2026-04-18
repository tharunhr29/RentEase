import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../../services/api"

function AdminDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    activeRentals: 0,
    totalRevenue: 0,
    categoryStats: {}
  })
  const [loading, setLoading] = useState(true)

  const fetchStats = async () => {
    try {
      const res = await API.get("/admin/stats")
      setStats(res.data.data)
      setLoading(false)
    } catch (err) {
      console.log(err)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const generateReport = () => {
    const reportData = `
      RentEase Performance Report
      Date: ${new Date().toLocaleDateString()}
      ----------------------------
      Total Revenue: ₹${stats.totalRevenue}
      Total Orders: ${stats.totalOrders}
      Active Rentals: ${stats.activeRentals}
      Total User Base: ${stats.totalUsers}
    `
    const blob = new Blob([reportData], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `RentEase_Report_${Date.now()}.txt`
    link.click()
  }

  if (loading) return <div className="p-10 text-gray-500">Analytics initializing...</div>

  return (
    <div className="p-10 max-w-7xl mx-auto">
      
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Executive Dashboard</h1>
          <p className="text-gray-500 mt-1 uppercase text-xs tracking-widest font-bold">Platform Status: <span className="text-green-600">Healthy & Synchronized</span></p>
        </div>
        <button 
          onClick={generateReport}
          className="bg-black text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-gray-800 transition shadow-xl"
        >
          <span>📉</span> Generate Full Report
        </button>
      </div>

      {/* PRIMARY KIPS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: "Total Revenue", val: `₹${stats.totalRevenue.toLocaleString()}`, color: "bg-green-500", text: "text-white" },
          { label: "Total Orders", val: stats.totalOrders, color: "bg-white", text: "text-black border" },
          { label: "Active Rentals", val: stats.activeRentals, color: "bg-black", text: "text-white" },
          { label: "Platform Users", val: stats.totalUsers, color: "bg-blue-600", text: "text-white shadow-lg shadow-blue-100" },
        ].map((kpi, i) => (
          <div key={i} className={`${kpi.color} ${kpi.text} p-8 rounded-[2rem] shadow-sm relative overflow-hidden`}>
            <p className="text-xs uppercase font-bold opacity-70 mb-2">{kpi.label}</p>
            <p className="text-4xl font-extrabold">{kpi.val}</p>
            <div className="absolute -right-4 -bottom-4 opacity-10 text-7xl font-black">
              {kpi.label[0]}
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        
        {/* CATEGORY BREAKDOWN (VISUAL) */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] border shadow-sm">
          <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
            <span>📦</span> Inventory Deployment by Category
          </h3>
          <div className="space-y-6">
            {Object.entries(stats.categoryStats).map(([cat, count]) => {
                const percentage = (count / stats.totalProducts) * 100
                return (
                  <div key={cat}>
                    <div className="flex justify-between text-sm font-bold mb-2">
                      <span>{cat}</span>
                      <span className="text-gray-400">{count} Items ({Math.round(percentage)}%)</span>
                    </div>
                    <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                      <div 
                        className="bg-black h-full transition-all duration-1000" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
            })}
          </div>
        </div>

        {/* QUICK MANAGEMENT */}
        <div className="bg-gray-900 p-10 rounded-[2.5rem] text-white flex flex-col justify-between">
           <div>
              <h3 className="text-xl font-bold mb-2 text-green-400">System Priority</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Immediate actions required for inventory stabilization and user verification.</p>
           </div>

           <div className="space-y-3 mt-10">
             <button onClick={() => navigate("/admin/products")} className="w-full bg-white text-black py-4 rounded-2xl font-bold hover:bg-gray-100 transition">Update Stock Levels</button>
             <button onClick={() => navigate("/admin/users")} className="w-full bg-gray-800 text-white py-4 rounded-2xl font-bold hover:bg-gray-700 transition">Moderate New Users</button>
             <button onClick={() => navigate("/admin/claims")} className="w-full border border-gray-700 text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition">Open Claim Inbox</button>
           </div>

           <p className="mt-10 text-[10px] text-gray-600 uppercase tracking-widest text-center">Engine v2.0.4 • Stable Build</p>
        </div>

      </div>
    </div>
  )
}

export default AdminDashboard