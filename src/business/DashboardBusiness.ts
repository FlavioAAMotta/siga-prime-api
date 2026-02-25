import { DashboardDatabase } from "../data/DashboardDatabase";
import { DateUtils } from "../utils/DateUtils";

export class DashboardBusiness {
    constructor(
        private dashboardDatabase: DashboardDatabase
    ) { }

    public getSummary = async (instituicaoId?: string): Promise<any> => {
        // Fetch base counts
        const alunosAtivos = await this.dashboardDatabase.countActiveAlunos(instituicaoId);
        const preceptores = await this.dashboardDatabase.countActivePreceptores(instituicaoId);
        const ambulatorios = await this.dashboardDatabase.countActiveAmbulatorios(instituicaoId);
        const turmasAtivas = await this.dashboardDatabase.countActiveTurmas(instituicaoId);

        // Calculate presence rate (last 30 days)
        const date30DaysAgo = new Date();
        date30DaysAgo.setDate(date30DaysAgo.getDate() - 30);
        const presencas = await this.dashboardDatabase.getPresencasLastMonth(date30DaysAgo.toISOString().split('T')[0], instituicaoId);

        let taxaPresenca = 0;
        if (presencas && presencas.length > 0) {
            const presentes = presencas.filter(p => p.presente).length;
            taxaPresenca = (presentes / presencas.length) * 100;
        }

        // Calculate registered hours (current month)
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const registrosPonto = await this.dashboardDatabase.getRegistrosPontoCurrentMonth(startOfMonth.toISOString(), instituicaoId);

        let horasRegistradas = 0;
        if (registrosPonto) {
            horasRegistradas = registrosPonto.reduce((total, registro) => {
                const entrada = new Date(registro.data_entrada);
                const saida = new Date(registro.data_saida);
                const horas = (saida.getTime() - entrada.getTime()) / (1000 * 60 * 60);
                return total + (isNaN(horas) ? 0 : horas);
            }, 0);
        }

        // Calculate inconsistencies (entry older than yesterday with no exit)
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const inconsistencias = await this.dashboardDatabase.countInconsistencies(yesterday.toISOString(), instituicaoId);

        // Days remaining calculation using Brazilian Calendar
        const agora = new Date();
        const diasLetivos = DateUtils.getRemainingDiasLetivos(agora);

        // Calculate real trends
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const sixtyDaysAgo = new Date();
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

        const date30Str = thirtyDaysAgo.toISOString().split('T')[0];
        const date60Str = sixtyDaysAgo.toISOString().split('T')[0];

        // 1. Alunos Trend (Growth in the last 30 days)
        const alunos30DaysAgo = await this.dashboardDatabase.countActiveAlunosBefore(date30Str, instituicaoId);
        let trendAlunos = 0;
        if (alunos30DaysAgo > 0) {
            trendAlunos = ((alunosAtivos - alunos30DaysAgo) / alunos30DaysAgo) * 100;
        } else if (alunosAtivos > 0) {
            trendAlunos = 100;
        }

        // 2. Preceptores Trend
        const preceptores30DaysAgo = await this.dashboardDatabase.countActivePreceptoresBefore(date30Str, instituicaoId);
        let trendPreceptores = 0;
        if (preceptores30DaysAgo > 0) {
            trendPreceptores = ((preceptores - preceptores30DaysAgo) / preceptores30DaysAgo) * 100;
        } else if (preceptores > 0) {
            trendPreceptores = 100;
        }

        // 3. Presence Trend (Current 30 days vs Previous 30 days)
        const presencasPrevious = await this.dashboardDatabase.getPresencasByRange(date60Str, date30Str, instituicaoId);
        let taxaPresencaPrevious = 0;
        if (presencasPrevious && presencasPrevious.length > 0) {
            const presentesPrev = presencasPrevious.filter(p => p.presente).length;
            taxaPresencaPrevious = (presentesPrev / presencasPrevious.length) * 100;
        }

        const diffPresenca = taxaPresenca - taxaPresencaPrevious;

        const trends = {
            alunos: {
                value: Math.round(trendAlunos * 10) / 10,
                isPositive: trendAlunos >= 0
            },
            preceptores: {
                value: Math.round(trendPreceptores * 10) / 10,
                isPositive: trendPreceptores >= 0
            },
            presenca: {
                value: Math.round(Math.abs(diffPresenca) * 10) / 10,
                isPositive: diffPresenca >= 0
            }
        };

        return {
            alunosAtivos,
            preceptores,
            ambulatorios,
            taxaPresenca: Math.round(taxaPresenca * 10) / 10,
            turmasAtivas,
            inconsistencias,
            diasLetivos,
            horasRegistradas: Math.round(horasRegistradas),
            trends
        };
    }
}
