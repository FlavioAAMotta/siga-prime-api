import { AlunosDatabase } from "../data/AlunosDatabase";
import { QueryParams } from "../data/BaseDatabase";

export class AlunosBusiness {
    constructor(
        private alunosDatabase: AlunosDatabase
    ) { }

    public find = async (params: QueryParams) => {
        return await this.alunosDatabase.find(params);
    }

    public create = async (data: any) => {
        return await this.alunosDatabase.create(data);
    }

    public update = async (id: string, data: any) => {
        return await this.alunosDatabase.update(id, data);
    }

    public delete = async (id: string) => {
        return await this.alunosDatabase.delete(id);
    }
}
