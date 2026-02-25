import { CoordenadoresDatabase } from "../data/CoordenadoresDatabase";
import { UserDatabase } from "../data/UserDatabase";
import { IdGenerator } from "../services/IdGenerator";
import { HashManager } from "../services/HashManager";
import { UserRole } from "../model/User";

export class CoordenadoresBusiness {
    constructor(
        private coordenadoresDatabase: CoordenadoresDatabase,
        private userDatabase: UserDatabase,
        private idGenerator: IdGenerator,
        private hashManager: HashManager
    ) { }

    public get = async (params: any) => {
        return await this.coordenadoresDatabase.find(params);
    }

    public create = async (data: any) => {
        return await this.coordenadoresDatabase.create(data);
    }

    public update = async (id: string, data: any) => {
        return await this.coordenadoresDatabase.update(id, data);
    }

    public delete = async (id: string) => {
        return await this.coordenadoresDatabase.delete(id);
    }

    public createUser = async (coordenadorId: string) => {
        const coordenador = await this.coordenadoresDatabase.findById(coordenadorId);
        if (!coordenador) {
            throw new Error("Coordenador não encontrado");
        }

        if (!coordenador.email) {
            throw new Error("Coordenador não possui email cadastrado");
        }

        // 1. Check if user already exists
        const userExists = await this.userDatabase.findUserByEmail(coordenador.email);

        if (userExists) {
            // If user exists, we just ensure the role is set (or reset password as requested)
            const newPassword = "123456";
            const hashedPassword = await this.hashManager.hash(newPassword);
            await this.userDatabase.updatePassword(userExists.id, hashedPassword);

            // Ensure role and institution are linked if missing
            await this.userDatabase.insertUserRole(userExists.id, UserRole.COORDENADOR);
            if (coordenador.instituicao_id) {
                await this.userDatabase.activateUserInstitution(userExists.id, coordenador.instituicao_id);
            }

            return { message: "Senha de coordenador resetada com sucesso", defaultPassword: "123456" };
        }

        // 2. Create new user
        const userId = this.idGenerator.generate();
        const defaultPassword = "123456";
        const hashedPassword = await this.hashManager.hash(defaultPassword);

        await this.userDatabase.insertUser({
            id: userId,
            email: coordenador.email,
            password: hashedPassword,
            created_at: new Date()
        });

        // 3. Assign Role
        await this.userDatabase.insertUserRole(userId, UserRole.COORDENADOR);

        // 4. Link to Institution
        if (coordenador.instituicao_id) {
            await this.userDatabase.activateUserInstitution(userId, coordenador.instituicao_id);
        }

        return { message: "Usuário de coordenador criado com sucesso", defaultPassword: "123456" };
    }
}
