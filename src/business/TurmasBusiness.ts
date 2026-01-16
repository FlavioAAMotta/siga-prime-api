import { TurmasDatabase } from "../data/TurmasDatabase";
import { QueryParams } from "../data/BaseDatabase";

export class TurmasBusiness {
    constructor(
        private turmasDatabase: TurmasDatabase
    ) { }

    public find = async (params: QueryParams) => {
        return await this.turmasDatabase.find(params);
    }

    public create = async (data: any) => {
        return await this.turmasDatabase.create(data);
    }

    public update = async (id: string, data: any) => {
        return await this.turmasDatabase.update(id, data);
    }

    public delete = async (id: string) => {
        return await this.turmasDatabase.delete(id);
    }
}
