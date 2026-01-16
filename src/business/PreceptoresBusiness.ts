import { PreceptoresDatabase } from "../data/PreceptoresDatabase";
import { QueryParams } from "../data/BaseDatabase";

export class PreceptoresBusiness {
    constructor(
        private preceptoresDatabase: PreceptoresDatabase
    ) { }

    public find = async (params: QueryParams) => {
        return await this.preceptoresDatabase.find(params);
    }

    public create = async (data: any) => {
        return await this.preceptoresDatabase.create(data);
    }

    public update = async (id: string, data: any) => {
        return await this.preceptoresDatabase.update(id, data);
    }

    public delete = async (id: string) => {
        return await this.preceptoresDatabase.delete(id);
    }
}
