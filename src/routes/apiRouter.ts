import express from "express";
import { DashboardController } from "../controller/DashboardController";
import { DashboardBusiness } from "../business/DashboardBusiness";
import { DashboardDatabase } from "../data/DashboardDatabase";

import { AlunosController } from "../controller/AlunosController";
import { AlunosBusiness } from "../business/AlunosBusiness";
import { AlunosDatabase } from "../data/AlunosDatabase";

import { PreceptoresController } from "../controller/PreceptoresController";
import { PreceptoresBusiness } from "../business/PreceptoresBusiness";
import { PreceptoresDatabase } from "../data/PreceptoresDatabase";

import { TurmasController } from "../controller/TurmasController";
import { TurmasBusiness } from "../business/TurmasBusiness";
import { TurmasDatabase } from "../data/TurmasDatabase";

import { AmbulatoriosController } from "../controller/AmbulatoriosController";
import { AmbulatoriosBusiness } from "../business/AmbulatoriosBusiness";
import { AmbulatoriosDatabase } from "../data/AmbulatoriosDatabase";

import { DisciplinasController } from "../controller/DisciplinasController";
import { DisciplinasBusiness } from "../business/DisciplinasBusiness";
import { DisciplinasDatabase } from "../data/DisciplinasDatabase";

import { AlunoPresencasController } from "../controller/AlunoPresencasController";
import { AlunoPresencasBusiness } from "../business/AlunoPresencasBusiness";
import { AlunoPresencasDatabase } from "../data/AlunoPresencasDatabase";

import { RegistrosPontoController } from "../controller/RegistrosPontoController";
import { RegistrosPontoBusiness } from "../business/RegistrosPontoBusiness";
import { RegistrosPontoDatabase } from "../data/RegistrosPontoDatabase";

import { TurmaDisciplinasController } from "../controller/TurmaDisciplinasController";
import { TurmaDisciplinasBusiness } from "../business/TurmaDisciplinasBusiness";
import { TurmaDisciplinasDatabase } from "../data/TurmaDisciplinasDatabase";

import { AlunoTurmaPraticaController } from "../controller/AlunoTurmaPraticaController";
import { AlunoTurmaPraticaBusiness } from "../business/AlunoTurmaPraticaBusiness";
import { AlunoTurmaPraticaDatabase } from "../data/AlunoTurmaPraticaDatabase";

import { PreceptorAmbulatorioController } from "../controller/PreceptorAmbulatorioController";
import { PreceptorAmbulatorioBusiness } from "../business/PreceptorAmbulatorioBusiness";
import { PreceptorAmbulatorioDatabase } from "../data/PreceptorAmbulatorioDatabase";

const apiRouter = express.Router();

// Dashboard
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
apiRouter.get("/dashboard/summary", (req, res) => dashboardController.getSummary(req, res));

// Helper to create CRUD routes
const createRoutes = (router: express.Router, path: string, controller: any) => {
    router.get(path, (req, res) => controller.getAll(req, res));
    router.post(path, (req, res) => controller.create(req, res));
    router.patch(`${path}/:id`, (req, res) => controller.update(req, res));
    router.delete(`${path}/:id`, (req, res) => controller.delete(req, res));
};

// Alunos
const alunosDatabase = new AlunosDatabase();
const alunosBusiness = new AlunosBusiness(alunosDatabase);
const alunosController = new AlunosController(alunosBusiness);
/**
 * @openapi
 * /api/alunos:
 *   get:
 *     tags: [Alunos]
 *     summary: Get all alunos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: matricula
 *         schema:
 *           type: string
 *         description: Filter by matricula
 *     responses:
 *       200:
 *         description: List of alunos
 *   post:
 *     tags: [Alunos]
 *     summary: Create aluno
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - matricula
 *             properties:
 *               nome:
 *                 type: string
 *               matricula:
 *                 type: string
 *     responses:
 *       201:
 *         description: Aluno created
 * /api/alunos/{id}:
 *   patch:
 *     tags: [Alunos]
 *     summary: Update aluno
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Aluno updated
 *   delete:
 *     tags: [Alunos]
 *     summary: Delete aluno
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Aluno deleted
 */
createRoutes(apiRouter, "/alunos", alunosController);

