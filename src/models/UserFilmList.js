const { poolPromise } = require("../config/db")

const addToList = async ({ userId, filmId, list_type }) => {
    const pool = await poolPromise
    await pool.request()
        .input("userId", userId)
        .input("filmId", filmId)
        .input("list_type", list_type)
        .query(`
            INSERT INTO user_film_list (users_id, films_id, list_type, updated_at)
            VALUES (@userId, @filmId, @list_type, GETDATE())
        `)
}

const getFilmStatus = async (filmId) => {
    const pool = await poolPromise
    const result = await pool.request()
        .input("filmId", filmId)
        .query(`
            SELECT status FROM films WHERE id = @filmId
        `)

    return result.recordset[0]?.status
}

const updateListStatus = async ({ userId, filmId, list_type }) => {
    const pool = await poolPromise
    const result = await pool.request()
        .input("userId", userId)
        .input("filmId", filmId)
        .input("list_type", list_type)
        .query(`
            UPDATE user_film_list
            SET list_type = @list_type, updated_at = GETDATE()
            WHERE users_id = @userId AND films_id = @filmId
        `)

    return result.rowsAffected[0] > 0
}

const getUserList = async (userId) => {
    const pool = await poolPromise
    const result = await pool.request()
        .input("userId", userId)
        .query(`
            SELECT 
                ufl.films_id,
                f.title,
                f.status AS film_status,
                ufl.list_type,
                ufl.updated_at
            FROM user_film_list ufl
            INNER JOIN films f ON ufl.films_id = f.id
            WHERE ufl.users_id = @userId
        `)

    return result.recordset
}

module.exports = { addToList, getFilmStatus, updateListStatus, getUserList }