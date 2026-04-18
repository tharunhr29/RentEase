import express from "express"
import Product from "../models/Product.js"
import cloudinary from "../config/cloudinary.js"
import multer from "multer"

const router = express.Router()
const upload = multer({ dest: "uploads/" })

// ✅ ADD PRODUCT
router.post("/products", upload.single("image"), async (req, res) => {
  try {

    const result = await cloudinary.uploader.upload(req.file.path)

    const product = new Product({
      ...req.body,
      image: result.secure_url
    })

    await product.save()

    res.json({ success: true, data: product })

  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})


// ✅ GET ALL PRODUCTS
router.get("/products", async (req, res) => {
  const products = await Product.find()
  res.json({ success: true, data: products })
})


// ✅ UPDATE PRODUCT
router.put("/products/:id", async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  )

  res.json({ success: true, data: product })
})


// ✅ DELETE PRODUCT
router.delete("/products/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id)
  res.json({ success: true })
})

export default router