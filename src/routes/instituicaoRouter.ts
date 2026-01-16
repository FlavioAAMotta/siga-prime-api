import express from "express";
import { InstituicaoController } from "../controller/InstituicaoController";
import { InstituicaoBusiness } from "../business/InstituicaoBusiness";
import { InstituicaoDatabase } from "../data/InstituicaoDatabase";
import { IdGenerator } from "../services/IdGenerator";

const instituicaoRouter = express.Router();

const instituicaoDatabase = new InstituicaoDatabase();
const idGenerator = new IdGenerator();
const instituicaoBusiness = new InstituicaoBusiness(instituicaoDatabase, idGenerator);
const instituicaoController = new InstituicaoController(instituicaoBusiness);

instituicaoRouter.get("/", (req, res) => instituicaoController.getAll(req, res));
instituicaoRouter.post("/", (req, res) => instituicaoController.create(req, res));
instituicaoRouter.patch("/:id", (req, res) => instituicaoController.update(req, res));
instituicaoRouter.delete("/:id", (req, res) => instituicaoController.delete(req, res));

export default instituicaoRouter;
