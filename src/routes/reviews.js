const express = require("express")
const { authenticateToken } = require("../middleware/authMiddleware")
const { addReviewController, updateReviewController, getReviewsByFilmIdController, reactToReviewController } = require("../controllers/reviewsController")
const router = express.Router()

router.post("/:filmId", authenticateToken, addReviewController)

router.patch("/:reviewId", authenticateToken, updateReviewController)

router.get("/:filmId", getReviewsByFilmIdController)

router.post("/reaction/:reviewId", authenticateToken, reactToReviewController)

module.exports = router