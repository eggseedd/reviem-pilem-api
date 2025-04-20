const jwt = require('jsonwebtoken')
require('dotenv').config()

const JWT_SECRET = process.env.JWT_SECRET

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' })
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token.' })
        }

        req.user = user
        next()
    })
}

const authorizeRoles = (...allowedRoles) => {
return (req, res, next) => {
    const userRole = req.user.role
    if (!allowedRoles.includes(userRole)) {
    return res.status(403).json({ message: "Access denied" })
    }
    next()
}
}

module.exports = { authenticateToken, authorizeRoles }
