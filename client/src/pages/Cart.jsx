import React, { useContext } from "react"
import { CartContext } from "../context/CartContext"
import { useNavigate } from "react-router-dom"

function Cart() {

  const { cart, removeFromCart } = useContext(CartContext)
  const navigate = useNavigate()

  const total = cart.reduce((sum, item) => sum + item.price, 0)

  const goToPayment = () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn")

    if (!isLoggedIn) {
      alert("Please login before checkout")
      navigate("/login")
      return
    }

    if (cart.length === 0) {
      alert("Cart is empty")
      return
    }

    navigate("/payment")
  }

  return (

    <div className="bg-gray-100 min-h-screen p-6 md:p-10">

      <h2 className="text-3xl font-bold mb-8 text-gray-800">
        Your Cart
      </h2>

      {cart.length === 0 ? (

        // 🛒 EMPTY STATE
        <div className="bg-white p-10 rounded-xl shadow text-center">
          <h3 className="text-xl font-semibold mb-2">
            Your cart is empty
          </h3>
          <p className="text-gray-500 mb-4">
            Add some products to get started
          </p>
          <button
            onClick={() => navigate("/products")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Browse Products
          </button>
        </div>

      ) : (

        <div className="grid md:grid-cols-3 gap-8">

          {/* 🛍 LEFT: CART ITEMS */}
          <div className="md:col-span-2 space-y-6">

            {cart.map((item) => (

              <div
                key={item._id}
                className="bg-white rounded-xl shadow p-5 flex items-center gap-4 hover:shadow-lg transition"
              >

                {/* IMAGE */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />

                {/* DETAILS */}
                <div className="flex-1">

                  <h3 className="font-semibold text-lg text-gray-800">
                    {item.name}
                  </h3>

                  <p className="text-gray-500 text-sm">
                    Rental Price
                  </p>

                  <p className="text-lg font-bold text-green-600">
                    ₹{item.price}/month
                  </p>

                </div>

                {/* ACTION */}
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="text-red-500 border border-red-500 px-3 py-1 rounded hover:bg-red-500 hover:text-white transition"
                >
                  Remove
                </button>

              </div>

            ))}

          </div>

          {/* 💳 RIGHT: SUMMARY */}
          <div className="bg-white rounded-xl shadow p-6 h-fit sticky top-10">

            <h3 className="text-xl font-semibold mb-4">
              Price Details
            </h3>

            <div className="flex justify-between mb-2 text-gray-600">
              <span>Items ({cart.length})</span>
              <span>₹{total}</span>
            </div>

            <div className="flex justify-between mb-2 text-gray-600">
              <span>Delivery</span>
              <span className="text-green-600">Free</span>
            </div>

            <hr className="my-4" />

            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            <button
              onClick={goToPayment}
              className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
            >
              Proceed to Payment
            </button>

          </div>

        </div>

      )}

    </div>
  )
}

export default Cart