const { getAllFilms, getFilmById, addFilm, deleteFilm, addFilmImages, updateFilmImages } = require("../models/Film")
const { getGenreByName, addGenre } = require("../models/Genre")
const { addFilmGenre, deleteFilmGenres } = require("../models/FilmGenre")

const getAllFilmsController = async (req, res) => {
    try {
        const films = await getAllFilms()
        res.status(200).json(films)
    } catch (err) {
        console.error("Error fetching films:", err)
        res.status(500).json({ message: "Internal server error" })
    }
}

const getFilmByIdController = async (req, res) => {
    const filmId = req.params.id

    try {
        const film = await getFilmById(filmId)
        if (!film) {
            return res.status(404).json({ message: "Film not found" })
        }
        res.status(200).json(film)
    } catch (err) {
        console.error("Error fetching film:", err)
        res.status(500).json({ message: "Internal server error" })
    }
}

const getFilmsByGenreController = async (req, res) => {
    const { genre } = req.params

    try {
        let films
        if (genre) {
            const genreIds = genre.split(",").map(id => parseInt(id.trim()))
            films = await getFilmsByGenres(genreIds)
        } else {
            films = await getAllFilms()
        }

        res.status(200).json(films)
    } catch (err) {
        console.error("Error fetching films by genre:", err)
        res.status(500).json({ message: "Internal server error" })
    }
}

const searchFilmsByTitleController = async (req, res) => {
    const { title } = req.query

    if (!title) {
        return res.status(400).json({ message: "Please provide a title to search for" })
    }

    try {
        const films = await searchFilmsByTitle(title)
        res.status(200).json(films)
    } catch (err) {
        console.error("Error searching films by title:", err)
        res.status(500).json({ message: "Internal server error" })
    }
}

const addFilmController = async (req, res) => {
    const { title, synopsis, status, total_episodes, release_date, genres } = req.body
    const images = req.files

    if (!title || !synopsis || !status || !total_episodes || !release_date || !genres || !Array.isArray(genres) || !images) {
        return res.status(400).json({ message: "Please fill all fields, provide genres as an array of names, and images" })
    }

    try {
        const filmId = await addFilm({ title, synopsis, status, total_episodes, release_date })

        await addFilmImages(filmId, images)

        for (const genreName of genres) {
            const genreId = await getGenreByName(genreName)
            if (!genreId) {
                genreId = await addGenre(genreName)
            }
            await addFilmGenre(filmId, genreId)
        }

        await addFilmImages(filmId, images)

        res.status(201).json({ message: "Film added successfully" })
    } catch (err) {
        console.error("Database error:", err)
        res.status(500).json({ message: "Internal server error" })
    }
}

const updateFilmController = async (req, res) => {
    const { id, title, synopsis, status, total_episodes, release_date, genres } = req.body
    const images = req.files

    if (!title || !synopsis || !status || !total_episodes || !release_date || !Array.isArray(genres) || !images) {
        return res.status(400).json({ message: "Please fill all fields, provide genres as an array of names, and images" })
    }

    try {
        const film = await getFilmById(id)
        if (!film) {
            return res.status(404).json({ message: "Film not found" })
        }

        await updateFilm({ id, title, synopsis, status, total_episodes, release_date })

        await deleteFilmGenres(id)
        for (const genreName of genres) {
            const genreId = await getGenreByName(genreName)
            if (!genreId) {
                genreId = await addGenre(genreName)
            }
            await addFilmGenre(id, genreId)
        }

        if (images) {
            await updateFilmImages(filmId, images)
        }

        res.status(200).json({ message: "Film updated successfully" })
    } catch (err) {
        console.error("Database error:", err)
        res.status(500).json({ message: "Internal server error" })
    }
}

const deleteFilmController = async (req, res) => {
    const filmId = req.params.id

    try {
        const film = await getFilmById(filmId)
        if (!film) {
            return res.status(404).json({ message: "Film not found" })
        }
        await deleteFilm(filmId)
        res.status(200).json({ message: "Film deleted successfully" })
    } catch (err) {
        console.error("Database error:", err)
        res.status(500).json({ message: "Internal server error" })
    }
}

module.exports = { getAllFilmsController, getFilmByIdController, getFilmsByGenreController, addFilmController, updateFilmController, deleteFilmController, searchFilmsByTitleController }