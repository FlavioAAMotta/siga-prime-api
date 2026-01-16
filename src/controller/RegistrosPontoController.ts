import { Request, Response } from "express";
import { RegistrosPontoBusiness } from "../business/RegistrosPontoBusiness";
import { parseQueryParams } from "../utils/paramsParser";

export class RegistrosPontoController {
    constructor(
        private registrosPontoBusiness: RegistrosPontoBusiness
    ) { }

    public getAll = async (req: Request, res: Response) => {
        try {
            const params = parseQueryParams(req.query);
            const result = await this.registrosPontoBusiness.find(params);
            res.status(200).send({ data: result });
        } catch (error: any) {
            res.status(400).send({ error: error.message });
        }
    }

    public create = async (req: Request, res: Response) => {
        try {
            const result = await this.registrosPontoBusiness.create(req.body);
            res.status(201).send({ data: result });
        } catch (error: any) {
            res.status(400).send({ error: error.message });
        }
    }

    public update = async (req: Request, res: Response) => {
        try {
            await this.registrosPontoBusiness.update(req.params.id as string, req.body);
            res.status(200).send({ message: "Updated" });
        } catch (error: any) {
            res.status(400).send({ error: error.message });
        }
    }

    public delete = async (req: Request, res: Response) => {
        try {
            await this.registrosPontoBusiness.delete(req.params.id as string);
            res.status(200).send({ message: "Deleted" });
        } catch (error: any) {
            res.status(400).send({ error: error.message });
        }
    }
}
