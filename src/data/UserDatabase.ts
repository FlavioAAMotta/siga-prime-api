import connection from "./connection";
import { User, UserRole } from "../model/User";
import { v7 as uuidv7 } from "uuid";

export class UserDatabase {
    private static TABLE_USERS = "users";
    private static TABLE_USER_ROLES = "user_roles";

    public insertUser = async (user: User): Promise<void> => {
        await connection().insert({
            id: user.id,
            email: user.email,
            password: user.password,
            created_at: user.created_at
        }).into(UserDatabase.TABLE_USERS);
    }

    public insertUserRole = async (userId: string, role: UserRole): Promise<void> => {
        await connection().insert({
            id: uuidv7(),
            user_id: userId,
            role: role
        }).into(UserDatabase.TABLE_USER_ROLES);
    }

    public findUserByEmail = async (email: string): Promise<User | null> => {
        const result = await connection()
            .select("*")
            .from(UserDatabase.TABLE_USERS)
            .where({ email })
            .first();

        if (!result) {
            return null;
        }

        return result as User;
    }
    public findUserRole = async (userId: string): Promise<UserRole | null> => {
        const result = await connection()
            .select("role")
            .from(UserDatabase.TABLE_USER_ROLES)
            .where({ user_id: userId })
            .first();

        if (!result) {
            return null;
        }

        return result.role as UserRole;
    }

    public getUserInstitutions = async (userId: string): Promise<any[]> => {
        const result = await connection()
            .select(
                "ui.id as vinculo_id",
                "ui.ativa",
                "i.id",
                "i.nome",
                "i.tipo",
                "i.ativo"
            )
            .from("user_instituicao as ui")
            .join("instituicoes as i", "ui.instituicao_id", "i.id")
            .where({ "ui.user_id": userId });

        return result;
    }

    public activateUserInstitution = async (userId: string, instituicaoId: string): Promise<void> => {
        await connection().transaction(async (trx) => {
            // Desativar todas
            await trx("user_instituicao")
                .where({ user_id: userId })
                .update({ ativa: false });

            // Verificar se vínculo existe
            const existingLink = await trx("user_instituicao")
                .where({ user_id: userId, instituicao_id: instituicaoId })
                .first();

            if (existingLink) {
                // Ativar existente
                await trx("user_instituicao")
                    .where({ id: existingLink.id })
                    .update({ ativa: true });
            } else {
                // Criar novo vínculo ativo
                await trx("user_instituicao")
                    .insert({
                        id: uuidv7(),
                        user_id: userId,
                        instituicao_id: instituicaoId,
                        ativa: true
                    });
            }
        });
    }

    public updatePassword = async (userId: string, password: string): Promise<void> => {
        await connection()
            .from(UserDatabase.TABLE_USERS)
            .where({ id: userId })
            .update({ password });
    }
}
