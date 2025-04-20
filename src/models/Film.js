const { poolPromise } = require("../config/db")

const getAllFilms = async () => {
    const pool = await poolPromise
    const result = await pool.request().query(`
        SELECT 
            f.id AS film_id, 
            f.title, 
            f.synopsis, 
            f.status, 
            f.total_episodes, 
            f.release_date, 
            g.id AS genre_id, 
            g.name AS genre_name
        FROM films f
        LEFT JOIN films_genres fg ON f.id = fg.films_id
        LEFT JOIN genres g ON fg.genres_id = g.id
    `)

    const films = result.recordset.reduce((acc, row) => {
        const film = acc.find(f => f.id === row.film_id)
        if (film) {
            film.genres.push({ id: row.genre_id, name: row.genre_name })
        } else {
            acc.push({
                id: row.film_id,
                title: row.title,
                synopsis: row.synopsis,
                status: row.status,
                total_episodes: row.total_episodes,
                release_date: row.release_date,
                genres: row.genre_id ? [{ id: row.genre_id, name: row.genre_name }] : []
            })
        }
        return acc
    }, [])

    return films
}

const getFilmById = async (id) => {
    const pool = await poolPromise
    const result = await pool.request()
        .input("id", id)
        .query(`
            SELECT 
                f.id AS film_id, 
                f.title, 
                f.synopsis, 
                f.status, 
                f.total_episodes, 
                f.release_date, 
                g.id AS genre_id, 
                g.name AS genre_name
            FROM films f
            LEFT JOIN films_genres fg ON f.id = fg.films_id
            LEFT JOIN genres g ON fg.genres_id = g.id
            WHERE f.id = @id
        `)

    if (result.recordset.length === 0) {
        return null
    }

    const film = result.recordset.reduce((acc, row) => {
        if (!acc.id) {
            acc = {
                id: row.film_id,
                title: row.title,
                synopsis: row.synopsis,
                status: row.status,
                total_episodes: row.total_episodes,
                release_date: row.release_date,
                genres: []
            }
        }
        if (row.genre_id) {
            acc.genres.push({ id: row.genre_id, name: row.genre_name })
        }
        return acc
    }, {})

    return film
}

const getFilmsByGenres = async (genreIds) => {
    const pool = await poolPromise

    const genrePlaceholders = genreIds.map((_, index) => `@genre${index}`).join(", ")
    const request = pool.request()

    genreIds.forEach((id, index) => {
        request.input(`genre${index}`, id)
    })

    const result = await request.query(`
        SELECT 
            f.id AS film_id, 
            f.title, 
            f.synopsis, 
            f.status, 
            f.total_episodes, 
            f.release_date, 
            g.id AS genre_id, 
            g.name AS genre_name
        FROM films f
        INNER JOIN films_genres fg ON f.id = fg.films_id
        INNER JOIN genres g ON fg.genres_id = g.id
        WHERE g.id IN (${genrePlaceholders})
        GROUP BY f.id, f.title, f.synopsis, f.status, f.total_episodes, f.release_date, g.id, g.name
    `)

    const films = result.recordset.reduce((acc, row) => {
        const film = acc.find(f => f.id === row.film_id)
        if (film) {
            film.genres.push({ id: row.genre_id, name: row.genre_name })
        } else {
            acc.push({
                id: row.film_id,
                title: row.title,
                synopsis: row.synopsis,
                status: row.status,
                total_episodes: row.total_episodes,
                release_date: row.release_date,
                genres: row.genre_id ? [{ id: row.genre_id, name: row.genre_name }] : []
            })
        }
        return acc
    }, [])

    return films
}

const addFilm = async (film) => {
    const { title, synopsis, status, total_episodes, release_date } = film
    const pool = await poolPromise
    await pool.request()
        .input("title", title)
        .input("synopsis", synopsis)
        .input("status", status)
        .input("total_episodes", total_episodes)
        .input("release_date", release_date)
        .query("INSERT INTO films (title, synopsis, status, total_episodes, release_date) VALUES (@title, @synopsis, @status, @total_episodes, @release_date)")
}

const updateFilm = async (film) => {
    const { id, title, synopsis, status, total_episodes, release_date } = film
    const pool = await poolPromise
    await pool.request()
    .input("title", title)
    .input("synopsis", synopsis)
    .input("status", status)
    .input("total_episodes", total_episodes)
    .input("release_date", release_date)
    .query
    .query("UPDATE films SET title = @title, synopsis = @synopsis, status = @status, total_episodes = @total_episodes, release_date = @release_date WHERE id = @id")
}

const deleteFilm = async (id) => {
    const pool = await poolPromise
    await pool.request()
        .input("id", id)
        .query("DELETE FROM film WHERE id = @id")
}

module.exports = { getAllFilms, getFilmById, getFilmsByGenres, addFilm, updateFilm, deleteFilm }