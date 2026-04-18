function Filters({setCategory}){

return(

<select
onChange={(e)=>setCategory(e.target.value)}
className="border p-2"
>

<option value="">All Categories</option>
<option value="Furniture">Furniture</option>
<option value="Appliances">Appliances</option>

</select>

)

}

export default Filters