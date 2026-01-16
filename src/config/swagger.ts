import swaggerJsDoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Siga Prime API",
            version: "1.0.0",
            description: "API de gerenciamento de preceptoria e alunos",
        },
        servers: [
            {
                url: "http://localhost:3003",
                description: "Servidor Local",
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
            } as Record<string, any[]>,
        ],
    },
    apis: ["./src/routes/*.ts", "./src/controller/*.ts"],
};

export const specs = swaggerJsDoc(options);
