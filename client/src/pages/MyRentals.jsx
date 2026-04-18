import { useEffect, useState, useContext } from "react"
import API from "../services/api"
import { Link } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"

function MyRentals(){

const { user } = useContext(AuthContext)
const [rentals,setRentals] = useState([])
const [loading,setLoading] = useState(true)

const userId = user?._id

useEffect(()=>{

if(!userId){
setLoading(false)
return
}

API.get(`/rentals/user/${userId}`)
.then(res=>{
setRentals(res.data)
setLoading(false)
})
.catch(err=>{
console.log(err)
setLoading(false)
})

},[userId])

/* RETURN REQUEST */

const requestReturn = async(id)=>{

try{

await API.put(`/rentals/return/${id}`)

alert("Return request submitted")

const res = await API.get(`/rentals/user/${userId}`)
setRentals(res.data)

}catch(err){
console.log(err)
}

}

/* ADDED: MAINTENANCE REQUEST */

const requestMaintenance = async(id)=>{

try{

await API.post("/maintenance",{
rentalId:id,
issue:"Repair request"
})

alert("Maintenance request submitted")

}catch(err){
console.log(err)
}

}

/* ADDED: REMAINING DAYS CALCULATION */

const calculateRemainingDays = (endDate)=>{

const today = new Date()
const expiry = new Date(endDate)

const diff = expiry - today

return Math.ceil(diff / (1000*60*60*24))

}

if(loading){
return <div className="p-8 text-gray-600">Loading rentals...</div>
}

  return (
    <div>
      {rentals.length === 0 ? (
        <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-gray-100 shadow-sm">
          <div className="text-6xl mb-6">📦</div>
          <h2 className="text-2xl font-bold text-gray-900">No active subscriptions</h2>
          <p className="text-gray-500 mt-2 mb-8 max-w-sm mx-auto">You don't have any items currently on rent. Start your first rental today!</p>
          <Link to="/products" className="bg-black text-white px-8 py-4 rounded-2xl font-bold hover:bg-gray-800 transition shadow-xl shadow-gray-200">Browse Catalog</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {rentals.map((r) => {
            const totalDays = Math.ceil((new Date(r.endDate) - new Date(r.startDate)) / (1000 * 60 * 60 * 24))
            const remainingDays = calculateRemainingDays(r.endDate)
            const progress = Math.max(0, Math.min(100, 100 - (remainingDays / totalDays) * 100))

            return (
              <div key={r._id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="flex justify-between items-start mb-6">
                   <div>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${r.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {r.status === "active" ? "Live Rental" : r.status}
                      </span>
                      <h3 className="text-2xl font-black text-gray-900 mt-2">{r.productId?.name}</h3>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] text-gray-400 font-black uppercase">Plan</p>
                      <p className="font-bold">{r.tenure} Months</p>
                   </div>
                </div>

                {/* 📊 Progress Layer */}
                <div className="mb-8">
                   <div className="flex justify-between text-xs font-bold mb-2">
                      <span className="text-gray-400">Tenure Progress</span>
                      <span className="text-green-600">{Math.round(progress)}% Complete</span>
                   </div>
                   <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-green-600 h-full transition-all duration-1000 shadow-[0_0_10px_rgba(22,163,74,0.4)]" style={{ width: `${progress}%` }} />
                   </div>
                   <div className="flex justify-between mt-2 text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                      <span>Started: {new Date(r.startDate).toLocaleDateString()}</span>
                      <span>Expires: {new Date(r.endDate).toLocaleDateString()}</span>
                   </div>
                </div>

                {/* ⚡ Actions Area */}
                <div className="flex gap-4">
                  {r.status === "active" && !r.returnRequested && (
                    <button
                      onClick={() => requestReturn(r._id)}
                      className="flex-1 bg-red-50 text-red-600 py-3 rounded-2xl font-bold text-sm hover:bg-red-600 hover:text-white transition-all"
                    >
                      End Lease
                    </button>
                  )}
                  {r.status === "active" && (
                    <button
                      onClick={() => requestMaintenance(r._id)}
                      className="flex-1 bg-gray-900 text-white py-3 rounded-2xl font-bold text-sm hover:shadow-lg transition-all"
                    >
                      🔧 Fix Issue
                    </button>
                  )}
                  {r.returnRequested && (
                    <div className="flex-1 bg-yellow-50 text-yellow-700 py-3 rounded-2xl font-bold text-sm text-center border border-yellow-100 underline decoration-2 decoration-yellow-400 underline-offset-4">
                      Return Processing...
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default MyRentals