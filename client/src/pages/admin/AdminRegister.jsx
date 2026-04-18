import { useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../../services/api"

function AdminRegister() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })

  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)

      const res = await API.post("/admin/register", form)

      alert(res.data.message)

      navigate("/admin/verify-otp", { state: { email: form.email } })

    } catch (err) {
      alert(err.response?.data?.message || "Error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">

      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold">Create Admin Account 🚀</h2>
          <p className="text-gray-500 text-sm mt-1">
            Secure your dashboard with strong credentials
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="w-full p-3 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-black transition"
            onChange={handleChange}
            required
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="w-full p-3 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-black transition"
            onChange={handleChange}
            required
          />

          {/* Password */}
          <div className="relative mb-3">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
              onChange={handleChange}
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 cursor-pointer text-gray-500"
            >
              👁
            </span>
          </div>

          {/* Confirm Password */}
          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-black transition"
            onChange={handleChange}
            required
          />

          {/* Password Rules */}
          <div className="text-xs text-gray-500 mb-4 bg-gray-50 p-3 rounded">
            <p className="font-medium mb-1">Password must contain:</p>
            <ul className="list-disc list-inside">
              <li>At least 8 characters</li>
              <li>Uppercase & lowercase letters</li>
              <li>At least one number</li>
              <li>One special character (@$!%*?&)</li>
            </ul>
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
            {loading ? "Creating Account..." : "Register"}
          </button>

        </form>

        {/* Footer */}
        <p className="text-sm text-center mt-5 text-gray-500">
          Already have an account?{" "}
          <span
            className="text-black font-semibold cursor-pointer hover:underline"
            onClick={() => navigate("/admin/login")}
          >
            Login
          </span>
        </p>

      </div>
    </div>
  )
}

export default AdminRegister