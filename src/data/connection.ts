import knex, { Knex } from 'knex';
import 'dotenv/config';
import { createTunnel } from 'tunnel-ssh';

let connection: Knex | null = null;
let tunnel: any = null;

// Configuração do SSH (usada apenas em Dev)
const sshConfig = {
    username: process.env.SSH_USER,
    password: process.env.SSH_PASS,
    host: process.env.SSH_HOST,
    port: Number(process.env.SSH_PORT) || 2222,
    dstHost: 'db',    // O nome do container do banco lá dentro
    dstPort: 3306,    // A porta do banco lá dentro
    localHost: '127.0.0.1',
    localPort: 3307   // Porta local que o túnel vai abrir
};

// Função auxiliar para garantir que o túnel exista antes de retornar a config
async function getConfig() {
    // SE ESTIVER EM DESENVOLVIMENTO: Abre o túnel se não existir
    if (process.env.NODE_ENV === 'development') {
        if (!tunnel) {
            console.log('🔌 Abrindo túnel SSH para conexão com banco...');
            // @ts-ignore
            [tunnel] = await createTunnel(sshConfig);
            console.log('✅ Túnel aberto na porta 3307');
        }

        // Retorna config apontando para o túnel local
        return {
            host: '127.0.0.1',
            port: 3307,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        };
    }

    // SE ESTIVER EM PRODUÇÃO: Conecta direto
    return {
        host: process.env.DB_HOST, // 'db'
        port: Number(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    };
}

function getConnection(): Knex {
    if (!connection) {
        connection = knex({
            client: "mysql2",
            connection: async () => {
                return await getConfig();
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