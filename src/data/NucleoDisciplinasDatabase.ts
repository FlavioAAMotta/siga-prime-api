import { BaseDatabase } from "./BaseDatabase";
import connection from "./connection";

export class NucleoDisciplinasDatabase extends BaseDatabase {
    protected table = "nucleo_disciplinas";

    public async get(params: any): Promise<any> {
        const query = connection()
            .select("*")
            .from(this.table);

        if (params.nucleo_id) {
            query.where("nucleo_id", params.nucleo_id);
        }

        if (params.disciplina_id) {
            query.where("disciplina_id", params.disciplina_id);
        }

        const result = await query;
        return result;
    }

    public async insert(input: any): Promise<any> {
        const result = await connection()
            .insert(input)
            .into(this.table);
        return result;
    }

    public delete = async (params: any): Promise<void> => {
        const query = connection()
            .delete()
            .from(this.table);

        if (params.nucleo_id) {
            query.where("nucleo_id", params.nucleo_id);
        }

        // specific safety check to ensure we don't delete everything if params is empty
        if (!params.nucleo_id && !params.disciplina_id) {
            throw new Error("Must provide filters for deletion");
        }

        await query;
    }
}
