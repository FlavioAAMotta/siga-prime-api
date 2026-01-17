import { Request, Response } from "express";
import { AvaliacoesBusiness } from "../business/AvaliacoesBusiness";
import { parseQueryParams } from "../utils/paramsParser";

export class AvaliacoesController {
    private avaliacoesBusiness: AvaliacoesBusiness;

    constructor() {
        this.avaliacoesBusiness = new AvaliacoesBusiness();
    }

    public getAll = async (req: Request, res: Response) => {
        try {
            const params = parseQueryParams(req.query);
            const result = await this.avaliacoesBusiness.get(params);
            res.status(200).send({ data: result });
        } catch (error: any) {
            res.status(400).send({ error: error.message });
        }
    }

    public create = async (req: Request, res: Response) => {
        try {
            const result = await this.avaliacoesBusiness.create(req.body);
            res.status(201).send({ data: result });
        } catch (error: any) {
            res.status(400).send({ error: error.message });
        }
    }

    public update = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const result = await this.avaliacoesBusiness.update(id as string, req.body);
            res.status(200).send({ data: result });
        } catch (error: any) {
            res.status(400).send({ error: error.message });
        }
    }

    public delete = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            await this.avaliacoesBusiness.delete(id as string);
            res.status(200).send({ message: "Avaliação deletada com sucesso" });
        } catch (error: any) {
            res.status(400).send({ error: error.message });
        }
    }
}
