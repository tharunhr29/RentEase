const Product = require("../models/Product")

// =====================================================
// ⭐ ADD REVIEW (USER)
// =====================================================
exports.addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" })
    }

    // 🔥 Check if user already reviewed
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user.id.toString()
    )

    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: "Product already reviewed" })
    }

    const review = {
      user: req.user.id,
      rating: Number(rating),
      comment: comment
    }

    product.reviews.push(review)
    
    // Auto-calculate using model method
    product.calculateRatings()

    await product.save()

    res.status(201).json({
      success: true,
      message: "Review added",
      product
    })

  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// =====================================================
// 📊 GET ALL REVIEWS (ADMIN)
// =====================================================
exports.getAllReviews = async (req, res, next) => {
  try {
    const products = await Product.find({ "reviews.0": { $exists: true } })
      .select("name reviews")
      .populate("reviews.user", "name email")
      .lean()

    // Flatten reviews for admin view
    const allReviews = []
    products.forEach(p => {
      p.reviews.forEach(r => {
        allReviews.push({
          ...r,
          productName: p.name,
          productId: p._id
        })
      })
    })

    res.json({
      success: true,
      reviews: allReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    })

  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// =====================================================
// ❌ DELETE REVIEW (ADMIN)
// =====================================================
exports.deleteReview = async (req, res, next) => {
  try {
    const { productId, reviewId } = req.params

    const product = await Product.findById(productId)

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" })
    }

    product.reviews = product.reviews.filter(
      (r) => r._id.toString() !== reviewId.toString()
    )

    product.calculateRatings()
    await product.save()

    res.json({
      success: true,
      message: "Review deleted successfully"
    })

  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}