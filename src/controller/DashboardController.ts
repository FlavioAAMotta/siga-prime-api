import { Request, Response } from "express";
import { DashboardBusiness } from "../business/DashboardBusiness";

export class DashboardController {
    constructor(
        private dashboardBusiness: DashboardBusiness
    ) { }

    public getSummary = async (req: Request, res: Response) => {
        try {
            const instituicaoId = req.headers["x-instituicao-id"] as string | undefined;
            const summary = await this.dashboardBusiness.getSummary(instituicaoId);
            res.status(200).send({ data: summary });
        } catch (error: any) {
            res.status(400).send({ error: error.message });
        }
    }
}
