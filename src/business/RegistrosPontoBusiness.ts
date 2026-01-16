import { RegistrosPontoDatabase } from "../data/RegistrosPontoDatabase";
import { QueryParams } from "../data/BaseDatabase";

export class RegistrosPontoBusiness {
    constructor(
        private registrosPontoDatabase: RegistrosPontoDatabase
    ) { }

    public find = async (params: QueryParams) => {
        return await this.registrosPontoDatabase.find(params);
    }

    public create = async (data: any) => {
        return await this.registrosPontoDatabase.create(data);
    }

    public update = async (id: string, data: any) => {
        return await this.registrosPontoDatabase.update(id, data);
    }

    public delete = async (id: string) => {
        return await this.registrosPontoDatabase.delete(id);
    }
}
