import { TurmaDisciplinasDatabase } from "../data/TurmaDisciplinasDatabase";
import { QueryParams } from "../data/BaseDatabase";

export class TurmaDisciplinasBusiness {
    constructor(
        private turmaDisciplinasDatabase: TurmaDisciplinasDatabase
    ) { }

    public find = async (params: QueryParams) => {
        return await this.turmaDisciplinasDatabase.find(params);
    }

    public create = async (data: any) => {
        return await this.turmaDisciplinasDatabase.create(data);
    }

    public update = async (id: string, data: any) => {
        return await this.turmaDisciplinasDatabase.update(id, data);
    }

    public delete = async (id: string) => {
        return await this.turmaDisciplinasDatabase.delete(id);
    }
}
