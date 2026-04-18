// middleware/isAdmin.js

const isAdmin = (req, res, next) => {
  try {

    // ✅ Check if user exists (set by authMiddleware)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated"
      });
    }

    // ✅ Check role
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied (Admin only)"
      });
    }

    // ✅ Allow access
    next();

  } catch (error) {
    console.error("isAdmin Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

module.exports = isAdmin;