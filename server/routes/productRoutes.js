const router = require("express").Router()

// CONTROLLERS
const Product = require("../models/Product")
const productController = require("../controllers/productController")
const reviewController = require("../controllers/reviewController")

// MIDDLEWARE
const upload = require("../middleware/upload")
const { verifyToken, adminOnly } = require("../middleware/authMiddleware")

// =====================================================
// ⭐ PUBLIC ROUTES (USER SIDE)
// =====================================================

// 🔍 Get all products (search, filter, pagination)
router.get("/", productController.getProducts)

// ⭐ Add review
router.post("/:id/review", verifyToken, reviewController.addReview)

// 🔥 Popular products
router.get("/popular/list", productController.getPopularProducts)

// 🔥 Trending products
router.get("/trending/list", productController.getTrendingProducts)


// =====================================================
// 🔥 ADMIN ROUTES (PROTECTED)
// =====================================================

// 📊 Get all products (admin panel)
router.get("/admin/all", verifyToken, adminOnly, productController.getProducts)

// ➕ Create product (with image upload)
// 🔥 FIX: make route explicit to avoid conflict
router.post(
  "/create",
  verifyToken,
  adminOnly,
  upload.single("image"),
  productController.createProduct
)

// ✏️ Update product (with optional image)
router.put(
  "/:id",
  verifyToken,
  adminOnly,
  upload.single("image"),
  productController.updateProduct
)

// ❌ Delete product
router.delete(
  "/:id",
  verifyToken,
  adminOnly,
  productController.deleteProduct
)


// =====================================================
// 📦 GET SINGLE PRODUCT (ALWAYS LAST)
// =====================================================

router.get("/:id", productController.getProduct)

module.exports = router