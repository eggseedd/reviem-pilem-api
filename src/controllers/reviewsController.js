const { addReview, updateReview, getReviewsByFilmId, reactToReview, isFilmInUserList, getFilmStatusInList } = require("../models/Review")

const addReviewController = async (req, res) => {
    const { filmId } = req.params
    const { rating, comment } = req.body
    const userId = req.user.id

    if (!rating || !comment) {
        return res.status(400).json({ message: "Please provide both rating and comment" })
    }

    try {
        const isInList = await isFilmInUserList(userId, filmId)
        if (!isInList) {
            return res.status(400).json({ message: "You can only review films that are in your list" })
        }

        const listStatus = await getFilmStatusInList(userId, filmId)
        if (listStatus === "plan_to_watch") {
            return res.status(400).json({ message: "You cannot review a film with the 'plan_to_watch' status" })
        }

        const filmStatus = await getFilmStatusInList(userId, filmId, true)
        if (filmStatus === "not_yet_aired") {
            return res.status(400).json({ message: "You cannot review a film that has not yet aired" })
        }

        await addReview({ userId, filmId, rating, comment })
        res.status(201).json({ message: "Review added successfully" })
    } catch (err) {
        console.error("Error adding review:", err)
        res.status(500).json({ message: "Internal server error" })
    }
}

const updateReviewController = async (req, res) => {
    const { reviewId } = req.params
    const { rating, comment } = req.body
    const userId = req.user.id

    if (!rating || !comment) {
        return res.status(400).json({ message: "Please provide both rating and comment" })
    }

    try {
        const updated = await updateReview({ reviewId, userId, rating, comment })
        if (!updated) {
            return res.status(404).json({ message: "Review not found or not authorized to update" })
        }

        res.status(200).json({ message: "Review updated successfully" })
    } catch (err) {
        console.error("Error updating review:", err)
        res.status(500).json({ message: "Internal server error" })
    }
}

const getReviewsByFilmIdController = async (req, res) => {
    const { filmId } = req.params

    try {
        const reviews = await getReviewsByFilmId(filmId)
        res.status(200).json(reviews)
    } catch (err) {
        console.error("Error fetching reviews:", err)
        res.status(500).json({ message: "Internal server error" })
    }
}

const reactToReviewController = async (req, res) => {
    const { reviewId } = req.params
    const { reaction } = req.body
    const userId = req.user.id

    if (!["like", "dislike"].includes(reaction)) {
        return res.status(400).json({ message: "Invalid reaction. Must be 'like' or 'dislike'" })
    }

    try {
        await reactToReview({ reviewId, userId, reaction })
        res.status(200).json({ message: `Review ${reaction}d successfully` })
    } catch (err) {
        console.error("Error reacting to review:", err)
        res.status(500).json({ message: "Internal server error" })
    }
}

const deleteReviewController = async (req, res) => {
    const { reviewId } = req.params
    const userId = req.user.id // Extract user ID from the authenticated token

    try {
        const deleted = await deleteReview(reviewId, userId)
        if (!deleted) {
            return res.status(404).json({ message: "Review not found or not authorized to delete" })
        }

        res.status(200).json({ message: "Review deleted successfully" })
    } catch (err) {
        console.error("Error deleting review:", err)
        res.status(500).json({ message: "Internal server error" })
    }
}

module.exports = { addReviewController, updateReviewController, getReviewsByFilmIdController, reactToReviewController, deleteReviewController }