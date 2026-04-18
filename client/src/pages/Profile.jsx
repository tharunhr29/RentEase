import { useEffect,useState } from "react"
import API from "../services/api"

function Profile(){

const [rentals,setRentals] = useState([])

const userId = localStorage.getItem("userId")

useEffect(()=>{

API.get(`/rentals/user/${userId}`)
.then(res=>setRentals(res.data))

},[])

return(

<div className="max-w-5xl mx-auto p-8">

<h1 className="text-3xl font-bold mb-6">
My Rentals
</h1>

{rentals.map(r=>(
<div key={r._id} className="border p-4 mb-4">

<h2>{r.productId.name}</h2>
<p>Status: {r.status}</p>

</div>
))}

</div>

)

}

export default Profile