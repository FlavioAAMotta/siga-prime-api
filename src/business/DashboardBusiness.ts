import { DashboardDatabase } from "../data/DashboardDatabase";

export class DashboardBusiness {
    constructor(
        private dashboardDatabase: DashboardDatabase
    ) { }

    public getSummary = async (): Promise<any> => {
        // Fetch base counts
        const alunosAtivos = await this.dashboardDatabase.countActiveAlunos();
        const preceptores = await this.dashboardDatabase.countActivePreceptores();
        const ambulatorios = await this.dashboardDatabase.countActiveAmbulatorios();
        const turmasAtivas = await this.dashboardDatabase.countActiveTurmas();

        // Calculate presence rate (last 30 days)
        const date30DaysAgo = new Date();
        date30DaysAgo.setDate(date30DaysAgo.getDate() - 30);
        const presencas = await this.dashboardDatabase.getPresencasLastMonth(date30DaysAgo.toISOString().split('T')[0]);

        let taxaPresenca = 0;
        if (presencas && presencas.length > 0) {
            const presentes = presencas.filter(p => p.presente).length;
            taxaPresenca = (presentes / presencas.length) * 100;
        }

        // Calculate registered hours (current month)
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const registrosPonto = await this.dashboardDatabase.getRegistrosPontoCurrentMonth(startOfMonth.toISOString());

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
        const inconsistencias = await this.dashboardDatabase.countInconsistencies(yesterday.toISOString());

        // Days remaining calculation
        const agora = new Date();
        const fimAno = new Date(agora.getFullYear(), 11, 31);
        const diasRestantes = Math.max(0, Math.floor((fimAno.getTime() - agora.getTime()) / (1000 * 60 * 60 * 24)));
        const diasLetivos = Math.min(diasRestantes, 127);

        // Mock trends for now
        const trends = {
            alunos: { value: 5.2, isPositive: true },
            preceptores: { value: 2.1, isPositive: true },
            presenca: { value: Math.round((Math.random() * 5) * 100) / 100, isPositive: taxaPresenca > 85 }
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
