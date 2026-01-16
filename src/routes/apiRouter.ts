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
createRoutes(apiRouter, "/alunos", alunosController);

// Preceptores
const preceptoresDatabase = new PreceptoresDatabase();
const preceptoresBusiness = new PreceptoresBusiness(preceptoresDatabase);
const preceptoresController = new PreceptoresController(preceptoresBusiness);
createRoutes(apiRouter, "/preceptores", preceptoresController);

// Turmas
const turmasDatabase = new TurmasDatabase();
const turmasBusiness = new TurmasBusiness(turmasDatabase);
const turmasController = new TurmasController(turmasBusiness);
createRoutes(apiRouter, "/turmas", turmasController);

// Ambulatorios
const ambulatoriosDatabase = new AmbulatoriosDatabase();
const ambulatoriosBusiness = new AmbulatoriosBusiness(ambulatoriosDatabase);
const ambulatoriosController = new AmbulatoriosController(ambulatoriosBusiness);
createRoutes(apiRouter, "/ambulatorios", ambulatoriosController);

// Disciplinas
const disciplinasDatabase = new DisciplinasDatabase();
const disciplinasBusiness = new DisciplinasBusiness(disciplinasDatabase);
const disciplinasController = new DisciplinasController(disciplinasBusiness);
createRoutes(apiRouter, "/disciplinas", disciplinasController);

// Aluno Presencas
const alunoPresencasDatabase = new AlunoPresencasDatabase();
const alunoPresencasBusiness = new AlunoPresencasBusiness(alunoPresencasDatabase);
const alunoPresencasController = new AlunoPresencasController(alunoPresencasBusiness);
createRoutes(apiRouter, "/aluno_presencas", alunoPresencasController);

// Registros Ponto
const registrosPontoDatabase = new RegistrosPontoDatabase();
const registrosPontoBusiness = new RegistrosPontoBusiness(registrosPontoDatabase);
const registrosPontoController = new RegistrosPontoController(registrosPontoBusiness);
createRoutes(apiRouter, "/registros_ponto", registrosPontoController);

// Turma Disciplinas
const turmaDisciplinasDatabase = new TurmaDisciplinasDatabase();
const turmaDisciplinasBusiness = new TurmaDisciplinasBusiness(turmaDisciplinasDatabase);
const turmaDisciplinasController = new TurmaDisciplinasController(turmaDisciplinasBusiness);
createRoutes(apiRouter, "/turma_disciplinas", turmaDisciplinasController);

// Aluno Turma Pratica
const alunoTurmaPraticaDatabase = new AlunoTurmaPraticaDatabase();
const alunoTurmaPraticaBusiness = new AlunoTurmaPraticaBusiness(alunoTurmaPraticaDatabase);
const alunoTurmaPraticaController = new AlunoTurmaPraticaController(alunoTurmaPraticaBusiness);
createRoutes(apiRouter, "/aluno_turma_pratica", alunoTurmaPraticaController);

// Preceptor Ambulatorio
const preceptorAmbulatorioDatabase = new PreceptorAmbulatorioDatabase();
const preceptorAmbulatorioBusiness = new PreceptorAmbulatorioBusiness(preceptorAmbulatorioDatabase);
const preceptorAmbulatorioController = new PreceptorAmbulatorioController(preceptorAmbulatorioBusiness);
createRoutes(apiRouter, "/preceptor_ambulatorio", preceptorAmbulatorioController);

export default apiRouter;
