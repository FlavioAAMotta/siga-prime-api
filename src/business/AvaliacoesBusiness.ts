import { AvaliacoesDatabase } from "../data/AvaliacoesDatabase";

export class AvaliacoesBusiness {
    private avaliacoesDatabase: AvaliacoesDatabase;

    constructor() {
        this.avaliacoesDatabase = new AvaliacoesDatabase();
    }

    public get = async (params: any) => {
        return await this.avaliacoesDatabase.find(params);
    }

    public create = async (data: any) => {
        return await this.avaliacoesDatabase.create(data);
    }

    public update = async (id: string, data: any) => {
        return await this.avaliacoesDatabase.update(id, data);
    }

    public delete = async (id: string) => {
        return await this.avaliacoesDatabase.delete(id);
    }
}
