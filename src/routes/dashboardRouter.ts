import express from "express";
import { DashboardController } from "../controller/DashboardController";
import { DashboardBusiness } from "../business/DashboardBusiness";
import { DashboardDatabase } from "../data/DashboardDatabase";

const dashboardRouter = express.Router();

const dashboardDatabase = new DashboardDatabase();
const dashboardBusiness = new DashboardBusiness(dashboardDatabase);
const dashboardController = new DashboardController(dashboardBusiness);

/**
 * @openapi
 * /api/dashboard/summary:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get dashboard summary
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard summary data
 */
dashboardRouter.get("/summary", (req, res) => dashboardController.getSummary(req, res));

export default dashboardRouter;
