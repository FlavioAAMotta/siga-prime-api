import 'dotenv/config';
import express, { Request, Response } from "express";
import cors from "cors";

import { AddressInfo } from "net";
import connection from "./data/connection";
import apiRouter from "./routes/apiRouter";
import userRouter from "./routes/userRouter";
import instituicaoRouter from "./routes/instituicaoRouter";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/users", userRouter);
app.use("/auth", userRouter);
app.use("/instituicoes", instituicaoRouter);
app.use("/api", apiRouter);

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