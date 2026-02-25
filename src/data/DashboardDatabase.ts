import connection from "./connection";

export class DashboardDatabase {

    public countActiveAlunos = async (instituicaoId?: string): Promise<number> => {
        const query = connection()("alunos").count("id as count").where({ ativo: true });
        if (instituicaoId) query.where({ instituicao_id: instituicaoId });
        const [result] = await query;
        return result.count as number;
    }

    public countActivePreceptores = async (instituicaoId?: string): Promise<number> => {
        const query = connection()("preceptores").count("id as count").where({ ativo: true });
        if (instituicaoId) query.where({ instituicao_id: instituicaoId });
        const [result] = await query;
        return result.count as number;
    }

    public countActiveAmbulatorios = async (instituicaoId?: string): Promise<number> => {
        const query = connection()("ambulatorios").count("id as count").where({ ativo: true });
        if (instituicaoId) query.where({ instituicao_id: instituicaoId });
        const [result] = await query;
        return result.count as number;
    }

    public countActiveTurmas = async (instituicaoId?: string): Promise<number> => {
        const query = connection()("turmas").count("id as count").where({ ativo: true });
        if (instituicaoId) query.where({ instituicao_id: instituicaoId });
        const [result] = await query;
        return result.count as number;
    }

    public getPresencasLastMonth = async (dateFrom: string, instituicaoId?: string): Promise<{ presente: boolean }[]> => {
        const query = connection()("aluno_presencas")
            .select("presente")
            .where("data_presenca", ">=", dateFrom);

        if (instituicaoId) {
            // Join with alunos to filter by institution
            query.join("alunos", "aluno_presencas.aluno_id", "alunos.uuid")
                .where("alunos.instituicao_id", instituicaoId);
        }

        return await query;
    }

    public getRegistrosPontoCurrentMonth = async (dateFrom: string, instituicaoId?: string): Promise<{ data_entrada: Date, data_saida: Date }[]> => {
        const query = connection()("registros_ponto")
            .select("data_entrada", "data_saida")
            .where("data_entrada", ">=", dateFrom)
            .whereNotNull("data_saida");

        if (instituicaoId) {
            query.where({ instituicao_id: instituicaoId });
        }

        const result = await query;
        return result as { data_entrada: Date, data_saida: Date }[];
    }

    public countInconsistencies = async (dateLimit: string, instituicaoId?: string): Promise<number> => {
        const query = connection()("registros_ponto")
            .count("id as count")
            .whereNull("data_saida")
            .where("data_entrada", "<", dateLimit);

        if (instituicaoId) {
            query.where({ instituicao_id: instituicaoId });
        }

        const [result] = await query;
        return result.count as number;
    }

    public countActiveAlunosBefore = async (date: string, instituicaoId?: string): Promise<number> => {
        const query = connection()("alunos")
            .count("id as count")
            .where({ ativo: true })
            .where("created_at", "<", date);

        if (instituicaoId) query.where({ instituicao_id: instituicaoId });

        const [result] = await query;
        return result.count as number;
    }

    public countActivePreceptoresBefore = async (date: string, instituicaoId?: string): Promise<number> => {
        const query = connection()("preceptores")
            .count("id as count")
            .where({ ativo: true })
            .where("created_at", "<", date);

        if (instituicaoId) query.where({ instituicao_id: instituicaoId });

        const [result] = await query;
        return result.count as number;
    }

    public getPresencasByRange = async (dateFrom: string, dateTo: string, instituicaoId?: string): Promise<any[]> => {
        const query = connection()("aluno_presencas as ap")
            .select(
                "ap.presente",
                "ap.data_presenca",
                "a.nome as aluno_nome",
                "amb.nome as ambulatorio_nome"
            )
            .join("alunos as a", "ap.aluno_id", "a.uuid")
            .join("ambulatorios as amb", "ap.ambulatorio_id", "amb.uuid")
            // We use created_at to filter specifically the last records if data_presenca is just the date
            .where("ap.created_at", ">=", dateFrom)
            .where("ap.created_at", "<=", dateTo);

        if (instituicaoId) {
            query.where("a.instituicao_id", instituicaoId);
        }

        return await query;
    }

    public getRecentPoints = async (dateFrom: string, instituicaoId?: string): Promise<any[]> => {
        const query = connection()("registros_ponto as rp")
            .select(
                "rp.status_entrada",
                "rp.minutos_atraso_entrada",
                "rp.data_entrada",
                "p.nome as preceptor_nome",
                "amb.nome as ambulatorio_nome"
            )
            .join("preceptores as p", "rp.preceptor_id", "p.uuid")
            .join("ambulatorios as amb", "rp.ambulatorio_id", "amb.uuid")
            .where("rp.data_entrada", ">=", dateFrom);

        if (instituicaoId) {
            query.where("p.instituicao_id", instituicaoId);
        }

        return await query;
    }

    public getRecentEvaluations = async (dateFrom: string, instituicaoId?: string): Promise<any[]> => {
        const query = connection()("avaliacoes as av")
            .select(
                "av.nota",
                "av.tipo_avaliacao",
                "a.nome as aluno_nome"
            )
            .join("alunos as a", "av.aluno_id", "a.uuid")
            .where("av.created_at", ">=", dateFrom);

        if (instituicaoId) {
            query.where("a.instituicao_id", instituicaoId);
        }

        return await query;
    }

    public getFullContext = async (instituicaoId?: string) => {
        const preceptoresQuery = connection()("preceptores").select("*").where({ ativo: true }).limit(100);
        const alunosQuery = connection()("alunos as a")
            .select("a.*", "t.nome as turma_nome")
            .leftJoin("turmas as t", "a.turma_id", "t.uuid")
            .where("a.ativo", true).limit(100);
        const presencasQuery = connection()("aluno_presencas").select("*").limit(100).orderBy("created_at", "desc");
        const avaliacoesQuery = connection()("avaliacoes").select("*").limit(100).orderBy("created_at", "desc");
        const ambulatoriosQuery = connection()("ambulatorios").select("*").where({ ativo: true }).limit(50);

        if (instituicaoId) {
            preceptoresQuery.where({ instituicao_id: instituicaoId });
            alunosQuery.where("a.instituicao_id", instituicaoId);
            ambulatoriosQuery.where({ instituicao_id: instituicaoId });
        }

        const [p, al, pr, av, am] = await Promise.all([
            preceptoresQuery, alunosQuery, presencasQuery, avaliacoesQuery, ambulatoriosQuery
        ]);

        return {
            preceptores: p,
            alunos: al,
            presencas: pr,
            avaliacoes: av,
            ambulatorios: am
        };
    }

    public getCountRecent = async (table: string, dateColumn: string, dateFrom: string, instituicaoId?: string): Promise<number> => {
        const query = connection()(table)
            .count("id as count")
            .where(dateColumn, ">=", dateFrom);

        if (instituicaoId) {
            // Check if table has instituicao_id directly or needs join
            const columns = await connection()(table).columnInfo();
            if ('instituicao_id' in columns) {
                query.where({ instituicao_id: instituicaoId });
            }
        }

        const [result] = await query;
        return result.count as number;
    }
}
