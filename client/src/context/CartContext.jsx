import { createContext, useState } from "react"

export const CartContext = createContext()

export const CartProvider = ({ children }) => {

  const [cart, setCart] = useState([])

  // Add product
  const addToCart = (product) => {
    setCart([...cart, product])
  }

  // Remove product
  const removeFromCart = (id) => {
    setCart(cart.filter(item => item._id !== id))
  }

  // Clear cart after payment
  const clearCart = () => {
    setCart([])
  }

  return (
    <CartContext.Provider 
      value={{ cart, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  )
}