const { poolPromise } = require("../config/db")

const findUserByUsernameOrEmail = async (username, email) => {
    const pool = await poolPromise
    const result = await pool.request()
        .input("username", username)
        .input("email", email)
        .query("SELECT * FROM users WHERE username = @username OR email = @email")
    return result.recordset
}

const findUserByUsername = async (username) => {
    const pool = await poolPromise
    const result = await pool.request()
        .input("username", username)
        .query("SELECT * FROM users WHERE username = @username")
    return result.recordset[0]
}

const createUser = async (user) => {
    const { username, email, password, display_name, bio, created_at } = user
    const pool = await poolPromise
    await pool.request()
        .input("username", username)
        .input("email", email)
        .input("password", password)
        .input("display_name", display_name)
        .input("bio", bio)
        .input("created_at", created_at)
        .query("INSERT INTO users (username, email, password, display_name, bio, created_at) VALUES (@username, @email, @password, @display_name, @bio, @created_at)")
}

const getUserProfile = async (userId) => {
    const pool = await poolPromise
    const result = await pool.request()
        .input("userId", userId)
        .query(`
            SELECT id, username, display_name, bio
            FROM users
            WHERE id = @userId
        `)

    return result.recordset[0]
}

const updateUserProfile = async (userId, { display_name, bio }) => {
    const pool = await poolPromise
    const result = await pool.request()
        .input("userId", userId)
        .input("display_name", display_name || null)
        .input("bio", bio || null)
        .query(`
            UPDATE users
            SET display_name = COALESCE(@display_name, display_name),
                bio = COALESCE(@bio, bio)
            WHERE id = @userId
        `)

    return result.rowsAffected[0] > 0
}

module.exports = { findUserByUsernameOrEmail, findUserByUsername, createUser, getUserProfile, updateUserProfile }