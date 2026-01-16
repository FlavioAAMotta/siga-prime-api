import { BaseDatabase } from "./BaseDatabase";
import connection from "./connection";

export class AmbulatoriosDatabase extends BaseDatabase {
    protected table = "ambulatorios";

    public find = async (params: any): Promise<any[]> => {
        const query = connection()(this.table)
            .select(
                "ambulatorios.*",
                "disciplinas.id as disciplina_id_join",
                "disciplinas.nome as disciplina_nome",
                "disciplinas.codigo as disciplina_codigo"
            )
            .leftJoin("disciplinas", "ambulatorios.disciplina_id", "disciplinas.id");

        if (params.filters) {
            Object.entries(params.filters).forEach(([key, value]) => {
                if (value === "true") value = true;
                if (value === "false") value = false;
                // Avoid ambiguous column names
                query.where(`ambulatorios.${key}`, value);
            });
        }

        if (params.order) {
            query.orderBy(`ambulatorios.${params.order.column}`, params.order.dir);
        }

        if (params.rangeFilters) {
            params.rangeFilters.forEach((filter: any) => {
                query.where(`ambulatorios.${filter.column}`, filter.operator, filter.value);
            });
        }

        const result = await query;

        return result.map((row: any) => ({
            ...row,
            disciplina: row.disciplina_id_join ? {
                id: row.disciplina_id_join,
                nome: row.disciplina_nome,
                codigo: row.disciplina_codigo
            } : null
        }));
    }
}
