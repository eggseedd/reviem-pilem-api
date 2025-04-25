const { getAllGenres, addGenre, updateGenre } = require("../models/Genre")

const getAllGenresController = async (req, res) => {
    try {
        const genres = await getAllGenres()
        res.status(200).json(genres)
    } catch (err) {
        console.error("Error fetching genres:", err)
        res.status(500).json({ message: "Internal server error" })
    }
}

const addGenreController = async (req, res) => {
    const { name } = req.body

    if (!name) {
        return res.status(400).json({ message: "Please fill all fields" })
    }

    try {
        await addGenre({ name })
        res.status(201).json({ message: "Genre added successfully" })
    } catch (err) {
        console.error("Database error:", err)
        res.status(500).json({ message: "Internal server error" })
    }
}

const updateGenreController = async (req, res) => {
    const { id, name } = req.body

    if (!id || !name) {
        return res.status(400).json({ message: "Please provide both id and name" })
    }

    try {
        const updated = await updateGenre(id, name)
        if (!updated) {
            return res.status(404).json({ message: "Genre not found" })
        }

        res.status(200).json({ message: "Genre updated successfully" })
    } catch (err) {
        console.error("Error updating genre:", err)
        res.status(500).json({ message: "Internal server error" })
    }
}

module.exports = { getAllGenresController, addGenreController, updateGenreController }