import knex, { Knex } from 'knex';
import 'dotenv/config';
import { createTunnel } from 'tunnel-ssh';

let knexInstance: Knex | null = null;

// Separação das configurações conforme exigido pela nova assinatura da função
const tunnelOptions = {
    autoClose: true,
    emitError: false, // Adicionado para evitar crash se der erro no túnel
    reconnectOnError: false // OBRIGATÓRIO nessa versão
};
const serverOptions = {
    port: 3307 // Porta LOCAL onde o túnel vai abrir
};

const sshOptions = {
    host: process.env.SSH_HOST,
    port: Number(process.env.SSH_PORT) || 2222,
    username: process.env.SSH_USER,
    password: process.env.SSH_PASS,
};

const forwardOptions = {
    dstAddr: 'db', // Nome do container/host lá dentro
    dstPort: 3306  // Porta do banco lá dentro
};

export async function initDatabase(): Promise<void> {

    // Lógica do Túnel (apenas em DEV)
    if (process.env.NODE_ENV === 'development') {
        try {
            console.log('🔌 Tentando abrir túnel SSH...');

            // AGORA SIM: Passando os 4 argumentos separadamente
            // @ts-ignore (caso o TypeScript reclame de tipos específicos do serverOptions)
            const [server, client] = await createTunnel(
                tunnelOptions,
                serverOptions,
                sshOptions,
                forwardOptions
            );

            console.log('✅ Túnel SSH estabelecido com sucesso na porta 3307');
        } catch (error) {
            console.error('❌ Erro ao abrir túnel SSH:', error);
            // Em dev, se o túnel falhar, a aplicação nem deve subir
            process.exit(1);
        }
    }

    // Configuração do Banco
    const dbConfig = {
        client: 'mysql2',
        connection: {
            host: process.env.NODE_ENV === 'development' ? '127.0.0.1' : process.env.DB_HOST,
            port: process.env.NODE_ENV === 'development' ? 3307 : Number(process.env.DB_PORT),
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
        },
        pool: {
            min: 2,
            max: 10
        }
    };

    knexInstance = knex(dbConfig);

    try {
        await knexInstance.raw('SELECT 1');
        console.log('🚀 Knex conectado ao banco com sucesso!');
    } catch (e) {
        console.error('❌ Falha ao conectar o Knex no banco:', e);
    }
}

export default function getConnection(): Knex {
    if (!knexInstance) {
        throw new Error('Database não inicializado! Chame initDatabase() no start do app.');
    }
    return knexInstance;
}