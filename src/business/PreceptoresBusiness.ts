import { PreceptoresDatabase } from "../data/PreceptoresDatabase";
import { UserDatabase } from "../data/UserDatabase";
import { QueryParams } from "../data/BaseDatabase";
import { IdGenerator } from "../services/IdGenerator";
import { HashManager } from "../services/HashManager";
import { UserRole } from "../model/User";

export class PreceptoresBusiness {
    constructor(
        private preceptoresDatabase: PreceptoresDatabase,
        private userDatabase: UserDatabase,
        private idGenerator: IdGenerator,
        private hashManager: HashManager
    ) { }

    public find = async (params: QueryParams) => {
        return await this.preceptoresDatabase.find(params);
    }

    public create = async (data: any) => {
        const { nome, usuario, crm, email, telefone, ativo, instituicao_id } = data;

        if (!email) {
            throw new Error("Email is required");
        }

        // 1. Create User
        const userExists = await this.userDatabase.findUserByEmail(email);
        if (userExists) {
            throw new Error("User with this email already exists");
        }

        const userId = this.idGenerator.generate();
        const password = "123456";
        const hashedPassword = await this.hashManager.hash(password);

        await this.userDatabase.insertUser({
            id: userId,
            email,
            password: hashedPassword,
            created_at: new Date()
        });

        await this.userDatabase.insertUserRole(userId, UserRole.PRECEPTOR);

        // 2. Create Preceptor
        const preceptorData = {
            nome,
            usuario,
            crm,
            email,
            telefone,
            ativo
        };

        const createdPreceptor = await this.preceptoresDatabase.create(preceptorData);

        // 3. Link User to Institution
        if (instituicao_id) {
            await this.userDatabase.activateUserInstitution(userId, instituicao_id);
        }

        return createdPreceptor;
    }

    public update = async (id: string, data: any) => {
        const preceptorExists = await this.preceptoresDatabase.findById(id);
        if (!preceptorExists) {
            throw new Error("Preceptor not found");
        }

        const updatedPreceptor = await this.preceptoresDatabase.update(id, data);
        return updatedPreceptor;
    }

    public resetPassword = async (id: string) => {
        const preceptor = await this.preceptoresDatabase.findById(id);
        if (!preceptor || !preceptor.email) {
            throw new Error("Preceptor not found or has no email to link to user.");
        }

        const user = await this.userDatabase.findUserByEmail(preceptor.email);
        if (!user) {
            throw new Error("User not found for this preceptor.");
        }

        const newPassword = "123456";
        const hashedPassword = await this.hashManager.hash(newPassword);

        await this.userDatabase.updatePassword(user.id, hashedPassword);

        return { message: "Senha resetada para 123456 com sucesso!" };
    }

    public delete = async (id: string) => {
        return await this.preceptoresDatabase.delete(id);
    }
}
