import { createContext, useState, useEffect } from "react"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 🔥 INITIALIZE FROM LOCALSTORAGE
    const storedUser = localStorage.getItem("user")
    const token = localStorage.getItem("token")

    if (storedUser && token) {
      setUser(JSON.parse(storedUser))
      setIsLoggedIn(true)
    }
    setLoading(false)
  }, [])

  const login = (userData, token) => {
    setUser(userData)
    setIsLoggedIn(true)
    localStorage.setItem("user", JSON.stringify(userData))
    localStorage.setItem("token", token)
    localStorage.setItem("userId", userData._id)
    localStorage.setItem("isLoggedIn", "true")
  }

  const logout = () => {
    setUser(null)
    setIsLoggedIn(false)
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    localStorage.removeItem("userId")
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("userRole")
    localStorage.removeItem("userName")
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
