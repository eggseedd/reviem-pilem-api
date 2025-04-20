const { addToList, getFilmStatus, updateListStatus, getUserList } = require("../models/UserFilmList")

const addToListController = async (req, res) => {
    const { filmId } = req.params
    const { list_type } = req.body
    const userId = req.user.id

    if (!["plan_to_watch", "watching", "completed", "on_hold", "dropped"].includes(list_type)) {
        return res.status(400).json({ message: "Invalid list type" })
    }

    try {
        const filmStatus = await getFilmStatus(filmId)
        if (filmStatus === "not_yet_aired" && list_type !== "plan_to_watch") {
            return res.status(400).json({ message: "Films not yet aired can only be added as 'plan_to_watch'" })
        }

        await addToList({ userId, filmId, list_type })
        res.status(201).json({ message: "Film added to list successfully" })
    } catch (err) {
        console.error("Error adding film to list:", err)
        res.status(500).json({ message: "Internal server error" })
    }
}

const updateListStatusController = async (req, res) => {
    const { filmId } = req.params
    const { list_type } = req.body
    const userId = req.user.id

    if (!["plan_to_watch", "watching", "completed", "on_hold", "dropped"].includes(list_type)) {
        return res.status(400).json({ message: "Invalid list type" })
    }

    try {
        const updated = await updateListStatus({ userId, filmId, list_type })
        if (!updated) {
            return res.status(404).json({ message: "Film not found in the user's list" })
        }

        res.status(200).json({ message: "List status updated successfully" })
    } catch (err) {
        console.error("Error updating list status:", err)
        res.status(500).json({ message: "Internal server error" })
    }
}

const getUserListController = async (req, res) => {
    const { userId } = req.params

    try {
        const list = await getUserList(userId)
        res.status(200).json(list)
    } catch (err) {
        console.error("Error fetching user list:", err)
        res.status(500).json({ message: "Internal server error" })
    }
}

module.exports = { addToListController, updateListStatusController, getUserListController }