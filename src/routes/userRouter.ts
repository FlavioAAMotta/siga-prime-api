import express from "express";
import { UserController } from "../controller/UserController";
import { UserBusiness } from "../business/UserBusiness";
import { UserDatabase } from "../data/UserDatabase";
import { IdGenerator } from "../services/IdGenerator";
import { HashManager } from "../services/HashManager";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { TokenManager, USER_ROLES } from "../services/TokenManager";

const userRouter = express.Router();

const userDatabase = new UserDatabase();
const idGenerator = new IdGenerator();
const hashManager = new HashManager();
const tokenManager = new TokenManager();

const userBusiness = new UserBusiness(userDatabase, idGenerator, hashManager, tokenManager);
const userController = new UserController(userBusiness);
const authMiddleware = new AuthMiddleware(tokenManager);

/**
 * @openapi
 * /users/signup:
 *   post:
 *     tags: [Users]
 *     summary: Register a new user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Bad request
 */
userRouter.post("/signup", (req, res) => userController.signup(req, res));

/**
 * @openapi
 * /users/login:
 *   post:
 *     tags: [Users]
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Invalid credentials
 */
userRouter.post("/login", (req, res) => userController.login(req, res));

/**
 * @openapi
 * /users/session:
 *   get:
 *     tags: [Users]
 *     summary: Get current session user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user session
 */
userRouter.get("/session", (req, res) => userController.getSession(req, res));

/**
 * @openapi
 * /users/{id}/instituicoes:
 *   get:
 *     tags: [Users]
 *     summary: Get user institutions
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
 *         description: List of user institutions
 */
userRouter.get("/:id/instituicoes", (req, res) => userController.getUserInstitutions(req, res));

/**
 * @openapi
 * /users/{id}/instituicoes/activate:
 *   patch:
 *     tags: [Users]
 *     summary: Activate user institution
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
 *         description: Institution activated
 */
userRouter.patch("/:id/instituicoes/activate", (req, res) => userController.activateUserInstitution(req, res));

export default userRouter;
