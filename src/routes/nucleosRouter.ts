import express from "express";
import { NucleosController } from "../controller/NucleosController";
import { NucleosBusiness } from "../business/NucleosBusiness";
import { NucleosDatabase } from "../data/NucleosDatabase";

const nucleosRouter = express.Router();

// Instantiation missing in original snippet for NucleosController?
// Original: const nucleosController = new NucleosController();
// It seems it might be using default constructor or I missed something.
// I will assume it follows the pattern if possible, but matching original code:
const nucleosController = new NucleosController();

/**
 * @openapi
 * /api/nucleos:
 *   get:
 *     tags: [Nucleos]
 *     summary: Get all nucleos
 *     responses:
 *       200:
 *         description: List of nucleos
 *   post:
 *     tags: [Nucleos]
 *     summary: Create nucleo
 *     responses:
 *       201:
 *         description: Nucleo created
 */
nucleosRouter.get("/", (req, res) => nucleosController.getAll(req, res));
nucleosRouter.post("/", (req, res) => nucleosController.create(req, res));

/**
 * @openapi
 * /api/nucleos/{id}:
 *   patch:
 *     tags: [Nucleos]
 *     summary: Update nucleo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Nucleo updated
 *   delete:
 *     tags: [Nucleos]
 *     summary: Delete nucleo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Nucleo deleted
 */
nucleosRouter.patch("/:id", (req, res) => nucleosController.update(req, res));
nucleosRouter.delete("/:id", (req, res) => nucleosController.delete(req, res));

export default nucleosRouter;
