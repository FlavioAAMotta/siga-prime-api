import { AlunoPresencasDatabase } from "../data/AlunoPresencasDatabase";
import { QueryParams } from "../data/BaseDatabase";

export class AlunoPresencasBusiness {
    constructor(
        private alunoPresencasDatabase: AlunoPresencasDatabase
    ) { }

    public find = async (params: QueryParams) => {
        return await this.alunoPresencasDatabase.find(params);
    }

    public create = async (data: any) => {
        return await this.alunoPresencasDatabase.create(data);
    }

    public update = async (id: string, data: any) => {
        return await this.alunoPresencasDatabase.update(id, data);
    }

    public delete = async (id: string) => {
        return await this.alunoPresencasDatabase.delete(id);
    }
}
