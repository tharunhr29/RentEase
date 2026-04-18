import { useState } from "react"
import API from "../../services/api"

function AddProduct() {

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    deposit: "",
    tenureOptions: "",
    stock: "",
    description: ""
  })

  const [image, setImage] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData()

    Object.keys(form).forEach(key => {
      formData.append(key, form[key])
    })

    formData.append("image", image)

    await API.post("/admin/products", formData)

    alert("Product Added!")
  }

  return (
    <div className="p-6">

      <h2 className="text-2xl font-bold mb-6">Add Product</h2>

      <form onSubmit={handleSubmit} className="grid gap-4 max-w-md">

        <input placeholder="Name" onChange={e => setForm({...form, name: e.target.value})} />

        <input placeholder="Category" onChange={e => setForm({...form, category: e.target.value})} />

        <input placeholder="Price" type="number" onChange={e => setForm({...form, price: e.target.value})} />

        <input placeholder="Deposit" type="number" onChange={e => setForm({...form, deposit: e.target.value})} />

        <input placeholder="Tenure (3,6,12)" onChange={e => setForm({...form, tenureOptions: e.target.value})} />

        <input placeholder="Stock" type="number" onChange={e => setForm({...form, stock: e.target.value})} />

        <textarea 
          placeholder="Product Description" 
          className="border p-2 rounded h-32"
          onChange={e => setForm({...form, description: e.target.value})} 
        />

        <input type="file" onChange={e => setImage(e.target.files[0])} />

        <button className="bg-green-500 text-white py-2 rounded">
          Add Product
        </button>

      </form>
    </div>
  )
}

export default AddProduct