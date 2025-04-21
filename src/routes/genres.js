const express = require("express")
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware")
const { getAllGenresController, addGenreController, updateGenreController } = require("../controllers/genresController")
const router = express.Router()

/**
 * @swagger
 * /genres/allGenres:
 *   get:
 *     summary: Get all genres
 *     tags:
 *       - Genres
 *     responses:
 *       200:
 *         description: A list of all genres
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
 *                   name:
 *                     type: string
 *                     example: Action
 *       500:
 *         description: Internal server error
 */
router.get("/allGenres", getAllGenresController)

/**
 * @swagger
 * /genres/addGenre:
 *   post:
 *     summary: Add a new genre
 *     tags:
 *       - Genres
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Action
 *     responses:
 *       201:
 *         description: Genre added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Genre added successfully
 *       400:
 *         description: Bad request (e.g., missing fields)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Please fill all fields
 *       500:
 *         description: Internal server error
 */
router.post("/addGenre", authenticateToken, authorizeRoles("admin"), addGenreController)

/**
 * @swagger
 * /genres/updateGenre:
 *   patch:
 *     summary: Update an existing genre
 *     tags:
 *       - Genres
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *               name:
 *                 type: string
 *                 example: Adventure
 *     responses:
 *       200:
 *         description: Genre updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Genre updated successfully
 *       400:
 *         description: Bad request (e.g., missing fields)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Please provide both id and name
 *       404:
 *         description: Genre not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Genre not found
 *       500:
 *         description: Internal server error
 */
router.patch("/updateGenre", authenticateToken, authorizeRoles("admin"), updateGenreController)

module.exports = router