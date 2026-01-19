import express from "express";
import { AlunosController } from "../controller/AlunosController";
import { AlunosBusiness } from "../business/AlunosBusiness";
import { AlunosDatabase } from "../data/AlunosDatabase";

const alunosRouter = express.Router();

const alunosDatabase = new AlunosDatabase();
const alunosBusiness = new AlunosBusiness(alunosDatabase);
const alunosController = new AlunosController(alunosBusiness);

/**
 * @openapi
 * /api/alunos:
 *   get:
 *     tags: [Alunos]
 *     summary: Get all alunos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: matricula
 *         schema:
 *           type: string
 *         description: Filter by matricula
 *     responses:
 *       200:
 *         description: List of alunos
 *   post:
 *     tags: [Alunos]
 *     summary: Create aluno
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - matricula
 *             properties:
 *               nome:
 *                 type: string
 *               matricula:
 *                 type: string
 *     responses:
 *       201:
 *         description: Aluno created
 */
alunosRouter.get("/", (req, res) => alunosController.getAll(req, res));
alunosRouter.post("/", (req, res) => alunosController.create(req, res));

/**
 * @openapi
 * /api/alunos/{id}:
 *   patch:
 *     tags: [Alunos]
 *     summary: Update aluno
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Aluno updated
 *   delete:
 *     tags: [Alunos]
 *     summary: Delete aluno
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Aluno deleted
 */
alunosRouter.patch("/:id", (req, res) => alunosController.update(req, res));
alunosRouter.delete("/:id", (req, res) => alunosController.delete(req, res));

export default alunosRouter;
