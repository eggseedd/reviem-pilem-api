const express = require("express")
const { authenticateToken } = require("../middleware/authMiddleware")
const { addReviewController, updateReviewController, getReviewsByFilmIdController, reactToReviewController, deleteReviewController } = require("../controllers/reviewsController")
const router = express.Router()

/**
 * @swagger
 * /reviews/{filmId}:
 *   post:
 *     summary: Add a review for a film
 *     tags:
 *       - Reviews
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: filmId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: The ID of the film to review
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 example: 8
 *               comment:
 *                 type: string
 *                 example: "Great movie!"
 *     responses:
 *       201:
 *         description: Review added successfully
 *       400:
 *         description: Bad request (e.g., missing fields or invalid conditions)
 *       500:
 *         description: Internal server error
 */
router.post("/:filmId", authenticateToken, addReviewController)

/**
 * @swagger
 * /reviews/{reviewId}:
 *   patch:
 *     summary: Update a review
 *     tags:
 *       - Reviews
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: The ID of the review to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 example: 9
 *               comment:
 *                 type: string
 *                 example: "Updated review comment"
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       400:
 *         description: Bad request (e.g., missing fields)
 *       404:
 *         description: Review not found or not authorized to update
 *       500:
 *         description: Internal server error
 */
router.patch("/:reviewId", authenticateToken, updateReviewController)

/**
 * @swagger
 * /reviews/{filmId}:
 *   get:
 *     summary: Get all reviews for a film
 *     tags:
 *       - Reviews
 *     parameters:
 *       - in: path
 *         name: filmId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: The ID of the film to get reviews for
 *     responses:
 *       200:
 *         description: A list of reviews for the specified film
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   userId:
 *                     type: integer
 *                     example: 2
 *                   rating:
 *                     type: integer
 *                     example: 8
 *                   comment:
 *                     type: string
 *                     example: "Great movie!"
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-04-22T10:00:00Z"
 *       500:
 *         description: Internal server error
 */
router.get("/:filmId", getReviewsByFilmIdController)

/**
 * @swagger
 * /reviews/reaction/{reviewId}:
 *   post:
 *     summary: React to a review
 *     tags:
 *       - Reviews
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: The ID of the review to react to
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reaction:
 *                 type: string
 *                 enum: [like, dislike]
 *                 example: like
 *     responses:
 *       200:
 *         description: Reaction added successfully
 *       400:
 *         description: Invalid reaction or bad request
 *       500:
 *         description: Internal server error
 */
router.post("/reaction/:reviewId", authenticateToken, reactToReviewController)

/**
 * @swagger
 * /reviews/{reviewId}:
 *   delete:
 *     summary: Delete a review
 *     tags:
 *       - Reviews
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: The ID of the review to delete
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       404:
 *         description: Review not found or not authorized to delete
 *       500:
 *         description: Internal server error
 */
router.delete("/:reviewId", authenticateToken, deleteReviewController)

module.exports = router