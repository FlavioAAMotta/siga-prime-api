import { BaseDatabase } from "./BaseDatabase";
import connection from "./connection";

export class TurmasDatabase extends BaseDatabase {
    protected table = "turmas";

    public find = async (params: any): Promise<any[]> => {
        const query = connection()(this.table)
            .select(
                "turmas.*",
                "tp.id as turma_periodo_join_id",
                "tp.nome as turma_periodo_join_nome"
            )
            .leftJoin("turmas as tp", "turmas.turma_periodo_id", "tp.id");

        if (params.filters) {
            Object.entries(params.filters).forEach(([key, value]) => {
                if (value === "true") value = true;
                if (value === "false") value = false;
                query.where(`turmas.${key}`, value);
            });
        }

        if (params.order) {
            query.orderBy(`turmas.${params.order.column}`, params.order.dir);
        }

        const turmas = await query;

        const turmaIds = turmas.map((t: any) => t.id);

        let turmaDisciplinas: any[] = [];

        if (turmaIds.length > 0) {
            turmaDisciplinas = await connection()("turma_disciplinas")
                .select(
                    "turma_disciplinas.turma_id",
                    "disciplinas.id as disciplina_id",
                    "disciplinas.nome as disciplina_nome",
                    "disciplinas.codigo as disciplina_codigo"
                )
                .join("disciplinas", "turma_disciplinas.disciplina_id", "disciplinas.id")
                .whereIn("turma_disciplinas.turma_id", turmaIds);
        }

        return turmas.map((t: any) => {
            const relatedDisciplinas = turmaDisciplinas.filter((td: any) => td.turma_id === t.id);

            return {
                ...t,
                turma_periodo: t.turma_periodo_join_id ? {
                    id: t.turma_periodo_join_id,
                    nome: t.turma_periodo_join_nome
                } : null,
                turma_disciplinas: relatedDisciplinas.map((rd: any) => ({
                    disciplinas: {
                        id: rd.disciplina_id,
                        nome: rd.disciplina_nome,
                        codigo: rd.disciplina_codigo
                    }
                }))
            };
        });
    }
}
