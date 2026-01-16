import 'dotenv/config';
import express, { Request, Response } from "express";
import cors from "cors";

import { AddressInfo } from "net";
import connection from "./data/connection";

const app = express();

app.use(express.json());
app.use(cors());

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
    const address = server.address() as AddressInfo;
    console.log(`Server is running in http://localhost:${address.port}`);
  } else {
    console.error(`Failure upon starting server.`);
  }
});