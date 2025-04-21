const express = require("express")
const multer = require("multer")
const upload = multer()
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware")
const { getAllFilmsController, getFilmByIdController, getFilmsByGenreController, addFilmController, updateFilmController, deleteFilmController, searchFilmsByTitleController } = require("../controllers/filmsController")
const router = express.Router()

/**
 * @swagger
 * /films/allFilmsByGenre/{genre}:
 *   get:
 *     summary: Get all films by genre
 *     tags:
 *       - Films
 *     parameters:
 *       - in: path
 *         name: genre
 *         required: true
 *         schema:
 *           type: string
 *           example: Action
 *         description: The genre of the films
 *     responses:
 *       200:
 *         description: A list of films for the specified genre
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
 *                   title:
 *                     type: string
 *                     example: Inception
 *                   synopsis:
 *                     type: string
 *                     example: A mind-bending thriller.
 *       404:
 *         description: No films found for the specified genre
 *       500:
 *         description: Internal server error
 */
router.get("/allFilmsByGenre/:genre", getFilmsByGenreController)

/**
 * @swagger
 * /films/allFilms:
 *   get:
 *     summary: Get all films
 *     tags:
 *       - Films
 *     responses:
 *       200:
 *         description: A list of all films
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
 *                   title:
 *                     type: string
 *                     example: Inception
 *                   synopsis:
 *                     type: string
 *                     example: A mind-bending thriller.
 *       500:
 *         description: Internal server error
 */
router.get("/allFilms", getAllFilmsController)

/**
 * @swagger
 * /films/filmById/{id}:
 *   get:
 *     summary: Get a film by ID
 *     tags:
 *       - Films
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: The ID of the film
 *     responses:
 *       200:
 *         description: The film details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 title:
 *                   type: string
 *                   example: Inception
 *                 synopsis:
 *                   type: string
 *                   example: A mind-bending thriller.
 *       404:
 *         description: Film not found
 *       500:
 *         description: Internal server error
 */
router.get("/filmById/:id", getFilmByIdController)

/**
 * @swagger
 * /films/search:
 *   get:
 *     summary: Search films by title
 *     tags:
 *       - Films
 *     parameters:
 *       - in: query
 *         name: title
 *         required: true
 *         schema:
 *           type: string
 *           example: Inception
 *         description: The title of the film to search for
 *     responses:
 *       200:
 *         description: A list of films matching the title
 *       400:
 *         description: Missing title query parameter
 *       500:
 *         description: Internal server error
 */
router.get("/search", searchFilmsByTitleController);

/**
 * @swagger
 * /films/addFilm:
 *   post:
 *     summary: Add a new film
 *     tags:
 *       - Films
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Inception
 *               synopsis:
 *                 type: string
 *                 example: A mind-bending thriller.
 *               status:
 *                 type: string
 *                 example: finished_airing
 *               total_episodes:
 *                 type: integer
 *                 example: 1
 *               release_date:
 *                 type: string
 *                 format: date
 *                 example: 2010-07-16
 *               genres:
 *                 type: string
 *                 example: ["Action", "Sci-Fi"]
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Film added successfully
 *       400:
 *         description: Bad request (e.g., invalid input)
 *       500:
 *         description: Internal server error
 */
router.post("/addFilm", authenticateToken, authorizeRoles("admin"), upload.array('images'), addFilmController)

/**
 * @swagger
 * /films/updateFilm:
 *   patch:
 *     summary: Update an existing film
 *     tags:
 *       - Films
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *               title:
 *                 type: string
 *                 example: Inception
 *               synopsis:
 *                 type: string
 *                 example: A mind-bending thriller.
 *               status:
 *                 type: string
 *                 example: finished_airing
 *               total_episodes:
 *                 type: integer
 *                 example: 1
 *               release_date:
 *                 type: string
 *                 format: date
 *                 example: 2010-07-16
 *               genres:
 *                 type: string
 *                 example: ["Action", "Sci-Fi"]
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Film updated successfully
 *       400:
 *         description: Bad request (e.g., invalid input)
 *       404:
 *         description: Film not found
 *       500:
 *         description: Internal server error
 */
router.patch("/updateFilm", authenticateToken, authorizeRoles("admin"), upload.array('images'), updateFilmController)

/**
 * @swagger
 * /films/deleteFilm/{id}:
 *   delete:
 *     summary: Delete a film by ID
 *     tags:
 *       - Films
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: The ID of the film to delete
 *     responses:
 *       200:
 *         description: Film deleted successfully
 *       404:
 *         description: Film not found
 *       500:
 *         description: Internal server error
 */
router.delete("/deleteFilm/:id", authenticateToken, authorizeRoles("admin"), deleteFilmController)

module.exports = router