exports.isAdmin = (req, res, next) => {
    const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Admin only" })
  }
  next()
}
  if (req.user && req.user.role === "admin") {
    next()
  } else {
    return res.status(403).json({
      success: false,
      message: "Admin access required"
    })
  }
}