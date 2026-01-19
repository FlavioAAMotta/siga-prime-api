import express from "express";
import { DisciplinasController } from "../controller/DisciplinasController";
import { DisciplinasBusiness } from "../business/DisciplinasBusiness";
import { DisciplinasDatabase } from "../data/DisciplinasDatabase";

const disciplinasRouter = express.Router();

const disciplinasDatabase = new DisciplinasDatabase();
const disciplinasBusiness = new DisciplinasBusiness(disciplinasDatabase);
const disciplinasController = new DisciplinasController(disciplinasBusiness);

/**
 * @openapi
 * /api/disciplinas:
 *   get:
 *     tags: [Disciplinas]
 *     summary: Get all disciplinas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of disciplinas
 *   post:
 *     tags: [Disciplinas]
 *     summary: Create disciplina
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Disciplina created
 */
disciplinasRouter.get("/", (req, res) => disciplinasController.getAll(req, res));
disciplinasRouter.post("/", (req, res) => disciplinasController.create(req, res));

/**
 * @openapi
 * /api/disciplinas/{id}:
 *   patch:
 *     tags: [Disciplinas]
 *     summary: Update disciplina
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Disciplina updated
 *   delete:
 *     tags: [Disciplinas]
 *     summary: Delete disciplina
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Disciplina deleted
 */
disciplinasRouter.patch("/:id", (req, res) => disciplinasController.update(req, res));
disciplinasRouter.delete("/:id", (req, res) => disciplinasController.delete(req, res));

export default disciplinasRouter;
