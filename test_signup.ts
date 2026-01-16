
import axios from 'axios';
import knex from 'knex';
import 'dotenv/config';
import { TokenManager, USER_ROLES } from './src/services/TokenManager';

const db = knex({
    client: "mysql2",
    connection: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    }
});

async function testSignup() {
    const email = `test_${Date.now()}@example.com`;
    const password = "password123";

    console.log(`Generating ADMIN token for request...`);
    const tokenManager = new TokenManager();
    const token = tokenManager.createToken({
        id: "mock-admin-id",
        name: "Mock Admin",
        role: USER_ROLES.ADMIN
    });

    console.log(`Attempting to register user: ${email}`);

    try {
        const response = await axios.post("http://localhost:3003/users/signup", {
            email,
            password
        }, {
            headers: {
                Authorization: token
            }
        });

        console.log("Response status:", response.status);
        console.log("Response data:", response.data);

        if (response.status === 201) {
            console.log("Verifying database...");
            const user = await db("users").where({ email }).first();

            if (user) {
                console.log("User found in DB:");
                console.log("ID:", user.id);

                const role = await db("user_roles").where({ user_id: user.id }).first();
                if (role && role.role === "ADMIN") {
                    console.log("SUCCESS: User created with ADMIN role.");
                } else {
                    console.error("FAILURE: Role incorrect.");
                }

            } else {
                console.error("FAILURE: User NOT found in DB.");
            }
        }
    } catch (error: any) {
        console.error("Error during signup:", error.response ? error.response.data : error.message);
    } finally {
        await db.destroy();
    }
}

testSignup();
