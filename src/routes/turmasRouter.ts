import express from "express";
import { TurmasController } from "../controller/TurmasController";
import { TurmasBusiness } from "../business/TurmasBusiness";
import { TurmasDatabase } from "../data/TurmasDatabase";

const turmasRouter = express.Router();

const turmasDatabase = new TurmasDatabase();
const turmasBusiness = new TurmasBusiness(turmasDatabase);
const turmasController = new TurmasController(turmasBusiness);

/**
 * @openapi
 * /api/turmas:
 *   get:
 *     tags: [Turmas]
 *     summary: Get all turmas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of turmas
 *   post:
 *     tags: [Turmas]
 *     summary: Create turma
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Turma created
 */
turmasRouter.get("/", (req, res) => turmasController.getAll(req, res));
turmasRouter.post("/", (req, res) => turmasController.create(req, res));

/**
 * @openapi
 * /api/turmas/{id}:
 *   patch:
 *     tags: [Turmas]
 *     summary: Update turma
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Turma updated
 *   delete:
 *     tags: [Turmas]
 *     summary: Delete turma
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Turma deleted
 */
turmasRouter.patch("/:id", (req, res) => turmasController.update(req, res));
turmasRouter.delete("/:id", (req, res) => turmasController.delete(req, res));

export default turmasRouter;
