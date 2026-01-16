import connection from "./connection";

export class DashboardDatabase {

    public countActiveAlunos = async (): Promise<number> => {
        const [result] = await connection()("alunos")
            .count("id as count")
            .where({ ativo: true });
        return result.count as number;
    }

    public countActivePreceptores = async (): Promise<number> => {
        const [result] = await connection()("preceptores")
            .count("id as count")
            .where({ ativo: true });
        return result.count as number;
    }

    public countActiveAmbulatorios = async (): Promise<number> => {
        const [result] = await connection()("ambulatorios")
            .count("id as count")
            .where({ ativo: true });
        return result.count as number;
    }

    public countActiveTurmas = async (): Promise<number> => {
        const [result] = await connection()("turmas")
            .count("id as count")
            .where({ ativo: true });
        return result.count as number;
    }

    public getPresencasLastMonth = async (dateFrom: string): Promise<{ presente: boolean }[]> => {
        const result = await connection()("aluno_presencas")
            .select("presente")
            .where("data_presenca", ">=", dateFrom);
        return result;
    }

    public getRegistrosPontoCurrentMonth = async (dateFrom: string): Promise<{ data_entrada: Date, data_saida: Date }[]> => {
        const result = await connection()("registros_ponto")
            .select("data_entrada", "data_saida")
            .where("data_entrada", ">=", dateFrom)
            .whereNotNull("data_saida");
        return result as { data_entrada: Date, data_saida: Date }[];
    }

    public countInconsistencies = async (dateLimit: string): Promise<number> => {
        const [result] = await connection()("registros_ponto")
            .count("id as count")
            .whereNull("data_saida")
            .where("data_entrada", "<", dateLimit);
        return result.count as number;
    }
}
