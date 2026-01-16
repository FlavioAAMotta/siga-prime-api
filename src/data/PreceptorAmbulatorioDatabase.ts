import { BaseDatabase } from "./BaseDatabase";
import connection from "./connection";

export class PreceptorAmbulatorioDatabase extends BaseDatabase {
    protected table = "preceptor_ambulatorio";

    public find = async (params: any): Promise<any[]> => {
        const query = connection()(this.table)
            .select(
                "preceptor_ambulatorio.*",
                "preceptores.id as preceptor_id_join",
                "preceptores.nome as preceptor_nome",
                "preceptores.crm as preceptor_crm",
                "disciplinas.id as disciplina_id_join",
                "disciplinas.nome as disciplina_nome"
            )
            .leftJoin("preceptores", "preceptor_ambulatorio.preceptor_id", "preceptores.id")
            .leftJoin("disciplinas", "preceptor_ambulatorio.disciplina_id", "disciplinas.id");

        if (params.filters) {
            Object.entries(params.filters).forEach(([key, value]) => {
                if (value === "true") value = true;
                if (value === "false") value = false;
                // Ambiguity check
                query.where(`preceptor_ambulatorio.${key}`, value);
            });
        }

        if (params.rangeFilters) {
            params.rangeFilters.forEach((filter: any) => {
                query.where(`preceptor_ambulatorio.${filter.column}`, filter.operator, filter.value);
            });
        }

        if (params.order) {
            query.orderBy(`preceptor_ambulatorio.${params.order.column}`, params.order.dir);
        } else {
            query.orderBy("preceptor_ambulatorio.dia_semana", "asc");
            query.orderBy("preceptor_ambulatorio.horario_inicio", "asc");
        }

        const result = await query;

        return result.map((row: any) => ({
            ...row,
            preceptor: row.preceptor_id_join ? {
                id: row.preceptor_id_join,
                nome: row.preceptor_nome,
                crm: row.preceptor_crm
            } : null,
            disciplina: row.disciplina_id_join ? {
                id: row.disciplina_id_join,
                nome: row.disciplina_nome
            } : null
        }));
    }
}
