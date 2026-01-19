import express from "express";
import { RegistrosPontoController } from "../controller/RegistrosPontoController";
import { RegistrosPontoBusiness } from "../business/RegistrosPontoBusiness";
import { RegistrosPontoDatabase } from "../data/RegistrosPontoDatabase";

const registrosPontoRouter = express.Router();

const registrosPontoDatabase = new RegistrosPontoDatabase();
const registrosPontoBusiness = new RegistrosPontoBusiness(registrosPontoDatabase);
const registrosPontoController = new RegistrosPontoController(registrosPontoBusiness);

/**
 * @openapi
 * /api/registros_ponto:
 *   get:
 *     tags: [RegistrosPonto]
 *     summary: Get all registros ponto
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of registros ponto
 *   post:
 *     tags: [RegistrosPonto]
 *     summary: Create registro ponto
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Registro ponto created
 */
registrosPontoRouter.get("/", (req, res) => registrosPontoController.getAll(req, res));
registrosPontoRouter.post("/", (req, res) => registrosPontoController.create(req, res));

/**
 * @openapi
 * /api/registros_ponto/{id}:
 *   patch:
 *     tags: [RegistrosPonto]
 *     summary: Update registro ponto
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Registro ponto updated
 *   delete:
 *     tags: [RegistrosPonto]
 *     summary: Delete registro ponto
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Registro ponto deleted
 */
registrosPontoRouter.patch("/:id", (req, res) => registrosPontoController.update(req, res));
registrosPontoRouter.delete("/:id", (req, res) => registrosPontoController.delete(req, res));

export default registrosPontoRouter;
