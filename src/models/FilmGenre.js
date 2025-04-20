const { poolPromise } = require("../config/db")

const addFilmGenre = async (filmId, genreId) => {
    const pool = await poolPromise
    await pool.request()
        .input("filmId", filmId)
        .input("genreId", genreId)
        .query("INSERT INTO films_genres (films_id, genres_id) VALUES (@filmId, @genreId)")
}

const deleteFilmGenres = async (filmId) => {
    const pool = await poolPromise
    await pool.request()
        .input("filmId", filmId)
        .query("DELETE FROM films_genres WHERE films_id = @filmId")
}

const getGenresByFilmId = async (filmId) => {
    const pool = await poolPromise
    const result = await pool.request()
        .input("filmId", filmId)
        .query("SELECT g.id, g.name FROM genres g INNER JOIN films_genres fg ON g.id = fg.genres_id WHERE fg.films_id = @filmId")
    return result.recordset
}

module.exports = { addFilmGenre, deleteFilmGenres, getGenresByFilmId }