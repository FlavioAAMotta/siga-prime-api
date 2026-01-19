import express from "express";
import { AlunoTurmaPraticaController } from "../controller/AlunoTurmaPraticaController";
import { AlunoTurmaPraticaBusiness } from "../business/AlunoTurmaPraticaBusiness";
import { AlunoTurmaPraticaDatabase } from "../data/AlunoTurmaPraticaDatabase";

const alunoTurmaPraticaRouter = express.Router();

const alunoTurmaPraticaDatabase = new AlunoTurmaPraticaDatabase();
const alunoTurmaPraticaBusiness = new AlunoTurmaPraticaBusiness(alunoTurmaPraticaDatabase);
const alunoTurmaPraticaController = new AlunoTurmaPraticaController(alunoTurmaPraticaBusiness);

/**
 * @openapi
 * /api/aluno_turma_pratica:
 *   get:
 *     tags: [AlunoTurmaPratica]
 *     summary: Get all aluno turma pratica
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of aluno turma pratica
 *   post:
 *     tags: [AlunoTurmaPratica]
 *     summary: Create aluno turma pratica
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Aluno turma pratica created
 */
alunoTurmaPraticaRouter.get("/", (req, res) => alunoTurmaPraticaController.getAll(req, res));
alunoTurmaPraticaRouter.post("/", (req, res) => alunoTurmaPraticaController.create(req, res));

/**
 * @openapi
 * /api/aluno_turma_pratica/{id}:
 *   patch:
 *     tags: [AlunoTurmaPratica]
 *     summary: Update aluno turma pratica
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Aluno turma pratica updated
 *   delete:
 *     tags: [AlunoTurmaPratica]
 *     summary: Delete aluno turma pratica
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Aluno turma pratica deleted
 */
alunoTurmaPraticaRouter.patch("/:id", (req, res) => alunoTurmaPraticaController.update(req, res));
alunoTurmaPraticaRouter.delete("/:id", (req, res) => alunoTurmaPraticaController.delete(req, res));

export default alunoTurmaPraticaRouter;
