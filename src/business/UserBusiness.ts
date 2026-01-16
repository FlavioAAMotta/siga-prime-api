import { UserDatabase } from "../data/UserDatabase";
import { LoginInputDTO, SignupInputDTO, UserRole } from "../model/User";
import { IdGenerator } from "../services/IdGenerator";
import { HashManager } from "../services/HashManager";
import { TokenManager, USER_ROLES } from "../services/TokenManager";

export class UserBusiness {
    constructor(
        private userDatabase: UserDatabase,
        private idGenerator: IdGenerator,
        private hashManager: HashManager,
        private tokenManager: TokenManager
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

    public login = async (input: LoginInputDTO): Promise<string> => {
        const { email, password } = input;

        if (!email || !password) {
            throw new Error("Email and password are required");
        }

        const user = await this.userDatabase.findUserByEmail(email);

        if (!user) {
            throw new Error("Invalid credentials");
        }

        const isPasswordCorrect = await this.hashManager.compare(password, user.password as string);

        if (!isPasswordCorrect) {
            throw new Error("Invalid credentials");
        }

        const role = await this.userDatabase.findUserRole(user.id);

        const token = this.tokenManager.createToken({
            id: user.id,
            name: user.email,
            role: (role as unknown as USER_ROLES) || USER_ROLES.NORMAL
        });

        return token;
    }

    public getSession = async (token: string): Promise<any> => {
        const payload = this.tokenManager.getPayload(token);

        if (!payload) {
            throw new Error("Invalid token");
        }

        return {
            id: payload.id,
            email: payload.name,
            role: payload.role
        };
    }

    public getUserInstitutions = async (userId: string) => {
        return this.userDatabase.getUserInstitutions(userId);
    }

    public activateUserInstitution = async (userId: string, instituicaoId: string) => {
        if (!instituicaoId) {
            throw new Error("Institution ID is required");
        }
        await this.userDatabase.activateUserInstitution(userId, instituicaoId);
    }
}
