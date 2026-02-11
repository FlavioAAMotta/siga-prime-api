
import { Knex } from "knex";
import 'dotenv/config';
import { createTunnel } from 'tunnel-ssh';

let tunnel: any = null;

async function getConnectionConfig() {
  if (process.env.NODE_ENV === 'development') {
    if (!tunnel) {
      console.log('🔌 Abrindo túnel SSH para migrations...');

      const tunnelOptions = {
        autoClose: true
      };

      const serverOptions = {
        port: 3308
      };

      const sshOptions = {
        host: process.env.SSH_HOST,
        port: Number(process.env.SSH_PORT) || 2222,
        username: process.env.SSH_USER,
        password: process.env.SSH_PASS
      };

      const forwardOptions = {
        dstAddr: 'db',
        dstPort: 3306
      };

      try {
        // @ts-ignore
        const result = await createTunnel(tunnelOptions, serverOptions, sshOptions, forwardOptions);
        tunnel = result[0];
        console.log('✅ Túnel aberto na porta 3308');
      } catch (error) {
        console.error('❌ Erro ao abrir túnel:', error);
        throw error;
      }
    }

    return {
      host: '127.0.0.1',
      port: 3308,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD || process.env.DB_PASS,
      database: process.env.DB_NAME,
      multipleStatements: true
    };
  }

  return {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true
  };
}

const config: Knex.Config = {
  client: "mysql2",
  connection: async () => {
    return await getConnectionConfig();
  },
  pool: {
    min: process.env.DB_POOL_MIN ? Number(process.env.DB_POOL_MIN) : 2,
    max: process.env.DB_POOL_MAX ? Number(process.env.DB_POOL_MAX) : 10
  },
  migrations: {
    directory: "./migrations",
    extension: "ts"
  }
};

export default config;
