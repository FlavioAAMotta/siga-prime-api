import { DashboardDatabase } from "../data/DashboardDatabase";
import { GoogleGenerativeAI } from "@google/generative-ai";

export class AIBusiness {
    constructor(
        private dashboardDatabase: DashboardDatabase
    ) { }

    public analyzeRecentActivity = async (instituicaoId?: string) => {
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            throw new Error("GEMINI_API_KEY is not configured");
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); // gemini-2.0-flash or gemini-1.5-flash

        // Buscar dados das últimas 24 horas
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const now = new Date().toISOString();

        // 1. Presenças
        const presencas = await this.dashboardDatabase.getPresencasByRange(twentyFourHoursAgo, now, instituicaoId);

        // 2. Registros de ponto
        const pontos = await this.dashboardDatabase.getRecentPoints(twentyFourHoursAgo, instituicaoId);

        // 3. Avaliações
        const avaliacoes = await this.dashboardDatabase.getRecentEvaluations(twentyFourHoursAgo, instituicaoId);

        // Preparar dados para análise
        const dataContext = {
            presencas: {
                total: presencas?.length || 0,
                presentes: presencas?.filter(p => p.presente).length || 0,
                ausentes: presencas?.filter(p => !p.presente).length || 0,
                detalhes: presencas?.slice(0, 10).map(p => ({
                    aluno: p.aluno_nome,
                    local: p.ambulatorio_nome,
                    presente: p.presente
                })) || []
            },
            pontos: {
                total: pontos?.length || 0,
                atrasos: pontos?.filter(p => p.status_entrada === "atraso").length || 0,
                pontuais: pontos?.filter(p => p.status_entrada === "pontual").length || 0,
                mediaMinutosAtraso: pontos?.length > 0
                    ? Math.round(pontos.reduce((acc, p) => acc + (p.minutos_atraso_entrada || 0), 0) / pontos.length)
                    : 0,
                detalhes: pontos?.slice(0, 10).map(p => ({
                    preceptor: p.preceptor_nome,
                    local: p.ambulatorio_nome,
                    status: p.status_entrada
                })) || []
            },
            avaliacoes: {
                total: avaliacoes?.length || 0,
                mediaNotas: avaliacoes?.length > 0
                    ? (avaliacoes.reduce((acc, a) => acc + (Number(a.nota) || 0), 0) / avaliacoes.length).toFixed(1)
                    : 0,
                detalhes: avaliacoes?.slice(0, 10).map(a => ({
                    aluno: a.aluno_nome,
                    nota: a.nota
                })) || []
            }
        };

        // Chamada para Gemini
        try {
            const prompt = `Analise estes dados das últimas 24 horas e gere insights relevantes de forma concisa e útil com os principais insights e recomendações:

${JSON.stringify(dataContext, null, 2)}

Regras:
- Use emojis para destacar pontos importantes
- Seja objetivo e direto
- Destaque padrões interessantes ou preocupantes
- Use linguagem profissional mas acessível
- Máximo de 4-5 frases curtas
- Priorize informações ACIONÁVEIS`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const analysis = response.text();

            return {
                analysis,
                stats: {
                    presencas: dataContext.presencas.total,
                    pontos: dataContext.pontos.total,
                    avaliacoes: dataContext.avaliacoes.total,
                    taxaPresenca: dataContext.presencas.total > 0
                        ? Math.round((dataContext.presencas.presentes / dataContext.presencas.total) * 100)
                        : 0
                }
            };
        } catch (error: any) {
            console.error("Gemini error:", error.message);
            throw new Error(`Gemini API error: ${error.message}`);
        }
    }

    public aiAssistant = async (message: string, conversationHistory: any[], instituicaoId?: string) => {
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            throw new Error("GEMINI_API_KEY is not configured");
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        // Buscar dados do banco para contexto
        const contextData = await this.dashboardDatabase.getFullContext(instituicaoId);

        const systemPrompt = `Você é um assistente inteligente para um sistema de gestão acadêmica de medicina. 
Responda em português brasileiro de forma clara e útil. Use os dados abaixo para responder perguntas sobre:
- Desempenho de alunos e preceptores
- Frequências e presenças
- Avaliações e notas
- Estatísticas gerais
- Análises e insights

Seja objetivo e forneça informações específicas baseadas nos dados reais.

DADOS DO SISTEMA:
PRECEPTORES (${contextData.preceptores.length}): ${JSON.stringify(contextData.preceptores)}
ALUNOS (${contextData.alunos.length}): ${JSON.stringify(contextData.alunos)}
PRESENÇAS (${contextData.presencas.length}): ${JSON.stringify(contextData.presencas)}
AVALIAÇÕES (${contextData.avaliacoes.length}): ${JSON.stringify(contextData.avaliacoes)}
AMBULATÓRIOS (${contextData.ambulatorios.length}): ${JSON.stringify(contextData.ambulatorios)}`;

        try {
            const chat = model.startChat({
                history: (conversationHistory || []).slice(-10).map(msg => ({
                    role: msg.role === "assistant" ? "model" : "user",
                    parts: [{ text: msg.content }]
                })),
                generationConfig: {
                    maxOutputTokens: 1000,
                },
            });

            // Adicionando o system prompt como a primeira mensagem se o histórico estiver vazio ou injetando-o de alguma forma
            // No Gemini SDK, o systemInstruction é o modo correto de passar o system prompt
            const modelWithSystemInstruction = genAI.getGenerativeModel({
                model: "gemini-2.0-flash",
                systemInstruction: systemPrompt,
            });

            const chatWithSystem = modelWithSystemInstruction.startChat({
                history: (conversationHistory || []).slice(-10).map(msg => ({
                    role: msg.role === "assistant" ? "model" : "user",
                    parts: [{ text: msg.content }]
                })),
            });

            const result = await chatWithSystem.sendMessage(message);
            const response = await result.response;
            return response.text();
        } catch (error: any) {
            console.error('Gemini assistant error:', error.message);
            throw new Error(`Gemini API error: ${error.message}`);
        }
    }
}
