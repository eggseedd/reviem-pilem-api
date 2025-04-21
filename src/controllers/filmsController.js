const { ggetAllFilms, getFilmById, getFilmsByGenre, addFilm, updateFilm, deleteFilm, addFilmImages, searchFilmsByTitle, deleteFilmImages } = require("../models/Film")
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
        const films = await getFilmsByGenre(genre)
        if (films.length === 0) {
            return res.status(404).json({ message: "No films found for the specified genre" })
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
    let { title, synopsis, status, total_episodes, release_date, genres } = req.body
    const images = req.files

    if (typeof genres === "string") {
        try {
            genres = JSON.parse(genres)
        } catch (err) {
            return res.status(400).json({ message: "Genres must be a valid JSON array" })
        }
    }

    try {
        const filmId = await addFilm({ title, synopsis, status, total_episodes, release_date })

        for (const genreName of genres) {
            let genreId = await getGenreByName(genreName)
            if (!genreId) {
                genreId = await addGenre(genreName)
            }
            await addFilmGenre(filmId, genreId)
        }

        await addFilmImages(filmId, images)


        res.status(201).json({ message: "Film added successfully" })
    } catch (err) {
        console.error("Error adding film:", err)
        res.status(500).json({ message: "Internal server error" })
    }
}

const updateFilmController = async (req, res) => {
    let { id, title, synopsis, status, total_episodes, release_date, genres } = req.body
    const images = req.files

    if (typeof genres === "string") {
        try {
            genres = JSON.parse(genres)
        } catch (err) {
            return res.status(400).json({ message: "Genres must be a valid JSON array" })
        }
    }

    if (!id || !title || !synopsis || !status || !total_episodes || !release_date || !genres || !Array.isArray(genres)) {
        return res.status(400).json({ message: "Please fill all fields, provide genres as an array of names, and include the film ID" })
    }

    try {
        const film = await getFilmById(id)
        if (!film) {
            return res.status(404).json({ message: "Film not found" })
        }

        await updateFilm({ id, title, synopsis, status, total_episodes, release_date })

        await deleteFilmGenres(id)
        for (const genreName of genres) {
            let genreId = await getGenreByName(genreName)
            if (!genreId) {
                genreId = await addGenre(genreName)
            }
            await addFilmGenre(id, genreId) 
        }

        if (images && images.length > 0) {
            await deleteFilmImages(id)
            await addFilmImages(id, images)
        }

        res.status(200).json({ message: "Film updated successfully" })
    } catch (err) {
        console.error("Error updating film:", err)
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