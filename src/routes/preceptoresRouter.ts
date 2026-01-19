import express from "express";
import { PreceptoresController } from "../controller/PreceptoresController";
import { PreceptoresBusiness } from "../business/PreceptoresBusiness";
import { PreceptoresDatabase } from "../data/PreceptoresDatabase";

const preceptoresRouter = express.Router();

const preceptoresDatabase = new PreceptoresDatabase();
const preceptoresBusiness = new PreceptoresBusiness(preceptoresDatabase);
const preceptoresController = new PreceptoresController(preceptoresBusiness);

/**
 * @openapi
 * /api/preceptores:
 *   get:
 *     tags: [Preceptores]
 *     summary: Get all preceptores
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of preceptores
 *   post:
 *     tags: [Preceptores]
 *     summary: Create preceptor
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Preceptor created
 */
preceptoresRouter.get("/", (req, res) => preceptoresController.getAll(req, res));
preceptoresRouter.post("/", (req, res) => preceptoresController.create(req, res));

/**
 * @openapi
 * /api/preceptores/{id}:
 *   patch:
 *     tags: [Preceptores]
 *     summary: Update preceptor
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Preceptor updated
 *   delete:
 *     tags: [Preceptores]
 *     summary: Delete preceptor
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Preceptor deleted
 */
preceptoresRouter.patch("/:id", (req, res) => preceptoresController.update(req, res));
preceptoresRouter.delete("/:id", (req, res) => preceptoresController.delete(req, res));

export default preceptoresRouter;
