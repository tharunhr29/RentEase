import { useEffect, useState } from "react"
import API from "../../services/api"

function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users")
      setUsers(res.data.data)
      setLoading(false)
    } catch (err) {
      console.log(err)
      setLoading(false)
    }
  }

  const toggleRole = async (id, currentRole) => {
    try {
      const newRole = currentRole === "admin" ? "user" : "admin"
      await API.put(`/admin/users/${id}/role`, { role: newRole })
      fetchUsers()
    } catch (err) {
      alert("Role update failed")
    }
  }

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure? This action is permanent.")) return
    try {
      await API.delete(`/admin/users/${id}`)
      fetchUsers()
    } catch (err) {
      alert("Deletion failed")
    }
  }

  if (loading) return <div className="p-10 text-gray-500">Loading users...</div>

  return (
    <div className="p-10 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">User & Manager Directory</h1>
          <p className="text-gray-500">Moderate accounts and assign administrative roles</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-blue-100 px-4 py-2 rounded-xl">
            <p className="text-xs text-blue-600 font-bold uppercase">Total Users</p>
            <p className="text-xl font-bold text-blue-800">{users.filter(u => u.role === "user").length}</p>
          </div>
          <div className="bg-purple-100 px-4 py-2 rounded-xl">
            <p className="text-xs text-purple-600 font-bold uppercase">Admins</p>
            <p className="text-xl font-bold text-purple-800">{users.filter(u => u.role === "admin").length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-600">User Identity</th>
              <th className="p-4 font-semibold text-gray-600">Verification</th>
              <th className="p-4 font-semibold text-gray-600">Role</th>
              <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b last:border-0 hover:bg-gray-50 transition">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">
                      {u.name[0]}
                    </div>
                    <div>
                      <p className="font-bold">{u.name}</p>
                      <p className="text-xs text-gray-400">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${u.isVerified ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {u.isVerified ? "Verified" : "Pending"}
                  </span>
                </td>
                <td className="p-4 capitalize">
                  <span className={`font-medium ${u.role === "admin" ? "text-purple-600 font-bold" : "text-gray-600"}`}>
                    {u.role}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button 
                    onClick={() => toggleRole(u._id, u.role)}
                    className="text-xs bg-gray-100 hover:bg-black hover:text-white px-3 py-1 rounded transition"
                  >
                    Set as {u.role === "admin" ? "User" : "Admin"}
                  </button>
                  <button 
                    onClick={() => deleteUser(u._id)}
                    className="text-xs text-red-600 bg-red-50 hover:bg-red-600 hover:text-white px-3 py-1 rounded transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminUsers
