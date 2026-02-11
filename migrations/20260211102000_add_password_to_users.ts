import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    const hasPassword = await knex.schema.hasColumn('users', 'password');
    if (!hasPassword) {
        await knex.schema.alterTable('users', (table) => {
            table.string('password').notNullable().defaultTo('temp_password');
        });
    }
}

export async function down(knex: Knex): Promise<void> {
    const hasPassword = await knex.schema.hasColumn('users', 'password');
    if (hasPassword) {
        await knex.schema.alterTable('users', (table) => {
            table.dropColumn('password');
        });
    }
}
