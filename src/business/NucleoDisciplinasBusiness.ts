import { NucleoDisciplinasDatabase } from "../data/NucleoDisciplinasDatabase";

export class NucleoDisciplinasBusiness {
    constructor(
        private nucleoDisciplinasDatabase: NucleoDisciplinasDatabase
    ) { }

    public async get(params: any) {
        return this.nucleoDisciplinasDatabase.get(params);
    }

    public async create(input: any) {
        // If input is an array, insert multiple. If single object, insert one.
        // The frontend sends an array of objects for bulk insert.
        return this.nucleoDisciplinasDatabase.insert(input);
    }

    public async delete(params: any) {
        if (!params.nucleo_id) {
            throw new Error("Missing nucleo_id for deletion");
        }
        return this.nucleoDisciplinasDatabase.delete(params);
    }
}
