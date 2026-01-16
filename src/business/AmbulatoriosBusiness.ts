import { AmbulatoriosDatabase } from "../data/AmbulatoriosDatabase";
import { QueryParams } from "../data/BaseDatabase";

export class AmbulatoriosBusiness {
    constructor(
        private ambulatoriosDatabase: AmbulatoriosDatabase
    ) { }

    public find = async (params: QueryParams) => {
        return await this.ambulatoriosDatabase.find(params);
    }

    public create = async (data: any) => {
        return await this.ambulatoriosDatabase.create(data);
    }

    public update = async (id: string, data: any) => {
        return await this.ambulatoriosDatabase.update(id, data);
    }

    public delete = async (id: string) => {
        return await this.ambulatoriosDatabase.delete(id);
    }
}
