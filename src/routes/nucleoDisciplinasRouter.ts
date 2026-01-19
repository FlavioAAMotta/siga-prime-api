import express from "express";
import { NucleoDisciplinasController } from "../controller/NucleoDisciplinasController";
import { NucleoDisciplinasBusiness } from "../business/NucleoDisciplinasBusiness";
import { NucleoDisciplinasDatabase } from "../data/NucleoDisciplinasDatabase";

const nucleoDisciplinasRouter = express.Router();

const nucleoDisciplinasDatabase = new NucleoDisciplinasDatabase();
const nucleoDisciplinasBusiness = new NucleoDisciplinasBusiness(nucleoDisciplinasDatabase);
const nucleoDisciplinasController = new NucleoDisciplinasController(nucleoDisciplinasBusiness);

/**
 * @openapi
 * /api/nucleo_disciplinas:
 *   get:
 *     tags: [NucleoDisciplinas]
 *     summary: Get all nucleo disciplinas
 *     parameters:
 *       - in: query
 *         name: nucleo_id
 *         schema:
 *           type: string
 *         description: Filter by nucleo_id
 *     responses:
 *       200:
 *         description: List of nucleo disciplinas
 *   post:
 *     tags: [NucleoDisciplinas]
 *     summary: Create nucleo disciplina
 *     responses:
 *       201:
 *         description: Nucleo disciplina created
 */
nucleoDisciplinasRouter.get("/", (req, res) => nucleoDisciplinasController.getAll(req, res));
nucleoDisciplinasRouter.post("/", (req, res) => nucleoDisciplinasController.create(req, res));

/**
 * @openapi
 * /api/nucleo_disciplinas:
 *   delete:
 *     tags: [NucleoDisciplinas]
 *     summary: Delete nucleo disciplina by query params
 *     parameters:
 *       - in: query
 *         name: nucleo_id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Nucleo disciplina deleted
 */
nucleoDisciplinasRouter.delete("/", (req, res) => nucleoDisciplinasController.delete(req, res));

export default nucleoDisciplinasRouter;
