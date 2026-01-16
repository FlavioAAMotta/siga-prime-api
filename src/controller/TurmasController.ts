import { Request, Response } from "express";
import { TurmasBusiness } from "../business/TurmasBusiness";
import { parseQueryParams } from "../utils/paramsParser";

export class TurmasController {
    constructor(
        private turmasBusiness: TurmasBusiness
    ) { }

    public getAll = async (req: Request, res: Response) => {
        try {
            const params = parseQueryParams(req.query);
            const result = await this.turmasBusiness.find(params);
            res.status(200).send({ data: result });
        } catch (error: any) {
            res.status(400).send({ error: error.message });
        }
    }

    public create = async (req: Request, res: Response) => {
        try {
            const result = await this.turmasBusiness.create(req.body);
            res.status(201).send({ data: result });
        } catch (error: any) {
            res.status(400).send({ error: error.message });
        }
    }

    public update = async (req: Request, res: Response) => {
        try {
            await this.turmasBusiness.update(req.params.id as string, req.body);
            res.status(200).send({ message: "Updated" });
        } catch (error: any) {
            res.status(400).send({ error: error.message });
        }
    }

    public delete = async (req: Request, res: Response) => {
        try {
            await this.turmasBusiness.delete(req.params.id as string);
            res.status(200).send({ message: "Deleted" });
        } catch (error: any) {
            res.status(400).send({ error: error.message });
        }
    }
}
