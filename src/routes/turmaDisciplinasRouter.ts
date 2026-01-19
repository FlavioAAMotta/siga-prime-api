import express from "express";
import { TurmaDisciplinasController } from "../controller/TurmaDisciplinasController";
import { TurmaDisciplinasBusiness } from "../business/TurmaDisciplinasBusiness";
import { TurmaDisciplinasDatabase } from "../data/TurmaDisciplinasDatabase";

const turmaDisciplinasRouter = express.Router();

const turmaDisciplinasDatabase = new TurmaDisciplinasDatabase();
const turmaDisciplinasBusiness = new TurmaDisciplinasBusiness(turmaDisciplinasDatabase);
const turmaDisciplinasController = new TurmaDisciplinasController(turmaDisciplinasBusiness);

/**
 * @openapi
 * /api/turma_disciplinas:
 *   get:
 *     tags: [TurmaDisciplinas]
 *     summary: Get all turma disciplinas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of turma disciplinas
 *   post:
 *     tags: [TurmaDisciplinas]
 *     summary: Create turma disciplina
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Turma disciplina created
 */
turmaDisciplinasRouter.get("/", (req, res) => turmaDisciplinasController.getAll(req, res));
turmaDisciplinasRouter.post("/", (req, res) => turmaDisciplinasController.create(req, res));

/**
 * @openapi
 * /api/turma_disciplinas/{id}:
 *   patch:
 *     tags: [TurmaDisciplinas]
 *     summary: Update turma disciplina
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Turma disciplina updated
 *   delete:
 *     tags: [TurmaDisciplinas]
 *     summary: Delete turma disciplina
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Turma disciplina deleted
 */
turmaDisciplinasRouter.patch("/:id", (req, res) => turmaDisciplinasController.update(req, res));
turmaDisciplinasRouter.delete("/:id", (req, res) => turmaDisciplinasController.delete(req, res));

export default turmaDisciplinasRouter;
