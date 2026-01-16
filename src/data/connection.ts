import knex, { Knex } from 'knex';
import 'dotenv/config';

let connection: Knex | null = null;

function getConnection(): Knex {
    if (!connection) {
        // Validar variáveis de ambiente obrigatórias
        const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
        const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
        
        if (missingVars.length > 0) {
            throw new Error(
                `Variáveis de ambiente não configuradas: ${missingVars.join(', ')}. ` +
                `Por favor, crie um arquivo .env na raiz do projeto com essas variáveis.`
            );
        }

        connection = knex({
            client: "mysql2", 
            connection: {
                host: process.env.DB_HOST,
                port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME
            },
            pool: {
                min: process.env.DB_POOL_MIN ? Number(process.env.DB_POOL_MIN) : 2,
                max: process.env.DB_POOL_MAX ? Number(process.env.DB_POOL_MAX) : 10,
            }
        });
    }
    return connection;
}

export default getConnection;