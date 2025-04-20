const express = require("express")
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware")
const { getAllFilmsController, getFilmByIdController, getFilmsByGenreController, addFilmController, updateFilmController, deleteFilmController, searchFilmsByTitleController } = require("../controllers/filmsController")
const router = express.Router()

router.get("/allFilmsByGenre/:genre", getFilmsByGenreController)

router.get("/allFilms", getAllFilmsController)

router.get("/filmById/:id", getFilmByIdController)

router.get("/search", searchFilmsByTitleController);

router.post("/addFilm", authenticateToken, authorizeRoles("admin"), addFilmController)

router.patch("/updateFilm", authenticateToken, authorizeRoles("admin"), updateFilmController)

router.delete("/deleteFilm/:id", authenticateToken, authorizeRoles("admin"), deleteFilmController)

module.exports = router