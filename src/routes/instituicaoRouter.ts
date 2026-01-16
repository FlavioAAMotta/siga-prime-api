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

/**
 * @openapi
 * /instituicoes:
 *   get:
 *     tags: [Instituicoes]
 *     summary: Get all institutions
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of institutions
 *   post:
 *     tags: [Instituicoes]
 *     summary: Create institution
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *             properties:
 *               nome:
 *                 type: string
 *               sigla:
 *                  type: string
 *     responses:
 *       201:
 *         description: Institution created
 */
instituicaoRouter.get("/", (req, res) => instituicaoController.getAll(req, res));
instituicaoRouter.post("/", (req, res) => instituicaoController.create(req, res));

/**
 * @openapi
 * /instituicoes/{id}:
 *   patch:
 *     tags: [Instituicoes]
 *     summary: Update institution
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Institution updated
 *   delete:
 *     tags: [Instituicoes]
 *     summary: Delete institution
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
 *         description: Institution deleted
 */
instituicaoRouter.patch("/:id", (req, res) => instituicaoController.update(req, res));
instituicaoRouter.delete("/:id", (req, res) => instituicaoController.delete(req, res));

export default instituicaoRouter;
