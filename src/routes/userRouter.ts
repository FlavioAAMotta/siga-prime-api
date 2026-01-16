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

const userBusiness = new UserBusiness(userDatabase, idGenerator, hashManager);
const userController = new UserController(userBusiness);
const authMiddleware = new AuthMiddleware(tokenManager);

userRouter.post("/signup", authMiddleware.handle([USER_ROLES.ADMIN]), (req, res) => userController.signup(req, res));

export default userRouter;
