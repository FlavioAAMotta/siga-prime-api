import { Request, Response } from "express";
import { InstituicaoBusiness } from "../business/InstituicaoBusiness";
import { CreateInstituicaoInputDTO, UpdateInstituicaoInputDTO } from "../model/Instituicao";
import { BaseDatabase, QueryParams } from "../data/BaseDatabase";

export class InstituicaoController {
    constructor(
        private instituicaoBusiness: InstituicaoBusiness
    ) { }

    public getAll = async (req: Request, res: Response) => {
        try {
            const queryParams: QueryParams = {
                select: req.query.select as string,
                order: req.query.order ? {
                    column: (req.query.order as string).split(' ')[0],
                    dir: (req.query.order as string).split(' ')[1] as 'asc' | 'desc'
                } : undefined,
                limit: req.query.limit ? Number(req.query.limit) : undefined,
                filters: req.query
            };

            // Remove special query params from filters
            delete queryParams.filters?.select;
            delete queryParams.filters?.order;
            delete queryParams.filters?.limit;

            const result = await this.instituicaoBusiness.getAll(queryParams);
            res.status(200).send(result);
        } catch (error: any) {
            res.status(400).send({ error: error.message });
        }
    }

    public create = async (req: Request, res: Response) => {
        try {
            const input: CreateInstituicaoInputDTO = {
                nome: req.body.nome,
                tipo: req.body.tipo,
                ativo: req.body.ativo
            };

            const result = await this.instituicaoBusiness.create(input);
            res.status(201).send(result);
        } catch (error: any) {
            res.status(400).send({ error: error.message });
        }
    }

    public update = async (req: Request, res: Response) => {
        try {
            const id = req.params.id as string;
            const input: UpdateInstituicaoInputDTO = {
                nome: req.body.nome,
                tipo: req.body.tipo,
                ativo: req.body.ativo
            };

            const result = await this.instituicaoBusiness.update(id, input);
            res.status(200).send(result);
        } catch (error: any) {
            res.status(400).send({ error: error.message });
        }
    }

    public delete = async (req: Request, res: Response) => {
        try {
            const id = req.params.id as string;
            await this.instituicaoBusiness.delete(id);
            res.status(200).send({ message: "Instituição excluída com sucesso" });
        } catch (error: any) {
            res.status(400).send({ error: error.message });
        }
    }

    public linkUser = async (req: Request, res: Response) => {
        try {
            const instituicaoId = req.params.id as string;
            const { email } = req.body;

            await this.instituicaoBusiness.linkUser(instituicaoId, email);

            res.status(200).send({ message: "User linked to institution successfully" });
        } catch (error: any) {
            res.status(400).send({ error: error.message });
        }
    }
}
