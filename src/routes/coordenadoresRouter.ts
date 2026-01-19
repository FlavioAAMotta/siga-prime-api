import express from "express";
import { CoordenadoresController } from "../controller/CoordenadoresController";
import { CoordenadoresBusiness } from "../business/CoordenadoresBusiness";
import { CoordenadoresDatabase } from "../data/CoordenadoresDatabase";

const coordenadoresRouter = express.Router();

const coordenadoresController = new CoordenadoresController();

/**
 * @openapi
 * /api/coordenadores:
 *   get:
 *     tags: [Coordenadores]
 *     summary: Get all coordenadores
 *     responses:
 *       200:
 *         description: List of coordenadores
 *   post:
 *     tags: [Coordenadores]
 *     summary: Create coordenador
 *     responses:
 *       201:
 *         description: Coordenador created
 */
coordenadoresRouter.get("/", (req, res) => coordenadoresController.getAll(req, res));
coordenadoresRouter.post("/", (req, res) => coordenadoresController.create(req, res));

/**
 * @openapi
 * /api/coordenadores/{id}:
 *   patch:
 *     tags: [Coordenadores]
 *     summary: Update coordenador
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Coordenador updated
 *   delete:
 *     tags: [Coordenadores]
 *     summary: Delete coordenador
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Coordenador deleted
 */
coordenadoresRouter.patch("/:id", (req, res) => coordenadoresController.update(req, res));
coordenadoresRouter.delete("/:id", (req, res) => coordenadoresController.delete(req, res));

// User creation route for coordinators
coordenadoresRouter.post("/:id/user", (req, res) => coordenadoresController.createUser(req, res));

export default coordenadoresRouter;
