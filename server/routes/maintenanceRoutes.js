const router = require("express").Router()

const controller = require("../controllers/maintenanceController")

const { verifyToken } = require("../middleware/authMiddleware")
const { isAdmin } = require("../middleware/adminMiddleware")

router.post("/", verifyToken, controller.createRequest)
router.get("/", verifyToken, isAdmin, controller.getRequests)
router.put("/:id", verifyToken, isAdmin, controller.updateStatus)

module.exports = router