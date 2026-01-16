import { BaseDatabase, QueryParams } from "./BaseDatabase";
import connection from "./connection";

export class AlunosDatabase extends BaseDatabase {
    protected table = "alunos";

    public find = async (params: QueryParams): Promise<any[]> => {
        let query = connection()(this.table);

        // Alias fields to avoid collision and make reconstruction easier
        query = query.select(
            `${this.table}.*`,
            "turmas.id as turma_id_joined",
            "turmas.nome as turma_nome"
        );

        query = query.leftJoin("turmas", `${this.table}.turma_id`, "turmas.id");

        if (params.filters) {
            Object.entries(params.filters).forEach(([key, value]) => {
                if (value === "true") value = true;
                if (value === "false") value = false;
                // Handle ambiguous column names by prefixing with table name if needed
                // For now assuming simple filters on 'alunos'
                query = query.where(`${this.table}.${key}`, value);
            });
        }

        if (params.order) {
            query = query.orderBy(params.order.column, params.order.dir);
        }

        if (params.limit) {
            query = query.limit(params.limit);
        }

        const result = await query;

        // Map result to nest 'turmas' object
        return result.map(row => {
            const { turma_id_joined, turma_nome, ...alunoData } = row;
            return {
                ...alunoData,
                turmas: turma_id_joined ? { id: turma_id_joined, nome: turma_nome } : null
            };
        });
    }
}
