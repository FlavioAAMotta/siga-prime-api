import express from "express";
import { AmbulatoriosController } from "../controller/AmbulatoriosController";
import { AmbulatoriosBusiness } from "../business/AmbulatoriosBusiness";
import { AmbulatoriosDatabase } from "../data/AmbulatoriosDatabase";

const ambulatoriosRouter = express.Router();

const ambulatoriosDatabase = new AmbulatoriosDatabase();
const ambulatoriosBusiness = new AmbulatoriosBusiness(ambulatoriosDatabase);
const ambulatoriosController = new AmbulatoriosController(ambulatoriosBusiness);

/**
 * @openapi
 * /api/ambulatorios:
 *   get:
 *     tags: [Ambulatorios]
 *     summary: Get all ambulatorios
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of ambulatorios
 *   post:
 *     tags: [Ambulatorios]
 *     summary: Create ambulatorio
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Ambulatorio created
 */
ambulatoriosRouter.get("/", (req, res) => ambulatoriosController.getAll(req, res));
ambulatoriosRouter.post("/", (req, res) => ambulatoriosController.create(req, res));

/**
 * @openapi
 * /api/ambulatorios/{id}:
 *   patch:
 *     tags: [Ambulatorios]
 *     summary: Update ambulatorio
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Ambulatorio updated
 *   delete:
 *     tags: [Ambulatorios]
 *     summary: Delete ambulatorio
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Ambulatorio deleted
 */
ambulatoriosRouter.patch("/:id", (req, res) => ambulatoriosController.update(req, res));
ambulatoriosRouter.delete("/:id", (req, res) => ambulatoriosController.delete(req, res));

export default ambulatoriosRouter;
