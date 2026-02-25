import express from "express";
import { CoordenadoresController } from "../controller/CoordenadoresController";
import { CoordenadoresBusiness } from "../business/CoordenadoresBusiness";
import { CoordenadoresDatabase } from "../data/CoordenadoresDatabase";
import { UserDatabase } from "../data/UserDatabase";
import { IdGenerator } from "../services/IdGenerator";
import { HashManager } from "../services/HashManager";

const coordenadoresRouter = express.Router();

const coordenadoresDatabase = new CoordenadoresDatabase();
const userDatabase = new UserDatabase();
const idGenerator = new IdGenerator();
const hashManager = new HashManager();

const coordenadoresBusiness = new CoordenadoresBusiness(
    coordenadoresDatabase,
    userDatabase,
    idGenerator,
    hashManager
);

const coordenadoresController = new CoordenadoresController(coordenadoresBusiness);

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
