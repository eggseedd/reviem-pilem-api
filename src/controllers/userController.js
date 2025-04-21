const { getUserProfile, updateUserProfile } = require("../models/User")
const { getUserList } = require("../models/UserFilmList")

const viewUserProfileController = async (req, res) => {
    const { userId } = req.params

    try {
        const profile = await getUserProfile(userId)
        if (!profile) {
            return res.status(404).json({ message: "User not found" })
        }

        const filmList = await getUserList(userId)
        if (!filmList) {
            filmList = []
        }
        res.status(200).json({ profile, filmList })
    } catch (err) {
        console.error("Error fetching user profile:", err)
        res.status(500).json({ message: "Internal server error" })
    }
}

const updateUserProfileController = async (req, res) => {
    const userId = req.user.id
    const { display_name, bio } = req.body

    if (!display_name && !bio) {
        return res.status(400).json({ message: "Please provide at least one field to update (display_name or bio)" })
    }

    try {
        const updated = await updateUserProfile(userId, { display_name, bio })
        if (!updated) {
            return res.status(404).json({ message: "User not found" })
        }

        res.status(200).json({ message: "Profile updated successfully" })
    } catch (err) {
        console.error("Error updating user profile:", err)
        res.status(500).json({ message: "Internal server error" })
    }
}

module.exports = { viewUserProfileController, updateUserProfileController }