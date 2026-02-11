import 'dotenv/config';
import express, { Request, Response } from "express";
import cors from "cors";

import { initDatabase } from './data/connection'; // Importe a nova função
import connection from "./data/connection";
import dashboardRouter from "./routes/dashboardRouter";
import alunosRouter from "./routes/alunosRouter";
import preceptoresRouter from "./routes/preceptoresRouter";
import turmasRouter from "./routes/turmasRouter";
import ambulatoriosRouter from "./routes/ambulatoriosRouter";
import disciplinasRouter from "./routes/disciplinasRouter";
import alunoPresencasRouter from "./routes/alunoPresencasRouter";
import registrosPontoRouter from "./routes/registrosPontoRouter";
import turmaDisciplinasRouter from "./routes/turmaDisciplinasRouter";
import alunoTurmaPraticaRouter from "./routes/alunoTurmaPraticaRouter";
import preceptorAmbulatorioRouter from "./routes/preceptorAmbulatorioRouter";
import userInstituicaoRouter from "./routes/userInstituicaoRouter";
import avaliacoesRouter from "./routes/avaliacoesRouter";
import nucleosRouter from "./routes/nucleosRouter";
import nucleoDisciplinasRouter from "./routes/nucleoDisciplinasRouter";
import coordenadoresRouter from "./routes/coordenadoresRouter";
import userRouter from "./routes/userRouter";
import instituicaoRouter from "./routes/instituicaoRouter";

import swaggerUi from "swagger-ui-express";
import { specs } from "./config/swagger";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(specs);
});

app.use("/users", userRouter);
app.use("/auth", userRouter);
app.use("/instituicoes", instituicaoRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/alunos", alunosRouter);
app.use("/api/preceptores", preceptoresRouter);
app.use("/api/turmas", turmasRouter);
app.use("/api/ambulatorios", ambulatoriosRouter);
app.use("/api/disciplinas", disciplinasRouter);
app.use("/api/aluno_presencas", alunoPresencasRouter);
app.use("/api/registros_ponto", registrosPontoRouter);
app.use("/api/turma_disciplinas", turmaDisciplinasRouter);
app.use("/api/aluno_turma_pratica", alunoTurmaPraticaRouter);
app.use("/api/preceptor_ambulatorio", preceptorAmbulatorioRouter);
app.use("/api/user_instituicao", userInstituicaoRouter);
app.use("/api/avaliacoes", avaliacoesRouter);
app.use("/api/nucleos", nucleosRouter);
app.use("/api/nucleo_disciplinas", nucleoDisciplinasRouter);
app.use("/api/coordenadores", coordenadoresRouter);

// Mock Functions logic defined at root level to match client expectation
app.post("/functions/analyze-recent-activity", (req, res) => {
  res.status(200).send({
    analysis: "### Análise de Atividades Recentes\n\nNesta semana, observamos um **aumento de 15%** na assiduidade dos alunos em ambulatórios de Clínica Médica. A pontualidade média melhorou, com menos registros de atrasos superiores a 10 minutos.\n\nSugestão: Continuar monitorando a turma do 5º período, que apresentou variações na frequência.",
    stats: {
      presencas: 42,
      pontos: 156,
      avaliacoes: 8,
      taxaPresenca: 92
    }
  });
});

app.get("/ping", async (req: Request, res: Response) => {
  try {
    res.send("Pong!");
  } catch (e: any) {
    res.send(e.sqlMessage || e.message);
  }
});

app.get("/db/ping", async (req: Request, res: Response) => {
  try {
    const result = await connection().raw("SELECT 1");
    res.status(200).send({ message: "Pong! DB is running!", result });
  } catch (e: any) {
    res.status(500).send({ message: "Error connecting to DB", error: e.sqlMessage || e.message });
  }
});

const PORT = process.env.PORT || 3000;
const startServer = async () => {
  try {
    // 1. Primeiro inicia o banco (e o túnel)
    await initDatabase();

    // 2. Só depois sobe o servidor
    app.listen(PORT, () => {
      console.log(`🔥 Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Falha fatal ao iniciar servidor:', error);
    process.exit(1);
  }
};

startServer();