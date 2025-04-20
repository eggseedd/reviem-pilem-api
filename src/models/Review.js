const { poolPromise } = require("../config/db")

const addReview = async ({ userId, filmId, rating, comment }) => {
    const pool = await poolPromise
    await pool.request()
        .input("userId", userId)
        .input("filmId", filmId)
        .input("rating", rating)
        .input("comment", comment)
        .query(`
            INSERT INTO reviews (users_id, films_id, rating, comment, created_at, updated_at)
            VALUES (@userId, @filmId, @rating, @comment, GETDATE(), GETDATE())
        `)
}

const updateReview = async ({ reviewId, userId, rating, comment }) => {
    const pool = await poolPromise
    const result = await pool.request()
        .input("reviewId", reviewId)
        .input("userId", userId)
        .input("rating", rating)
        .input("comment", comment)
        .query(`
            UPDATE reviews
            SET rating = @rating, comment = @comment, updated_at = GETDATE()
            WHERE id = @reviewId AND users_id = @userId
        `)

    return result.rowsAffected[0] > 0
}

const isFilmInUserList = async (userId, filmId) => {
    const pool = await poolPromise
    const result = await pool.request()
        .input("userId", userId)
        .input("filmId", filmId)
        .query(`
            SELECT 1 FROM user_film_list
            WHERE users_id = @userId AND films_id = @filmId
        `)

    return result.recordset.length > 0
}

const getFilmStatusInList = async (userId, filmId, checkGlobalStatus = false) => {
    const pool = await poolPromise

    if (checkGlobalStatus) {
        const result = await pool.request()
            .input("filmId", filmId)
            .query(`
                SELECT status FROM films
                WHERE id = @filmId
            `)

        return result.recordset[0]?.status
    } else {
        const result = await pool.request()
            .input("userId", userId)
            .input("filmId", filmId)
            .query(`
                SELECT list_type FROM user_film_list
                WHERE users_id = @userId AND films_id = @filmId
            `)

        return result.recordset[0]?.list_type
    }
}

const getReviewsByFilmId = async (filmId) => {
    const pool = await poolPromise
    const result = await pool.request()
        .input("filmId", filmId)
        .query(`
            SELECT 
                r.id AS review_id,
                r.rating,
                r.comment,
                r.created_at,
                r.updated_at,
                u.id AS user_id,
                u.username,
                u.display_name
            FROM reviews r
            INNER JOIN users u ON r.users_id = u.id
            WHERE r.films_id = @filmId
        `)

    return result.recordset
}

const reactToReview = async ({ reviewId, userId, reaction }) => {
    const pool = await poolPromise

    const existingReaction = await pool.request()
        .input("reviewId", reviewId)
        .input("userId", userId)
        .query(`
            SELECT reaction FROM review_reactions
            WHERE reviews_id = @reviewId AND users_id = @userId
        `)

    if (existingReaction.recordset.length > 0) {
        await pool.request()
            .input("reviewId", reviewId)
            .input("userId", userId)
            .input("reaction", reaction)
            .query(`
                UPDATE review_reactions
                SET reaction = @reaction, updated_at = GETDATE()
                WHERE reviews_id = @reviewId AND users_id = @userId
            `)
    } else {
        await pool.request()
            .input("reviewId", reviewId)
            .input("userId", userId)
            .input("reaction", reaction)
            .query(`
                INSERT INTO review_reactions (reviews_id, users_id, reaction, updated_at)
                VALUES (@reviewId, @userId, @reaction, GETDATE())
            `)
    }
}

module.exports = { addReview, updateReview, getReviewsByFilmId, reactToReview, isFilmInUserList, getFilmStatusInList }