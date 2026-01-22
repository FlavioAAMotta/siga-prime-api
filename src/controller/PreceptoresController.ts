import { Request, Response } from "express";
import { PreceptoresBusiness } from "../business/PreceptoresBusiness";
import { parseQueryParams } from "../utils/paramsParser";

export class PreceptoresController {
    constructor(
        private preceptoresBusiness: PreceptoresBusiness
    ) { }

    public getAll = async (req: Request, res: Response) => {
        try {
            const params = parseQueryParams(req.query);
            const result = await this.preceptoresBusiness.find(params);
            if (!result) {
                throw new Error("Preceptores not found");
            }
            res.status(200).send({ data: result });
        } catch (error: any) {
            if (error.message === "Preceptores not found") {
                res.status(404).send({ error: error.message });
                return;
            }
            res.status(400).send({ error: error.message });
        }
    }

    public create = async (req: Request, res: Response) => {
        try {
            const result = await this.preceptoresBusiness.create(req.body);
            res.status(201).send({ data: result });
        } catch (error: any) {
            if (error.message === "User with this email already exists") {
                res.status(409).send({ error: error.message });
                return;
            }
            res.status(400).send({ error: error.message });
        }
    }



    public update = async (req: Request, res: Response) => {
        try {
            await this.preceptoresBusiness.update(req.params.id as string, req.body);
            res.status(200).send({ message: "Updated" });
        } catch (error: any) {
            if (error.message === "Preceptor not found") {
                res.status(404).send({ error: error.message });
                return;
            }
            res.status(400).send({ error: error.message });
        }
    }

    public resetPassword = async (req: Request, res: Response) => {
        try {
            const id = req.params.id as string;
            const result = await this.preceptoresBusiness.resetPassword(id);
            res.status(200).send(result);
        } catch (error: any) {
            res.status(400).send({ error: error.message });
        }
    }

    public delete = async (req: Request, res: Response) => {
        try {
            await this.preceptoresBusiness.delete(req.params.id as string);
            res.status(200).send({ message: "Deleted" });
        } catch (error: any) {
            res.status(400).send({ error: error.message });
        }
    }
}
