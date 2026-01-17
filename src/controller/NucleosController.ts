import { Request, Response } from "express";
import { NucleosBusiness } from "../business/NucleosBusiness";
import { parseQueryParams } from "../utils/paramsParser";

export class NucleosController {
    private nucleosBusiness: NucleosBusiness;

    constructor() {
        this.nucleosBusiness = new NucleosBusiness();
    }

    public getAll = async (req: Request, res: Response) => {
        try {
            const params = parseQueryParams(req.query);
            const result = await this.nucleosBusiness.get(params);
            res.status(200).send({ data: result });
        } catch (error: any) {
            res.status(400).send({ error: error.message });
        }
    }

    public create = async (req: Request, res: Response) => {
        try {
            const result = await this.nucleosBusiness.create(req.body);
            res.status(201).send({ data: result });
        } catch (error: any) {
            res.status(400).send({ error: error.message });
        }
    }

    public update = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const result = await this.nucleosBusiness.update(id as string, req.body);
            res.status(200).send({ data: result });
        } catch (error: any) {
            res.status(400).send({ error: error.message });
        }
    }

    public delete = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            await this.nucleosBusiness.delete(id as string);
            res.status(200).send({ message: "Núcleo deletado com sucesso" });
        } catch (error: any) {
            res.status(400).send({ error: error.message });
        }
    }
}
