import connection from "./connection";
import { BaseDatabase } from "./BaseDatabase";

export class AlunoPresencasDatabase extends BaseDatabase {
    protected table = "aluno_presencas";

    public find = async (params: any): Promise<any[]> => {
        const query = connection()(this.table)
            .select(
                "aluno_presencas.*",
                "alunos.id as aluno_id_join",
                "alunos.nome as aluno_nome",
                "alunos.matricula as aluno_matricula",
                "alunos.periodo as aluno_periodo",
                "turmas.id as turma_id",
                "turmas.nome as turma_nome",
                "preceptores.id as preceptor_id_join",
                "preceptores.nome as preceptor_nome",
                "ambulatorios.id as ambulatorio_id_join",
                "ambulatorios.nome as ambulatorio_nome"
            )
            .leftJoin("alunos", "aluno_presencas.aluno_id", "alunos.id")
            .leftJoin("turmas", "alunos.turma_id", "turmas.id")
            .leftJoin("preceptores", "aluno_presencas.preceptor_id", "preceptores.id")
            .leftJoin("ambulatorios", "aluno_presencas.ambulatorio_id", "ambulatorios.id");

        if (params.order) {
            query.orderBy(`aluno_presencas.${params.order.column}`, params.order.dir);
        }

        const results = await query;

        // Fetch aluno_turma_pratica info for these students
        const alunoIds = results.map((r: any) => r.aluno_id_join).filter((id: any) => id);
        let praticas: any[] = [];

        if (alunoIds.length > 0) {
            praticas = await connection()("aluno_turma_pratica")
                .select(
                    "aluno_turma_pratica.aluno_id",
                    "aluno_turma_pratica.turma_pratica_id",
                    "turmas.nome as turma_pratica_nome"
                )
                .join("turmas", "aluno_turma_pratica.turma_pratica_id", "turmas.id")
                .whereIn("aluno_turma_pratica.aluno_id", alunoIds);
        }

        return results.map((row: any) => {
            const alunoPraticas = praticas
                .filter((p: any) => p.aluno_id === row.aluno_id_join)
                .map((p: any) => ({
                    turma_pratica_id: p.turma_pratica_id,
                    turmas: { nome: p.turma_pratica_nome }
                }));

            return {
                id: row.id,
                data_presenca: row.data_presenca,
                presente: Boolean(row.presente),
                observacoes: row.observacoes,
                alunos: row.aluno_id_join ? {
                    nome: row.aluno_nome,
                    matricula: row.aluno_matricula,
                    periodo: row.aluno_periodo,
                    turmas: row.turma_id ? { nome: row.turma_nome } : null,
                    aluno_turma_pratica: alunoPraticas
                } : null,
                preceptores: row.preceptor_id_join ? { nome: row.preceptor_nome } : null,
                ambulatorios: row.ambulatorio_id_join ? { nome: row.ambulatorio_nome } : null
            };
        });
    }
}
