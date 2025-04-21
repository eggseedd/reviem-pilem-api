const express = require("express")
const { registerUser, loginUser } = require("../controllers/authController");
const router = express.Router()

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: john_doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: securepassword123
 *               display_name:
 *                 type: string
 *                 example: John Doe
 *               bio:
 *                 type: string
 *                 example: Movie enthusiast
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *       400:
 *         description: Bad request (e.g., missing fields or invalid input)
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
router.post("/register", registerUser)

/**
 * @swagger
 * /auth/login:
 *   get:
 *     summary: Log in a user
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: query
 *         name: username
 *         schema:
 *           type: string
 *           example: john_doe
 *         required: true
 *         description: The user's username
 *       - in: query
 *         name: password
 *         schema:
 *           type: string
 *           example: securepassword123
 *         required: true
 *         description: The user's password
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
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
 *       401:
 *         description: Unauthorized (e.g., invalid username or password)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid username or password
 *       500:
 *         description: Internal server error
 */
router.get("/login", loginUser)

module.exports = router;