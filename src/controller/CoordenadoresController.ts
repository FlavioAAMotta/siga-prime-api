import { Request, Response } from "express";
import { CoordenadoresBusiness } from "../business/CoordenadoresBusiness";
import { parseQueryParams } from "../utils/paramsParser";

export class CoordenadoresController {
    private coordenadoresBusiness: CoordenadoresBusiness;

    constructor() {
        this.coordenadoresBusiness = new CoordenadoresBusiness();
    }

    public getAll = async (req: Request, res: Response) => {
        try {
            const params = parseQueryParams(req.query);
            const result = await this.coordenadoresBusiness.get(params);
            res.status(200).send({ data: result });
        } catch (error: any) {
            res.status(400).send({ error: error.message });
        }
    }

    public create = async (req: Request, res: Response) => {
        try {
            const result = await this.coordenadoresBusiness.create(req.body);
            res.status(201).send({ data: result });
        } catch (error: any) {
            res.status(400).send({ error: error.message });
        }
    }

    public update = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const result = await this.coordenadoresBusiness.update(id as string, req.body);
            res.status(200).send({ data: result });
        } catch (error: any) {
            res.status(400).send({ error: error.message });
        }
    }

    public delete = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            await this.coordenadoresBusiness.delete(id as string);
            res.status(200).send({ message: "Coordenador deletado com sucesso" });
        } catch (error: any) {
            res.status(400).send({ error: error.message });
        }
    }

    public createUser = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const result = await this.coordenadoresBusiness.createUser(id as string);
            res.status(200).send({ data: result });
        } catch (error: any) {
            res.status(400).send({ error: error.message });
        }
    }
}
