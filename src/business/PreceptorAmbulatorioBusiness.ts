import { PreceptorAmbulatorioDatabase } from "../data/PreceptorAmbulatorioDatabase";
import { QueryParams } from "../data/BaseDatabase";

export class PreceptorAmbulatorioBusiness {
    constructor(
        private preceptorAmbulatorioDatabase: PreceptorAmbulatorioDatabase
    ) { }

    public find = async (params: QueryParams) => {
        return await this.preceptorAmbulatorioDatabase.find(params);
    }

    public create = async (data: any) => {
        return await this.preceptorAmbulatorioDatabase.create(data);
    }

    public update = async (id: string, data: any) => {
        return await this.preceptorAmbulatorioDatabase.update(id, data);
    }

    public delete = async (id: string) => {
        return await this.preceptorAmbulatorioDatabase.delete(id);
    }
}
