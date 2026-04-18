import { useState, useEffect, useContext } from "react"
import API from "../services/api"
import { AuthContext } from "../context/AuthContext"
import MyRentals from "./MyRentals"
import MyOrders from "./MyOrders"
import RentalHistory from "./RentalHistory"

function Dashboard(){

const { user } = useContext(AuthContext)
const [activeTab,setActiveTab] = useState("rentals")

/* DATA STATES */
const [rentals,setRentals] = useState([])
const [orders,setOrders] = useState([])

const userId = user?._id
const userEmail = user?.email

/* FETCH DATA */

useEffect(()=>{

if(!userId || !userEmail) return

// Fetch Rentals
API.get(`/rentals/user/${userId}`)
.then(res=>{
setRentals(res.data)
})
.catch(err=>console.log(err))

// Fetch Orders
API.get(`/orders/user/${userEmail}`)
.then(res=>{
setOrders(res.data.orders || [])
})
.catch(err=>console.log(err))

},[userId, userEmail])

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto p-10">
        
        {/* 👋 Welcome Header */}
        <div className="mb-12">
           <h1 className="text-4xl font-black tracking-tight text-gray-900">Member Hub.</h1>
           <p className="text-gray-500 mt-2 font-medium">Manage your active subscriptions, track orders, and request support.</p>
        </div>

        {/* 📊 High-End Kpis */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            { label: "Active Subscriptions", val: rentals.filter(r => r.status === "active").length, icon: "📦", color: "bg-green-600", text: "text-white shadow-xl shadow-green-100" },
            { label: "Processing Orders", val: orders.filter(o => o.trackingStatus !== "completed").length, icon: "🚚", color: "bg-white", text: "text-gray-900 border" },
            { label: "Lifetime Rentals", val: orders.length, icon: "✨", color: "bg-black", text: "text-white" },
          ].map((kpi, i) => (
            <div key={i} className={`${kpi.color} ${kpi.text} p-8 rounded-[2.5rem] relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300`}>
                <div className="flex justify-between items-center mb-6">
                   <span className="text-2xl">{kpi.icon}</span>
                   <span className="text-[10px] uppercase font-black tracking-widest opacity-60">Insight</span>
                </div>
                <p className="text-5xl font-black mb-1">{kpi.val}</p>
                <p className="text-sm font-bold opacity-70">{kpi.label}</p>
            </div>
          ))}
        </div>

        {/* 🍱 Unified Navigation */}
        <div className="flex bg-white p-2 rounded-[2rem] shadow-sm border border-gray-100 w-fit mb-12 mx-auto">
          {[
            { id: "rentals", label: "My Rentals", icon: "🏠" },
            { id: "orders", label: "Order History", icon: "🧾" },
            { id: "history", label: "Past Rentals", icon: "🕰️" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-8 py-4 rounded-3xl text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === tab.id
                  ? "bg-gray-900 text-white shadow-xl"
                  : "text-gray-400 hover:text-gray-900"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* 🎬 Content Layer */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
           {activeTab === "rentals" && <MyRentals isDashboard={true}/>}
           {activeTab === "orders" && <MyOrders isDashboard={true}/>}
           {activeTab === "history" && <RentalHistory isDashboard={true}/>}
        </div>

      </div>
    </div>
  )
}

export default Dashboard