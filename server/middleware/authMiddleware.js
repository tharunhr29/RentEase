const jwt = require("jsonwebtoken")

// ===============================
// ✅ ADMIN ONLY
// ===============================
const adminOnly = (req, res, next) => {

  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access required"
    })
  }

  next()
}


// ===============================
// ✅ VERIFY TOKEN
// ===============================
const verifyToken = (req, res, next) => {

  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ message: "Access Denied" })
  }

  try {

    // 🔥 handle "Bearer token"
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader

    const verified = jwt.verify(token, process.env.JWT_SECRET)

    req.user = verified

    next()

  } catch (err) {
    return res.status(400).json({ message: "Invalid Token" })
  }
}


// ===============================
// 🔥 EXPORTS (COMPATIBLE FIX)
// ===============================

// ✅ Default export → works as authMiddleware
module.exports = verifyToken

// ✅ Named exports → for flexible usage
module.exports.verifyToken = verifyToken
module.exports.adminOnly = adminOnly