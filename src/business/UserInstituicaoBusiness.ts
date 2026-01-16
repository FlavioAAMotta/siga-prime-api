import { UserInstituicaoDatabase } from "../data/UserInstituicaoDatabase";

export class UserInstituicaoBusiness {
    private userInstituicaoDatabase: UserInstituicaoDatabase;

    constructor() {
        this.userInstituicaoDatabase = new UserInstituicaoDatabase();
    }

    public get = async (params: any) => {
        return await this.userInstituicaoDatabase.find(params);
    }
}
