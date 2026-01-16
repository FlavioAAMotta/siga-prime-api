
import { Request, Response } from "express";
import { UserBusiness } from "../business/UserBusiness";
import { LoginInputDTO, SignupInputDTO } from "../model/User";

export class UserController {
    constructor(
        private userBusiness: UserBusiness
    ) { }

    public signup = async (req: Request, res: Response): Promise<void> => {
        try {
            const input: SignupInputDTO = {
                email: req.body.email,
                password: req.body.password
            };

            await this.userBusiness.signup(input);

            res.status(201).send({ message: "User registered successfully" });
        } catch (error: any) {
            res.status(400).send({ error: error.message });
        }
    }

    public login = async (req: Request, res: Response): Promise<void> => {
        try {
            const input: LoginInputDTO = {
                email: req.body.email,
                password: req.body.password
            };

            const token = await this.userBusiness.login(input);

            res.status(200).send({ token });
        } catch (error: any) {
            res.status(400).send({ error: error.message });
        }
    }

    public getSession = async (req: Request, res: Response): Promise<void> => {
        try {
            const token = req.headers.authorization?.split(" ")[1];

            if (!token) {
                throw new Error("Missing token");
            }

            const user = await this.userBusiness.getSession(token);

            res.status(200).send({ user });
        } catch (error: any) {
            res.status(400).send({ error: error.message });
        }
    }

    public getUserInstitutions = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.params.id as string;
            const institutions = await this.userBusiness.getUserInstitutions(userId);
            res.status(200).send(institutions);
        } catch (error: any) {
            res.status(400).send({ error: error.message });
        }
    }

    public activateUserInstitution = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.params.id as string;
            const { instituicaoId } = req.body;
            await this.userBusiness.activateUserInstitution(userId, instituicaoId);
            res.status(200).send({ message: "Institution activated successfully" });
        } catch (error: any) {
            res.status(400).send({ error: error.message });
        }
    }
}
