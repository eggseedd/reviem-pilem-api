const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const bcrypt = require('bcryptjs')
const { findUserByUsernameOrEmail, findUserByUsername, createUser } = require("../models/User")

dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET

const registerUser = async (req, res) => {
    const { username, email, password, display_name, bio } = req.body

    if (!username || !email || !password || !display_name || !bio) {
        return res.status(400).json({ message: "Please fill all fields" })
    }

    if (password.length < 8) {
        return res.status(400).json({ message: "Password must have at least 8 characters" })
    }

    try {
        const existingUser = await findUserByUsernameOrEmail(username, email)
        if (existingUser.length > 0) {
            return res.status(400).json({ message: "Email or username already in use" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = {
            username,
            email,
            password: hashedPassword,
            display_name,
            bio,
            created_at: new Date(),
        }

        await createUser(newUser)
        res.status(201).json({ message: "User registered successfully" })
    } catch (err) {
        console.error("Database error:", err)
        res.status(500).json({ message: "Internal server error" })
    }
}

const loginUser = async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).json({ message: "Please fill all fields" })
    }

    try {
        const user = await findUserByUsername(username)
        if (!user) {
            return res.status(401).json({ message: "Invalid username or password" })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid username or password" })
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: "1h" }
          )

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                username: user.username,
                display_name: user.display_name,
            },
        })
    } catch (err) {
        console.error("Database error:", err)
        res.status(500).json({ message: "Internal server error" })
    }
}

module.exports = { registerUser, loginUser }