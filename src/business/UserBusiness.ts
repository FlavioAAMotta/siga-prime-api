import { UserDatabase } from "../data/UserDatabase";
import { SignupInputDTO, UserRole } from "../model/User";
import { IdGenerator } from "../services/IdGenerator";
import { HashManager } from "../services/HashManager";

export class UserBusiness {
    constructor(
        private userDatabase: UserDatabase,
        private idGenerator: IdGenerator,
        private hashManager: HashManager
    ) { }

    public signup = async (input: SignupInputDTO): Promise<void> => {
        const { email, password } = input;

        if (!email || !password) {
            throw new Error("Email and password are required");
        }

        const userExists = await this.userDatabase.findUserByEmail(email);

        if (userExists) {
            throw new Error("User already exists");
        }

        const id = this.idGenerator.generate();
        const hashedPassword = await this.hashManager.hash(password);

        await this.userDatabase.insertUser({
            id,
            email,
            password: hashedPassword,
            created_at: new Date()
        });

        // Default role is ADMIN as requested
        await this.userDatabase.insertUserRole(id, UserRole.ADMIN);
    }
}
