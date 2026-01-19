import express from "express";
import { UserInstituicaoController } from "../controller/UserInstituicaoController";
// import { UserInstituicaoBusiness } from "../business/UserInstituicaoBusiness"; // Unused in original
// import { UserInstituicaoDatabase } from "../data/UserInstituicaoDatabase"; // Unused in original

const userInstituicaoRouter = express.Router();

// Original apiRouter.ts instantiated these but didn't pass them to the controller.
// const userInstituicaoDatabase = new UserInstituicaoDatabase();
// const userInstituicaoBusiness = new UserInstituicaoBusiness();
const userInstituicaoController = new UserInstituicaoController();

/**
 * @openapi
 * /api/user_instituicao:
 *   get:
 *     tags: [UserInstituicao]
 *     summary: Get all user instituicao
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user instituicao
 */
userInstituicaoRouter.get("/", (req, res) => userInstituicaoController.get(req, res));

export default userInstituicaoRouter;
