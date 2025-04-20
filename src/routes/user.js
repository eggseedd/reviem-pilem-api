const express = require("express")
const { authenticateToken } = require("../middleware/authMiddleware")
const { addToListController, updateListStatusController, getUserListController } = require("../controllers/userController")
const router = express.Router()

router.post("/list/:filmId", authenticateToken, addToListController)

router.patch("/list/:filmId", authenticateToken, updateListStatusController)

router.get("/list/:userId", getUserListController)

module.exports = router