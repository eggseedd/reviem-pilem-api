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
            g.name AS genre_name,
            ISNULL(AVG(r.rating), 0) AS average_rating
        FROM films f
        LEFT JOIN films_genres fg ON f.id = fg.films_id
        LEFT JOIN genres g ON fg.genres_id = g.id
        LEFT JOIN reviews r ON f.id = r.films_id
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
                average_rating: parseFloat(row.average_rating.toFixed(2)),
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
                g.name AS genre_name,
                ISNULL(AVG(r.rating), 0) AS average_rating
            FROM films f
            LEFT JOIN films_genres fg ON f.id = fg.films_id
            LEFT JOIN genres g ON fg.genres_id = g.id
            LEFT JOIN reviews r ON f.id = r.films_id
            WHERE f.id = @id
            GROUP BY f.id, f.title, f.synopsis, f.status, f.total_episodes, f.release_date, g.id, g.name
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
                average_rating: parseFloat(row.average_rating.toFixed(2)),
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

const getFilmsByGenre = async (genreName) => {
    const pool = await poolPromise
    const result = await pool.request()
        .input("genreName", genreName)
        .query(`
            SELECT 
                f.id AS film_id, 
                f.title, 
                f.synopsis, 
                f.status, 
                f.total_episodes, 
                f.release_date, 
                ISNULL(AVG(r.rating), 0) AS average_rating
            FROM films f
            INNER JOIN films_genres fg ON f.id = fg.films_id
            INNER JOIN genres g ON fg.genres_id = g.id
            LEFT JOIN reviews r ON f.id = r.films_id
            WHERE g.name = @genreName
            GROUP BY f.id, f.title, f.synopsis, f.status, f.total_episodes, f.release_date
        `)

    return result.recordset.map(row => ({
        id: row.film_id,
        title: row.title,
        synopsis: row.synopsis,
        status: row.status,
        total_episodes: row.total_episodes,
        release_date: row.release_date,
        average_rating: parseFloat(row.average_rating.toFixed(2))
    }))
}

const searchFilmsByTitle = async (title) => {
    const pool = await poolPromise
    const result = await pool.request()
        .input("title", `%${title}%`)
        .query(`
            SELECT 
                f.id AS film_id, 
                f.title, 
                f.synopsis, 
                f.status, 
                f.total_episodes, 
                f.release_date, 
                ISNULL(AVG(r.rating), 0) AS average_rating
            FROM films f
            LEFT JOIN reviews r ON f.id = r.films_id
            WHERE f.title LIKE @title
            GROUP BY f.id, f.title, f.synopsis, f.status, f.total_episodes, f.release_date
        `)

    return result.recordset.map(row => ({
        id: row.film_id,
        title: row.title,
        synopsis: row.synopsis,
        status: row.status,
        total_episodes: row.total_episodes,
        release_date: row.release_date,
        average_rating: parseFloat(row.average_rating.toFixed(2)) 
    }))
}

const addFilm = async (film) => {
    const { title, synopsis, status, total_episodes, release_date } = film
    const pool = await poolPromise
    const result = await pool.request()
        .input("title", title)
        .input("synopsis", synopsis)
        .input("status", status)
        .input("total_episodes", total_episodes)
        .input("release_date", release_date)
        .query(`
            INSERT INTO films (title, synopsis, status, total_episodes, release_date)
            OUTPUT INSERTED.id
            VALUES (@title, @synopsis, @status, @total_episodes, @release_date)
        `)

    return result.recordset[0].id
}

const addFilmImages = async (filmId, images) => {
    const pool = await poolPromise

    for (const image of images) {
        if (!image.buffer) {
            throw new Error("Invalid image file")
        }

        await pool.request()
            .input("filmId", filmId)
            .input("img", image.buffer)
            .query(`
                INSERT INTO images (films_id, img)
                VALUES (@filmId, CONVERT(varbinary(max), @img))
            `)
    }
}

const updateFilm = async (film) => {
    const { id, title, synopsis, status, total_episodes, release_date } = film
    const pool = await poolPromise
    await pool.request()
    .input("id", id)
    .input("title", title)
    .input("synopsis", synopsis)
    .input("status", status)
    .input("total_episodes", total_episodes)
    .input("release_date", release_date)
    .query("UPDATE films SET title = @title, synopsis = @synopsis, status = @status, total_episodes = @total_episodes, release_date = @release_date WHERE id = @id")
}

const deleteFilmImages = async (filmId) => {
    const pool = await poolPromise
    await pool.request()
        .input("filmId", filmId)
        .query(`DELETE FROM images WHERE films_id = @filmId`)
}

const deleteFilm = async (id) => {
    const pool = await poolPromise;

    await pool.request()
        .input("filmId", id)
        .query("DELETE FROM films_genres WHERE films_id = @filmId");

    await pool.request()
        .input("filmId", id)
        .query("DELETE FROM images WHERE films_id = @filmId");

    await pool.request()
        .input("id", id)
        .query("DELETE FROM films WHERE id = @id");
}

module.exports = { getAllFilms, getFilmById, getFilmsByGenre, addFilm, updateFilm, deleteFilm, addFilmImages, deleteFilmImages, searchFilmsByTitle }