// Preceptores
const preceptoresDatabase = new PreceptoresDatabase();
const preceptoresBusiness = new PreceptoresBusiness(preceptoresDatabase);
const preceptoresController = new PreceptoresController(preceptoresBusiness);
/**
 * @openapi
 * /api/preceptores:
 *   get:
 *     tags: [Preceptores]
 *     summary: Get all preceptores
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of preceptores
 *   post:
 *     tags: [Preceptores]
 *     summary: Create preceptor
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Preceptor created
 * /api/preceptores/{id}:
 *   patch:
 *     tags: [Preceptores]
 *     summary: Update preceptor
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Preceptor updated
 *   delete:
 *     tags: [Preceptores]
 *     summary: Delete preceptor
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Preceptor deleted
 */
createRoutes(apiRouter, "/preceptores", preceptoresController);

// Turmas
const turmasDatabase = new TurmasDatabase();
const turmasBusiness = new TurmasBusiness(turmasDatabase);
const turmasController = new TurmasController(turmasBusiness);
/**
 * @openapi
 * /api/turmas:
 *   get:
 *     tags: [Turmas]
 *     summary: Get all turmas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of turmas
 *   post:
 *     tags: [Turmas]
 *     summary: Create turma
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Turma created
 * /api/turmas/{id}:
 *   patch:
 *     tags: [Turmas]
 *     summary: Update turma
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Turma updated
 *   delete:
 *     tags: [Turmas]
 *     summary: Delete turma
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Turma deleted
 */
createRoutes(apiRouter, "/turmas", turmasController);

// Ambulatorios
const ambulatoriosDatabase = new AmbulatoriosDatabase();
const ambulatoriosBusiness = new AmbulatoriosBusiness(ambulatoriosDatabase);
const ambulatoriosController = new AmbulatoriosController(ambulatoriosBusiness);
/**
 * @openapi
 * /api/ambulatorios:
 *   get:
 *     tags: [Ambulatorios]
 *     summary: Get all ambulatorios
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of ambulatorios
 *   post:
 *     tags: [Ambulatorios]
 *     summary: Create ambulatorio
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Ambulatorio created
 * /api/ambulatorios/{id}:
 *   patch:
 *     tags: [Ambulatorios]
 *     summary: Update ambulatorio
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Ambulatorio updated
 *   delete:
 *     tags: [Ambulatorios]
 *     summary: Delete ambulatorio
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Ambulatorio deleted
 */
createRoutes(apiRouter, "/ambulatorios", ambulatoriosController);

// Disciplinas
const disciplinasDatabase = new DisciplinasDatabase();
const disciplinasBusiness = new DisciplinasBusiness(disciplinasDatabase);
const disciplinasController = new DisciplinasController(disciplinasBusiness);
/**
 * @openapi
 * /api/disciplinas:
 *   get:
 *     tags: [Disciplinas]
 *     summary: Get all disciplinas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of disciplinas
 *   post:
 *     tags: [Disciplinas]
 *     summary: Create disciplina
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Disciplina created
 * /api/disciplinas/{id}:
 *   patch:
 *     tags: [Disciplinas]
 *     summary: Update disciplina
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Disciplina updated
 *   delete:
 *     tags: [Disciplinas]
 *     summary: Delete disciplina
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Disciplina deleted
 */
createRoutes(apiRouter, "/disciplinas", disciplinasController);

// Aluno Presencas
const alunoPresencasDatabase = new AlunoPresencasDatabase();
const alunoPresencasBusiness = new AlunoPresencasBusiness(alunoPresencasDatabase);
const alunoPresencasController = new AlunoPresencasController(alunoPresencasBusiness);
/**
 * @openapi
 * /api/aluno_presencas:
 *   get:
 *     tags: [AlunoPresencas]
 *     summary: Get all aluno presencas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of aluno presencas
 *   post:
 *     tags: [AlunoPresencas]
 *     summary: Create aluno presenca
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Aluno presenca created
 * /api/aluno_presencas/{id}:
 *   patch:
 *     tags: [AlunoPresencas]
 *     summary: Update aluno presenca
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Aluno presenca updated
 *   delete:
 *     tags: [AlunoPresencas]
 *     summary: Delete aluno presenca
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Aluno presenca deleted
 */
createRoutes(apiRouter, "/aluno_presencas", alunoPresencasController);

