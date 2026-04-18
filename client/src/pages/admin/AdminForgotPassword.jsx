import { useState } from "react"
import API from "../../services/api"
import { useNavigate } from "react-router-dom"

function AdminForgotPassword() {

  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleSendOTP = async () => {
    try {
      if (!email) return alert("Please enter your email")

      setLoading(true)

      const res = await API.post("/admin/forgot-password", { email })

      alert(res.data.message)

      navigate("/admin/reset-password", { state: { email } })

    } catch (err) {
      alert(err.response?.data?.message || "Error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">

      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm">

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">Forgot Password 🔑</h2>
          <p className="text-gray-500 text-sm mt-1">
            Enter your email to receive a reset OTP
          </p>
        </div>

        {/* Email Input */}
        <input
          type="email"
          placeholder="Email Address"
          className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-black transition"
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Button */}
        <button
          onClick={handleSendOTP}
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-semibold transition ${
            loading
              ? "bg-gray-500"
              : "bg-black hover:bg-gray-800"
          }`}
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>

        {/* Footer */}
        <p className="text-sm text-center mt-5 text-gray-500">
          Remember your password?{" "}
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

export default AdminForgotPassword