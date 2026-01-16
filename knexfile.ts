
import { Knex } from "knex";
import 'dotenv/config';

const config: Knex.Config = {
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
    max: process.env.DB_POOL_MAX ? Number(process.env.DB_POOL_MAX) : 10
  },
  migrations: {
    directory: "./migrations",
    extension: "ts"
  }
};

export default config;
