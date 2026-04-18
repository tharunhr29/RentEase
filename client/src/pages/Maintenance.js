import {useState} from "react"
import API from "../services/api"

function Maintenance(){

const [issue,setIssue]=useState("")

const submitRequest = async()=>{

await API.post("/maintenance",{issue})

alert("Request submitted")

}

return(

<div className="p-10">

<h1>Maintenance Request</h1>

<textarea
placeholder="Describe issue"
onChange={(e)=>setIssue(e.target.value)}
/>

<button
onClick={submitRequest}
className="bg-blue-600 text-white px-4 py-2"
>
Submit
</button>

</div>

)

}

export default Maintenance