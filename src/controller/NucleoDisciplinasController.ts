import { Request, Response } from "express";
import { NucleoDisciplinasBusiness } from "../business/NucleoDisciplinasBusiness";
import { parseQueryParams } from "../utils/paramsParser";

export class NucleoDisciplinasController {
    constructor(
        private nucleoDisciplinasBusiness: NucleoDisciplinasBusiness
    ) { }

    public getAll = async (req: Request, res: Response) => {
        try {
            const params = parseQueryParams(req.query);
            const result = await this.nucleoDisciplinasBusiness.get(params);
            res.status(200).send({ data: result });
        } catch (error: any) {
            res.status(400).send({ error: error.message });
        }
    }

    public create = async (req: Request, res: Response) => {
        try {
            const result = await this.nucleoDisciplinasBusiness.create(req.body);
            res.status(201).send({ data: result });
        } catch (error: any) {
            res.status(400).send({ error: error.message });
        }
    }

    public delete = async (req: Request, res: Response) => {
        try {
            const params = parseQueryParams(req.query);
            await this.nucleoDisciplinasBusiness.delete(params);
            res.status(200).send({ message: "Nucleo disciplina associations deleted" });
        } catch (error: any) {
            res.status(400).send({ error: error.message });
        }
    }
}
