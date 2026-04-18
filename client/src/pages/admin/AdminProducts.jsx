import React, { useEffect,useCallback, useState } from "react"
import axios from "axios"


function AdminProducts() {

  const [products, setProducts] = useState([])
  const [form, setForm] = useState({})
  const [editingId, setEditingId] = useState(null)

  const token = localStorage.getItem("token")

  // ✅ FETCH PRODUCTS
  const fetchProducts = useCallback(async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/products/admin/all",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      // 🔥 SAFE SET
      setProducts(res.data?.products || [])

    } catch (err) {
      console.log(err)
      setProducts([]) // fallback
    }
  }, [token])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleImage = (e) => {
    setForm({ ...form, image: e.target.files[0] })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const data = new FormData()

    for (let key in form) {
      data.append(key, form[key])
    }

    try {
      if (editingId) {
        await axios.put(
  `http://localhost:5000/api/products/${editingId}`,
  data,
  {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data"
    }
  }
)
      } else {
        await axios.post(
  "http://localhost:5000/api/products/create",
  data,
  {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data"
    }
  }
)
      }

      setForm({})
      setEditingId(null)
      fetchProducts()

    } catch (err) {
      console.log(err)
    }
  }

  const handleEdit = (p) => {
    setForm(p)
    setEditingId(p._id)
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/products/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      fetchProducts()

    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <h1 className="text-2xl font-bold mb-6">Product Management</h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow mb-6 grid grid-cols-2 gap-4"
      >

        <input name="name" placeholder="Name" onChange={handleChange} value={form.name || ""} />
        <input name="category" placeholder="Category" onChange={handleChange} value={form.category || ""} />
        <input name="price" placeholder="Price" onChange={handleChange} value={form.price || ""} />
        <input name="deposit" placeholder="Deposit" onChange={handleChange} value={form.deposit || ""} />
        <input name="stock" placeholder="Stock" onChange={handleChange} value={form.stock || ""} />
        <input type="file" onChange={handleImage} />

        <textarea 
          name="description" 
          placeholder="Product Description" 
          className="col-span-2 border p-2 rounded h-24"
          onChange={handleChange} 
          value={form.description || ""} 
        />

        <button className="bg-green-500 text-white p-2 rounded col-span-2 hover:bg-green-600">
          {editingId ? "Update Product" : "Add Product"}
        </button>

      </form>

      {/* TABLE */}
      <div className="bg-white rounded shadow overflow-x-auto">

        <table className="w-full text-sm">

          <thead className="bg-gray-200">
            <tr>
              <th className="p-2">Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Available</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {(products || []).length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  No products found
                </td>
              </tr>
            ) : (
              (products || []).map(p => (
                <tr key={p._id} className="border-t">

                  <td className="p-2">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-12 w-12 object-cover rounded"
                    />
                  </td>

                  <td>{p.name}</td>
                  <td>₹ {p.price}</td>
                  <td>
                    <span className={`font-bold ${p.stock <= 2 ? "text-red-500 underline" : p.stock <= 5 ? "text-orange-500" : "text-green-600"}`}>
                      {p.stock} units
                    </span>
                  </td>
                  <td>{p.availableStock}</td>

                  <td className="space-x-2">
                    <button
                      onClick={() => handleEdit(p)}
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(p._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>

                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>

    </div>
  )
}

export default AdminProducts