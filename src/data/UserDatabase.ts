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
}
