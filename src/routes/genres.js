const express = require("express")
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware")
const { getAllGenresController, addGenreController, updateGenreController } = require("../controllers/genresController")
const router = express.Router()

router.get("/allGenres", getAllGenresController)

router.post("/addGenre", authenticateToken, authorizeRoles("admin"), addGenreController)

router.patch("/updateGenre", authenticateToken, authorizeRoles("admin"), updateGenreController)

module.exports = router