import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import API from "../../services/api"
import { AuthContext } from "../../context/AuthContext"

function AdminLogin() {

  const [form, setForm] = useState({
    email: "",
    password: ""
  })

  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()

  // ===============================
  // HANDLE INPUT CHANGE
  // ===============================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const { login } = useContext(AuthContext)

  // ===============================
  // HANDLE LOGIN
  // ===============================
  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      if (!form.email || !form.password) {
        return alert("Please fill all fields")
      }

      setLoading(true)

      const res = await API.post("/admin/login", form)

      if (!res.data?.success) {
        throw new Error(res.data?.message || "Login failed")
      }

      const { token, user } = res.data.data
      login(user, token) // 🔥 USE AUTH CONTEXT

      alert("Login successful ✅")
      navigate("/admin")

    } catch (err) {
      console.log("LOGIN ERROR:", err.response || err.message)
      alert(err.response?.data?.message || err.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  // ===============================
  // ENTER KEY SUPPORT
  // ===============================
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin(e)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">

      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm"
      >

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">Admin Login 🔐</h2>
          <p className="text-gray-500 text-sm">
            Access your dashboard securely
          </p>
        </div>

        {/* Email */}
        <input
          name="email"
          type="email"
          placeholder="Email Address"
          value={form.email}
          className="w-full p-3 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-black transition"
          onChange={handleChange}
          onKeyDown={handleKeyPress}
        />

        {/* Password */}
        <div className="relative mb-2">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={form.password}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
            onChange={handleChange}
            onKeyDown={handleKeyPress}
          />

          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 cursor-pointer text-gray-500"
          >
            👁
          </span>
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-semibold transition ${
            loading
              ? "bg-gray-500"
              : "bg-black hover:bg-gray-800"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Credentials Hint */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-800">
          <p className="font-bold mb-1 underline">Admin Access Details:</p>
          <p>Email: <span className="font-mono">admin@rentease.com</span></p>
          <p>Password: <span className="font-mono">RentEaseAdmin@2026</span></p>
        </div>

      </form>

    </div>
  )
}

export default AdminLogin