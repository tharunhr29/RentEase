function SearchBar({search,setSearch}){

return(

<input
type="text"
placeholder="Search products..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="border p-2 w-full"
/>

)

}

export default SearchBar