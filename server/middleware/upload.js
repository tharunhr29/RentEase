const multer = require("multer")
const { CloudinaryStorage } = require("multer-storage-cloudinary")
const cloudinary = require("../config/cloudinary")

// =====================================================
// 🔥 CLOUDINARY STORAGE CONFIG
// =====================================================
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {

    return {
      folder: "rentease/products",

      allowed_formats: ["jpg", "png", "jpeg", "webp"],

      transformation: [
        { width: 800, height: 800, crop: "limit" },
        { quality: "auto" }
      ],

      public_id: `product-${Date.now()}`
    }
  }
})


// =====================================================
// 🔐 FILE FILTER (SECURITY)
// =====================================================
const fileFilter = (req, file, cb) => {

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"]

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error("Only images are allowed (jpg, png, webp)"), false)
  }
}


// =====================================================
// 🚀 MULTER CONFIG
// =====================================================
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB limit
  }
})

module.exports = upload