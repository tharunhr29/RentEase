import { Link, useNavigate, useLocation } from "react-router-dom"
import { useContext } from "react"
import { CartContext } from "../context/CartContext"
import { AuthContext } from "../context/AuthContext"

function Navbar() {

  const { cart } = useContext(CartContext)
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  // 🔥 CHECK ADMIN PAGE
  const isAdminPage = location.pathname.startsWith("/admin")

  return (
    <nav className="sticky top-0 z-50 bg-black text-white px-8 py-4 flex justify-between items-center shadow-md">

      <Link to="/" className="text-2xl font-bold hover:text-gray-300 transition">
        RentEase
      </Link>

      <div className="flex items-center gap-6">

        {/* 🔥 SHOW ONLY FOR USERS */}
        {!isAdminPage && (
          <>
            <Link to="/" className="hover:text-gray-300 transition">
              Home
            </Link>

            <Link to="/products" className="hover:text-gray-300 transition">
              Products
            </Link>

            <Link to="/cart" className="relative hover:text-gray-300 transition">
              Cart
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {cart.length}
                </span>
              )}
            </Link>
          </>
        )}

        {/* 🔥 AUTH SECTION */}
        {user ? (
          <>

            {/* USER */}
            {!isAdminPage && (
              <Link to="/dashboard" className="hover:text-gray-300 transition">
                Dashboard
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          !isAdminPage && (
            <>
              <Link
                to="/login"
                className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="border border-white px-4 py-2 rounded hover:bg-white hover:text-black transition"
              >
                Register
              </Link>
            </>
          )
        )}

      </div>
    </nav>
  )
}

export default Navbar