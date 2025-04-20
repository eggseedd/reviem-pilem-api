const { poolPromise } = require("../config/db")

const getAllGenres = async () => {
    const pool = await poolPromise
    const result = await pool.request().query("SELECT * FROM genres")
    return result.recordset
}

const getGenreByName = async (name) => {
    const pool = await poolPromise
    const result = await pool.request()
        .input("name", name)
        .query("SELECT id FROM genres WHERE name = @name")
    return result.recordset[0]?.id
}

const addGenre = async (genre) => {
    const { name } = genre
    const pool = await poolPromise
    const result = await pool.request()
        .input("name", name)
        .query("INSERT INTO genres (name) VALUES (@name)")
    return result.recordset[0].id
}

const updateGenre = async (id, name) => {
    const pool = await poolPromise
    const result = await pool.request()
        .input("id", id)
        .input("name", name)
        .query(`
            UPDATE genres
            SET name = @name
            WHERE id = @id
        `)

    return result.rowsAffected[0] > 0 // Return true if a row was updated
}

module.exports = { getAllGenres, getGenreByName, addGenre, updateGenre }