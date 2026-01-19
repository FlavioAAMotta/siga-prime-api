import express from "express";
import { PreceptorAmbulatorioController } from "../controller/PreceptorAmbulatorioController";
import { PreceptorAmbulatorioBusiness } from "../business/PreceptorAmbulatorioBusiness";
import { PreceptorAmbulatorioDatabase } from "../data/PreceptorAmbulatorioDatabase";

const preceptorAmbulatorioRouter = express.Router();

const preceptorAmbulatorioDatabase = new PreceptorAmbulatorioDatabase();
const preceptorAmbulatorioBusiness = new PreceptorAmbulatorioBusiness(preceptorAmbulatorioDatabase);
const preceptorAmbulatorioController = new PreceptorAmbulatorioController(preceptorAmbulatorioBusiness);

/**
 * @openapi
 * /api/preceptor_ambulatorio:
 *   get:
 *     tags: [PreceptorAmbulatorio]
 *     summary: Get all preceptor ambulatorio
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of preceptor ambulatorio
 *   post:
 *     tags: [PreceptorAmbulatorio]
 *     summary: Create preceptor ambulatorio
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Preceptor ambulatorio created
 */
preceptorAmbulatorioRouter.get("/", (req, res) => preceptorAmbulatorioController.getAll(req, res));
preceptorAmbulatorioRouter.post("/", (req, res) => preceptorAmbulatorioController.create(req, res));

/**
 * @openapi
 * /api/preceptor_ambulatorio/{id}:
 *   patch:
 *     tags: [PreceptorAmbulatorio]
 *     summary: Update preceptor ambulatorio
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Preceptor ambulatorio updated
 *   delete:
 *     tags: [PreceptorAmbulatorio]
 *     summary: Delete preceptor ambulatorio
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Preceptor ambulatorio deleted
 */
preceptorAmbulatorioRouter.patch("/:id", (req, res) => preceptorAmbulatorioController.update(req, res));
preceptorAmbulatorioRouter.delete("/:id", (req, res) => preceptorAmbulatorioController.delete(req, res));

export default preceptorAmbulatorioRouter;
