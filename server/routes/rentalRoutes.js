const router = require("express").Router()

const controller = require("../controllers/rentalController")

const { verifyToken } = require("../middleware/authMiddleware")

// create rental
router.post("/", verifyToken, controller.createRental)

// get rentals for user
router.get("/user/:userId", verifyToken, controller.getUserRentals)

// get active rentals
router.get("/active", verifyToken, controller.getActiveRentals)

// get all rentals (admin)
router.get("/", verifyToken, controller.getAllRentals)

// request return
router.put("/return/:id", verifyToken, controller.requestReturn)

// complete rental
router.put("/complete/:id", verifyToken, controller.completeRental)

module.exports = router