const express = require("express")
const { authenticateToken } = require("../middleware/authMiddleware")
const { addReviewController, updateReviewController, getReviewsByFilmIdController, reactToReviewController, deleteReviewController } = require("../controllers/reviewsController")
const router = express.Router()

router.post("/:filmId", authenticateToken, addReviewController)

router.patch("/:reviewId", authenticateToken, updateReviewController)

router.get("/:filmId", getReviewsByFilmIdController)

router.post("/reaction/:reviewId", authenticateToken, reactToReviewController)

router.delete("/:reviewId", authenticateToken, deleteReviewController)

module.exports = router