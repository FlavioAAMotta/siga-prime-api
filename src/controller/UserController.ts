
import { Request, Response } from "express";
import { UserBusiness } from "../business/UserBusiness";
import { SignupInputDTO } from "../model/User";

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
}
