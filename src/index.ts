import 'dotenv/config';
import express, { Request, Response } from "express";
import cors from "cors";

import { AddressInfo } from "net";
import connection from "./data/connection";
import apiRouter from "./routes/apiRouter";
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
app.use("/api", apiRouter);

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

const server = app.listen(process.env.PORT || 3003, () => {
  if (server) {
    const address = server.address();
    if (address && typeof address !== 'string') {
      console.log(`Server is running in http://localhost:${address.port}`);
    } else {
      console.log(`Server is running on port ${process.env.PORT || 3003}`);
    }
  } else {
    console.error(`Failure upon starting server.`);
  }
});