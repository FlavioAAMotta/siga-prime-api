import express from "express";
import { AvaliacoesController } from "../controller/AvaliacoesController";
// import { AvaliacoesBusiness } from "../business/AvaliacoesBusiness"; // Unused in original
// import { AvaliacoesDatabase } from "../data/AvaliacoesDatabase"; // Unused in original

const avaliacoesRouter = express.Router();

const avaliacoesController = new AvaliacoesController();

/**
 * @openapi
 * /api/avaliacoes:
 *   get:
 *     tags: [Avaliacoes]
 *     summary: Get all avaliacoes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of avaliacoes
 *   post:
 *     tags: [Avaliacoes]
 *     summary: Create avaliacao
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Avaliacao created
 */
avaliacoesRouter.get("/", (req, res) => avaliacoesController.getAll(req, res));
avaliacoesRouter.post("/", (req, res) => avaliacoesController.create(req, res));

/**
 * @openapi
 * /api/avaliacoes/{id}:
 *   patch:
 *     tags: [Avaliacoes]
 *     summary: Update avaliacao
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Avaliacao updated
 *   delete:
 *     tags: [Avaliacoes]
 *     summary: Delete avaliacao
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Avaliacao deleted
 */
avaliacoesRouter.patch("/:id", (req, res) => avaliacoesController.update(req, res));
avaliacoesRouter.delete("/:id", (req, res) => avaliacoesController.delete(req, res));

export default avaliacoesRouter;
