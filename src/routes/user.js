const express = require("express")
const { authenticateToken } = require("../middleware/authMiddleware")
const { addToListController, updateListStatusController, getUserListController } = require("../controllers/userListController")
const { viewUserProfileController, updateUserProfileController } = require("../controllers/userController")
const router = express.Router()

/**
 * @swagger
 * /user/list/{filmId}:
 *   post:
 *     summary: Add a film to the user's list
 *     tags:
 *       - User List
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: filmId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: The ID of the film to add to the user's list
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               list_type:
 *                 type: string
 *                 enum: [plan_to_watch, watching, completed, on_hold, dropped]
 *                 example: plan_to_watch
 *     responses:
 *       201:
 *         description: Film added to list successfully
 *       400:
 *         description: Invalid list type or other bad request
 *       500:
 *         description: Internal server error
 */
router.post("/list/:filmId", authenticateToken, addToListController)

/**
 * @swagger
 * /user/list/{filmId}:
 *   patch:
 *     summary: Update the status of a film in the user's list
 *     tags:
 *       - User List
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: filmId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: The ID of the film to update in the user's list
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               list_type:
 *                 type: string
 *                 enum: [plan_to_watch, watching, completed, on_hold, dropped]
 *                 example: completed
 *     responses:
 *       200:
 *         description: List status updated successfully
 *       400:
 *         description: Invalid list type or other bad request
 *       404:
 *         description: Film not found in the user's list
 *       500:
 *         description: Internal server error
 */
router.patch("/list/:filmId", authenticateToken, updateListStatusController)

/**
 * @swagger
 * /user/list/{userId}:
 *   get:
 *     summary: Get the user's film list
 *     tags:
 *       - User List
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: The ID of the user whose list is being fetched
 *     responses:
 *       200:
 *         description: A list of films in the user's list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   filmId:
 *                     type: integer
 *                     example: 1
 *                   title:
 *                     type: string
 *                     example: Inception
 *                   list_type:
 *                     type: string
 *                     example: completed
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-04-22T10:00:00Z"
 *       500:
 *         description: Internal server error
 */
router.get("/list/:userId", getUserListController)

/**
 * @swagger
 * /user/profile/{userId}:
 *   get:
 *     summary: View a user's profile
 *     tags:
 *       - User Profile
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: The ID of the user whose profile is being fetched
 *     responses:
 *       200:
 *         description: User profile and film list fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 profile:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     username:
 *                       type: string
 *                       example: john_doe
 *                     display_name:
 *                       type: string
 *                       example: John Doe
 *                     bio:
 *                       type: string
 *                       example: Movie enthusiast
 *                 filmList:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       filmId:
 *                         type: integer
 *                         example: 1
 *                       title:
 *                         type: string
 *                         example: Inception
 *                       list_type:
 *                         type: string
 *                         example: completed
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get("/profile/:userId", viewUserProfileController)

/**
 * @swagger
 * /user/profile/{userId}:
 *   patch:
 *     summary: Update the authenticated user's profile
 *     tags:
 *       - User Profile
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: The ID of the user whose profile is being updated
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               display_name:
 *                 type: string
 *                 example: John Doe
 *               bio:
 *                 type: string
 *                 example: Movie enthusiast
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Bad request (e.g., missing fields)
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.patch("/profile/:userId", authenticateToken, updateUserProfileController)

module.exports = router