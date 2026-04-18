import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import API from "../../services/api"

function AdminResetPassword() {

  const [form, setForm] = useState({
    otp: "",
    password: "",
    confirmPassword: ""
  })

  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const location = useLocation()
  const navigate = useNavigate()
  const email = location.state?.email

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleReset = async () => {
    try {
      setLoading(true)

      const res = await API.post("/admin/reset-password", {
        email,
        ...form
      })

      alert(res.data.message)

      navigate("/admin/login")

    } catch (err) {
      alert(err.response?.data?.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">

      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm">

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">Reset Password 🔐</h2>
          <p className="text-gray-500 text-sm mt-1">
            Enter OTP and set a new secure password
          </p>
        </div>

        {/* OTP */}
        <input
          name="otp"
          placeholder="Enter OTP"
          className="w-full p-3 border rounded-lg mb-3 text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-black transition"
          onChange={handleChange}
        />

        {/* Password */}
        <div className="relative mb-3">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
            onChange={handleChange}
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
          name="confirmPassword"
          type={showPassword ? "text" : "password"}
          placeholder="Confirm Password"
          className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-black transition"
          onChange={handleChange}
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
          onClick={handleReset}
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-semibold transition ${
            loading
              ? "bg-gray-500"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        {/* Footer */}
        <p className="text-sm text-center mt-5 text-gray-500">
          Back to{" "}
          <span
            onClick={() => navigate("/admin/login")}
            className="text-black font-semibold cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>

      </div>
    </div>
  )
}

export default AdminResetPassword