// Registros Ponto
const registrosPontoDatabase = new RegistrosPontoDatabase();
const registrosPontoBusiness = new RegistrosPontoBusiness(registrosPontoDatabase);
const registrosPontoController = new RegistrosPontoController(registrosPontoBusiness);
/**
 * @openapi
 * /api/registros_ponto:
 *   get:
 *     tags: [RegistrosPonto]
 *     summary: Get all registros ponto
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of registros ponto
 *   post:
 *     tags: [RegistrosPonto]
 *     summary: Create registro ponto
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Registro ponto created
 * /api/registros_ponto/{id}:
 *   patch:
 *     tags: [RegistrosPonto]
 *     summary: Update registro ponto
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Registro ponto updated
 *   delete:
 *     tags: [RegistrosPonto]
 *     summary: Delete registro ponto
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Registro ponto deleted
 */
createRoutes(apiRouter, "/registros_ponto", registrosPontoController);

// Turma Disciplinas
const turmaDisciplinasDatabase = new TurmaDisciplinasDatabase();
const turmaDisciplinasBusiness = new TurmaDisciplinasBusiness(turmaDisciplinasDatabase);
const turmaDisciplinasController = new TurmaDisciplinasController(turmaDisciplinasBusiness);
/**
 * @openapi
 * /api/turma_disciplinas:
 *   get:
 *     tags: [TurmaDisciplinas]
 *     summary: Get all turma disciplinas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of turma disciplinas
 *   post:
 *     tags: [TurmaDisciplinas]
 *     summary: Create turma disciplina
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Turma disciplina created
 * /api/turma_disciplinas/{id}:
 *   patch:
 *     tags: [TurmaDisciplinas]
 *     summary: Update turma disciplina
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Turma disciplina updated
 *   delete:
 *     tags: [TurmaDisciplinas]
 *     summary: Delete turma disciplina
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Turma disciplina deleted
 */
createRoutes(apiRouter, "/turma_disciplinas", turmaDisciplinasController);

// Aluno Turma Pratica
const alunoTurmaPraticaDatabase = new AlunoTurmaPraticaDatabase();
const alunoTurmaPraticaBusiness = new AlunoTurmaPraticaBusiness(alunoTurmaPraticaDatabase);
const alunoTurmaPraticaController = new AlunoTurmaPraticaController(alunoTurmaPraticaBusiness);
/**
 * @openapi
 * /api/aluno_turma_pratica:
 *   get:
 *     tags: [AlunoTurmaPratica]
 *     summary: Get all aluno turma pratica
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of aluno turma pratica
 *   post:
 *     tags: [AlunoTurmaPratica]
 *     summary: Create aluno turma pratica
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Aluno turma pratica created
 * /api/aluno_turma_pratica/{id}:
 *   patch:
 *     tags: [AlunoTurmaPratica]
 *     summary: Update aluno turma pratica
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Aluno turma pratica updated
 *   delete:
 *     tags: [AlunoTurmaPratica]
 *     summary: Delete aluno turma pratica
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Aluno turma pratica deleted
 */
createRoutes(apiRouter, "/aluno_turma_pratica", alunoTurmaPraticaController);

// Preceptor Ambulatorio
const preceptorAmbulatorioDatabase = new PreceptorAmbulatorioDatabase();
const preceptorAmbulatorioBusiness = new PreceptorAmbulatorioBusiness(preceptorAmbulatorioDatabase);
const preceptorAmbulatorioController = new PreceptorAmbulatorioController(preceptorAmbulatorioBusiness);
/**
 * @openapi
 * /api/preceptor_ambulatorio:
 *   get:
 *     tags: [PreceptorAmbulatorio]
 *     summary: Get all preceptor ambulatorio
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of preceptor ambulatorio
 *   post:
 *     tags: [PreceptorAmbulatorio]
 *     summary: Create preceptor ambulatorio
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Preceptor ambulatorio created
 * /api/preceptor_ambulatorio/{id}:
 *   patch:
 *     tags: [PreceptorAmbulatorio]
 *     summary: Update preceptor ambulatorio
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Preceptor ambulatorio updated
 *   delete:
 *     tags: [PreceptorAmbulatorio]
 *     summary: Delete preceptor ambulatorio
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Preceptor ambulatorio deleted
 */
createRoutes(apiRouter, "/preceptor_ambulatorio", preceptorAmbulatorioController);

export default apiRouter;
