import { Request, Response } from "express";
import { UserInstituicaoBusiness } from "../business/UserInstituicaoBusiness";
import { parseQueryParams } from "../utils/paramsParser";

export class UserInstituicaoController {
    private userInstituicaoBusiness: UserInstituicaoBusiness;

    constructor() {
        this.userInstituicaoBusiness = new UserInstituicaoBusiness();
    }

    public get = async (req: Request, res: Response) => {
        try {
            const params = parseQueryParams(req.query);
            const result = await this.userInstituicaoBusiness.get(params);
            res.status(200).send({ data: result });
        } catch (error: any) {
            res.status(400).send({ error: error.message });
        }
    }
}
