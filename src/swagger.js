const swaggerJsDoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Reviem Pilem API",
            version: "1.0.0",
            description: "API documentation for Reviem Pilem",
        },
        servers: [
            {
                url: "http://localhost:8080",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ["./src/routes/*.js"],
}

const swaggerDocs = swaggerJsDoc(swaggerOptions)

module.exports = { swaggerUi, swaggerDocs }