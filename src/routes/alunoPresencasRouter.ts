import express from "express";
import { AlunoPresencasController } from "../controller/AlunoPresencasController";
import { AlunoPresencasBusiness } from "../business/AlunoPresencasBusiness";
import { AlunoPresencasDatabase } from "../data/AlunoPresencasDatabase";

const alunoPresencasRouter = express.Router();

const alunoPresencasDatabase = new AlunoPresencasDatabase();
const alunoPresencasBusiness = new AlunoPresencasBusiness(alunoPresencasDatabase);
const alunoPresencasController = new AlunoPresencasController(alunoPresencasBusiness);

/**
 * @openapi
 * /api/aluno_presencas:
 *   get:
 *     tags: [AlunoPresencas]
 *     summary: Get all aluno presencas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of aluno presencas
 *   post:
 *     tags: [AlunoPresencas]
 *     summary: Create aluno presenca
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Aluno presenca created
 */
alunoPresencasRouter.get("/", (req, res) => alunoPresencasController.getAll(req, res));
alunoPresencasRouter.post("/", (req, res) => alunoPresencasController.create(req, res));

/**
 * @openapi
 * /api/aluno_presencas/{id}:
 *   patch:
 *     tags: [AlunoPresencas]
 *     summary: Update aluno presenca
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Aluno presenca updated
 *   delete:
 *     tags: [AlunoPresencas]
 *     summary: Delete aluno presenca
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Aluno presenca deleted
 */
alunoPresencasRouter.patch("/:id", (req, res) => alunoPresencasController.update(req, res));
alunoPresencasRouter.delete("/:id", (req, res) => alunoPresencasController.delete(req, res));

export default alunoPresencasRouter;
