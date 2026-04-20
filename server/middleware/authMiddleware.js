const jwt = require("jsonwebtoken")

// ===============================
// ✅ VERIFY TOKEN (MAIN)
// ===============================
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ success: false, message: "Access Denied" })
  }

  try {
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader

    const verified = jwt.verify(token, process.env.JWT_SECRET)
    req.user = verified
    next()
  } catch (err) {
    return res.status(400).json({ success: false, message: "Invalid Token" })
  }
}

// ===============================
// ✅ ADMIN ONLY
// ===============================
const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required"
    })
  }
  next()
}

// ===============================
// 🔥 EXPORTS
// ===============================
module.exports = {
  verifyToken,
  adminOnly
}