import { NucleosDatabase } from "../data/NucleosDatabase";

export class NucleosBusiness {
    private nucleosDatabase: NucleosDatabase;

    constructor() {
        this.nucleosDatabase = new NucleosDatabase();
    }

    public get = async (params: any) => {
        return await this.nucleosDatabase.find(params);
    }

    public create = async (data: any) => {
        return await this.nucleosDatabase.create(data);
    }

    public update = async (id: string, data: any) => {
        return await this.nucleosDatabase.update(id, data);
    }

    public delete = async (id: string) => {
        return await this.nucleosDatabase.delete(id);
    }
}
