import { AlunoTurmaPraticaDatabase } from "../data/AlunoTurmaPraticaDatabase";
import { QueryParams } from "../data/BaseDatabase";

export class AlunoTurmaPraticaBusiness {
    constructor(
        private alunoTurmaPraticaDatabase: AlunoTurmaPraticaDatabase
    ) { }

    public find = async (params: QueryParams) => {
        return await this.alunoTurmaPraticaDatabase.find(params);
    }

    public create = async (data: any) => {
        return await this.alunoTurmaPraticaDatabase.create(data);
    }

    public update = async (id: string, data: any) => {
        return await this.alunoTurmaPraticaDatabase.update(id, data);
    }

    public delete = async (id: string) => {
        return await this.alunoTurmaPraticaDatabase.delete(id);
    }
}
