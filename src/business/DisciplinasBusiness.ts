import { DisciplinasDatabase } from "../data/DisciplinasDatabase";
import { QueryParams } from "../data/BaseDatabase";

export class DisciplinasBusiness {
    constructor(
        private disciplinasDatabase: DisciplinasDatabase
    ) { }

    public find = async (params: QueryParams) => {
        return await this.disciplinasDatabase.find(params);
    }

    public create = async (data: any) => {
        return await this.disciplinasDatabase.create(data);
    }

    public update = async (id: string, data: any) => {
        return await this.disciplinasDatabase.update(id, data);
    }

    public delete = async (id: string) => {
        return await this.disciplinasDatabase.delete(id);
    }
}
