import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import API from "../../services/api"

function AdminVerifyOTP() {

  const [form, setForm] = useState({
    otp: "",
    password: "",
    confirmPassword: ""
  })

  const [loading, setLoading] = useState(false)

  const location = useLocation()
  const navigate = useNavigate()

  const email = location.state?.email

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // 🔐 Strong password regex
  const strongPassword =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/

  const handleVerify = async () => {
    try {
      if (!form.otp || !form.password || !form.confirmPassword) {
        return alert("All fields are required")
      }

      if (form.password !== form.confirmPassword) {
        return alert("Passwords do not match")
      }

      if (!strongPassword.test(form.password)) {
        return alert(
          "Password must include uppercase, lowercase, number, and special character"
        )
      }

      setLoading(true)

      const res = await API.post("/admin/verify-otp", {
        email,
        otp: form.otp,
        password: form.password,
        confirmPassword: form.confirmPassword
      })

      alert(res.data.message)

      navigate("/admin/login")

    } catch (err) {
      console.log(err.response)
      alert(err.response?.data?.message || "Error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-xl shadow-lg w-96 text-center">

        <h2 className="text-2xl font-bold mb-4">
          Verify OTP & Set Password
        </h2>

        <p className="mb-4 text-gray-600">
          Enter OTP sent to <span className="font-medium">{email}</span>
        </p>

        {/* OTP */}
        <input
          name="otp"
          maxLength="6"
          value={form.otp}
          onChange={handleChange}
          placeholder="Enter OTP"
          className="w-full p-3 border rounded mb-3 text-center tracking-widest"
        />

        {/* Password */}
        <input
          name="password"
          type="password"
          placeholder="New Password"
          className="w-full p-3 border rounded mb-3"
          onChange={handleChange}
        />

        {/* Confirm Password */}
        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          className="w-full p-3 border rounded mb-4"
          onChange={handleChange}
        />

        <button
          onClick={handleVerify}
          disabled={loading}
          className={`w-full p-3 rounded text-white ${
            loading ? "bg-gray-500" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Verifying..." : "Verify & Continue"}
        </button>

      </div>
    </div>
  )
}

export default AdminVerifyOTP