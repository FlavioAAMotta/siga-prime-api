-- Desabilita verificação de chaves estrangeiras temporariamente para criar as tabelas fora de ordem
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------------------------------------------
-- Tabela Mock para Simular auth.users (Supabase/Postgres)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  email VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

-- ----------------------------------------------------------------
-- Tabela: instituicoes
-- ----------------------------------------------------------------
CREATE TABLE instituicoes (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  nome TEXT NOT NULL,
  tipo ENUM('producao', 'teste') NOT NULL DEFAULT 'producao',
  ativo TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

-- ----------------------------------------------------------------
-- Tabela: nucleos
-- ----------------------------------------------------------------
CREATE TABLE nucleos (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  nome VARCHAR(255) NOT NULL UNIQUE,
  descricao TEXT,
  ativo TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  instituicao_id CHAR(36),
  PRIMARY KEY (id),
  CONSTRAINT nucleos_instituicao_id_fkey FOREIGN KEY (instituicao_id) REFERENCES instituicoes(id)
);

-- ----------------------------------------------------------------
-- Tabela: coordenadores
-- ----------------------------------------------------------------
CREATE TABLE coordenadores (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  nome TEXT NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  telefone TEXT,
  cpf TEXT,
  ativo TINYINT(1) NOT NULL DEFAULT 1,
  observacoes TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  nucleo_id CHAR(36),
  instituicao_id CHAR(36),
  PRIMARY KEY (id),
  CONSTRAINT coordenadores_nucleo_id_fkey FOREIGN KEY (nucleo_id) REFERENCES nucleos(id),
  CONSTRAINT coordenadores_instituicao_id_fkey FOREIGN KEY (instituicao_id) REFERENCES instituicoes(id)
);

-- ----------------------------------------------------------------
-- Tabela: coordenador_users
-- ----------------------------------------------------------------
CREATE TABLE coordenador_users (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL,
  coordenador_id CHAR(36) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT coordenador_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT coordenador_users_coordenador_id_fkey FOREIGN KEY (coordenador_id) REFERENCES coordenadores(id)
);

-- ----------------------------------------------------------------
-- Tabela: disciplinas
-- ----------------------------------------------------------------
CREATE TABLE disciplinas (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  nome TEXT NOT NULL,
  codigo VARCHAR(255) UNIQUE,
  descricao TEXT,
  carga_horaria INTEGER,
  ativo TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  data_inicio DATE,
  data_fim DATE,
  periodo_numero INTEGER,
  instituicao_id CHAR(36),
  PRIMARY KEY (id),
  CONSTRAINT disciplinas_instituicao_id_fkey FOREIGN KEY (instituicao_id) REFERENCES instituicoes(id)
);

-- ----------------------------------------------------------------
-- Tabela: nucleo_disciplinas
-- ----------------------------------------------------------------
CREATE TABLE nucleo_disciplinas (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  nucleo_id CHAR(36) NOT NULL,
  disciplina_id CHAR(36) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT nucleo_disciplinas_nucleo_id_fkey FOREIGN KEY (nucleo_id) REFERENCES nucleos(id),
  CONSTRAINT nucleo_disciplinas_disciplina_id_fkey FOREIGN KEY (disciplina_id) REFERENCES disciplinas(id)
);

-- ----------------------------------------------------------------
-- Tabela: ambulatorios
-- ----------------------------------------------------------------
CREATE TABLE ambulatorios (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  nome TEXT NOT NULL,
  localizacao TEXT,
  capacidade INTEGER DEFAULT 1,
  ativo TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  disciplina_id CHAR(36) NOT NULL,
  instituicao_id CHAR(36),
  PRIMARY KEY (id),
  CONSTRAINT ambulatorios_disciplina_id_fkey FOREIGN KEY (disciplina_id) REFERENCES disciplinas(id),
  CONSTRAINT ambulatorios_instituicao_id_fkey FOREIGN KEY (instituicao_id) REFERENCES instituicoes(id)
);

-- ----------------------------------------------------------------
-- Tabela: turmas
-- ----------------------------------------------------------------
CREATE TABLE turmas (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  nome TEXT NOT NULL,
  tipo VARCHAR(50) NOT NULL, -- Convertido de USER-DEFINED
  turma_periodo_id CHAR(36),
  periodo_letivo TEXT,
  ano INTEGER,
  semestre INTEGER CHECK (semestre IN (1, 2)),
  capacidade INTEGER DEFAULT 1,
  ativo TINYINT(1) NOT NULL DEFAULT 1,
  observacoes TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  instituicao_id CHAR(36),
  PRIMARY KEY (id),
  CONSTRAINT turmas_turma_periodo_id_fkey FOREIGN KEY (turma_periodo_id) REFERENCES turmas(id),
  CONSTRAINT turmas_instituicao_id_fkey FOREIGN KEY (instituicao_id) REFERENCES instituicoes(id)
);

-- ----------------------------------------------------------------
-- Tabela: turma_disciplinas
-- ----------------------------------------------------------------
CREATE TABLE turma_disciplinas (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  turma_id CHAR(36) NOT NULL,
  disciplina_id CHAR(36) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT turma_disciplinas_turma_id_fkey FOREIGN KEY (turma_id) REFERENCES turmas(id),
  CONSTRAINT turma_disciplinas_disciplina_id_fkey FOREIGN KEY (disciplina_id) REFERENCES disciplinas(id)
);

-- ----------------------------------------------------------------
-- Tabela: alunos
-- ----------------------------------------------------------------
CREATE TABLE alunos (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  nome TEXT NOT NULL,
  matricula VARCHAR(255) NOT NULL UNIQUE,
  email TEXT,
  telefone TEXT,
  cpf TEXT,
  data_nascimento DATE,
  turma_id CHAR(36),
  periodo INTEGER,
  ativo TINYINT(1) NOT NULL DEFAULT 1,
  observacoes TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  semestre_ingresso TEXT,
  instituicao_id CHAR(36),
  PRIMARY KEY (id),
  CONSTRAINT alunos_turma_id_fkey FOREIGN KEY (turma_id) REFERENCES turmas(id),
  CONSTRAINT alunos_instituicao_id_fkey FOREIGN KEY (instituicao_id) REFERENCES instituicoes(id)
);

-- ----------------------------------------------------------------
-- Tabela: aluno_users
-- ----------------------------------------------------------------
CREATE TABLE aluno_users (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL,
  aluno_id CHAR(36) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT aluno_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT aluno_users_aluno_id_fkey FOREIGN KEY (aluno_id) REFERENCES alunos(id)
);

-- ----------------------------------------------------------------
-- Tabela: aluno_disciplina
-- ----------------------------------------------------------------
CREATE TABLE aluno_disciplina (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  aluno_id CHAR(36) NOT NULL,
  disciplina_id CHAR(36) NOT NULL,
  turma_pratica_id CHAR(36),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT aluno_disciplina_aluno_id_fkey FOREIGN KEY (aluno_id) REFERENCES alunos(id),
  CONSTRAINT aluno_disciplina_disciplina_id_fkey FOREIGN KEY (disciplina_id) REFERENCES disciplinas(id),
  CONSTRAINT aluno_disciplina_turma_pratica_id_fkey FOREIGN KEY (turma_pratica_id) REFERENCES turmas(id)
);

-- ----------------------------------------------------------------
-- Tabela: aluno_turma_pratica
-- ----------------------------------------------------------------
CREATE TABLE aluno_turma_pratica (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  aluno_id CHAR(36) NOT NULL,
  turma_pratica_id CHAR(36) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT aluno_turma_pratica_aluno_id_fkey FOREIGN KEY (aluno_id) REFERENCES alunos(id),
  CONSTRAINT aluno_turma_pratica_turma_pratica_id_fkey FOREIGN KEY (turma_pratica_id) REFERENCES turmas(id)
);

-- ----------------------------------------------------------------
-- Tabela: preceptores
-- ----------------------------------------------------------------
CREATE TABLE preceptores (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  nome TEXT NOT NULL,
  crm TEXT,
  email TEXT,
  telefone TEXT,
  ativo TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  usuario VARCHAR(255) UNIQUE,
  especialidade TEXT,
  instituicao_id CHAR(36),
  PRIMARY KEY (id),
  CONSTRAINT preceptores_instituicao_id_fkey FOREIGN KEY (instituicao_id) REFERENCES instituicoes(id)
);

-- ----------------------------------------------------------------
-- Tabela: preceptor_users
-- ----------------------------------------------------------------
CREATE TABLE preceptor_users (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL UNIQUE,
  preceptor_id CHAR(36) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT preceptor_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT preceptor_users_preceptor_id_fkey FOREIGN KEY (preceptor_id) REFERENCES preceptores(id)
);

-- ----------------------------------------------------------------
-- Tabela: preceptor_disciplina
-- ----------------------------------------------------------------
CREATE TABLE preceptor_disciplina (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  preceptor_id CHAR(36) NOT NULL,
  disciplina_id CHAR(36) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

-- ----------------------------------------------------------------
-- Tabela: preceptor_ambulatorio
-- ----------------------------------------------------------------
CREATE TABLE preceptor_ambulatorio (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  preceptor_id CHAR(36) NOT NULL,
  ambulatorio_id CHAR(36) NOT NULL,
  dia_semana INTEGER,
  horario_inicio TIME,
  horario_fim TIME,
  turma TEXT,
  periodo TEXT,
  ativo TINYINT(1) NOT NULL DEFAULT 1,
  observacoes TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  data_inicio DATE,
  data_fim DATE,
  disciplina_id CHAR(36),
  PRIMARY KEY (id),
  CONSTRAINT preceptor_ambulatorio_preceptor_id_fkey FOREIGN KEY (preceptor_id) REFERENCES preceptores(id),
  CONSTRAINT preceptor_ambulatorio_ambulatorio_id_fkey FOREIGN KEY (ambulatorio_id) REFERENCES ambulatorios(id),
  CONSTRAINT preceptor_ambulatorio_disciplina_id_fkey FOREIGN KEY (disciplina_id) REFERENCES disciplinas(id)
);

-- ----------------------------------------------------------------
-- Tabela: aluno_escalas
-- ----------------------------------------------------------------
CREATE TABLE aluno_escalas (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  aluno_id CHAR(36) NOT NULL,
  preceptor_id CHAR(36) NOT NULL,
  ambulatorio_id CHAR(36) NOT NULL,
  dia_semana INTEGER NOT NULL CHECK (dia_semana >= 0 AND dia_semana <= 6),
  horario_inicio TIME NOT NULL,
  horario_fim TIME NOT NULL,
  data_inicio DATE NOT NULL,
  data_fim DATE,
  ativo TINYINT(1) NOT NULL DEFAULT 1,
  observacoes TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT aluno_escalas_aluno_id_fkey FOREIGN KEY (aluno_id) REFERENCES alunos(id),
  CONSTRAINT aluno_escalas_preceptor_id_fkey FOREIGN KEY (preceptor_id) REFERENCES preceptores(id),
  CONSTRAINT aluno_escalas_ambulatorio_id_fkey FOREIGN KEY (ambulatorio_id) REFERENCES ambulatorios(id)
);

-- ----------------------------------------------------------------
-- Tabela: aluno_presencas
-- ----------------------------------------------------------------
CREATE TABLE aluno_presencas (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  aluno_id CHAR(36) NOT NULL,
  preceptor_id CHAR(36) NOT NULL,
  ambulatorio_id CHAR(36) NOT NULL,
  data_presenca DATE NOT NULL DEFAULT (CURRENT_DATE),
  presente TINYINT(1) NOT NULL DEFAULT 0,
  observacoes TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  escala_id CHAR(36),
  PRIMARY KEY (id),
  CONSTRAINT aluno_presencas_aluno_id_fkey FOREIGN KEY (aluno_id) REFERENCES alunos(id),
  CONSTRAINT aluno_presencas_preceptor_id_fkey FOREIGN KEY (preceptor_id) REFERENCES preceptores(id),
  CONSTRAINT aluno_presencas_ambulatorio_id_fkey FOREIGN KEY (ambulatorio_id) REFERENCES ambulatorios(id),
  CONSTRAINT aluno_presencas_escala_id_fkey FOREIGN KEY (escala_id) REFERENCES preceptor_ambulatorio(id)
);

-- ----------------------------------------------------------------
-- Tabela: aluno_registros_ponto
-- ----------------------------------------------------------------
CREATE TABLE aluno_registros_ponto (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  aluno_id CHAR(36) NOT NULL,
  escala_id CHAR(36),
  ambulatorio_id CHAR(36) NOT NULL,
  preceptor_id CHAR(36) NOT NULL,
  data_entrada DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  data_saida DATETIME,
  horario_programado_inicio TIME,
  horario_programado_fim TIME,
  status_entrada TEXT, -- Default logic should be handled by app or Trigger if complex
  status_saida TEXT,
  minutos_atraso_entrada INTEGER DEFAULT 0,
  minutos_diferenca_saida INTEGER DEFAULT 0,
  numero_atendimentos INTEGER,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  localizacao_endereco TEXT,
  observacoes TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT aluno_registros_ponto_aluno_id_fkey FOREIGN KEY (aluno_id) REFERENCES alunos(id),
  CONSTRAINT aluno_registros_ponto_ambulatorio_id_fkey FOREIGN KEY (ambulatorio_id) REFERENCES ambulatorios(id),
  CONSTRAINT aluno_registros_ponto_preceptor_id_fkey FOREIGN KEY (preceptor_id) REFERENCES preceptores(id)
);

-- ----------------------------------------------------------------
-- Tabela: avaliacoes
-- ----------------------------------------------------------------
CREATE TABLE avaliacoes (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  aluno_id CHAR(36) NOT NULL,
  preceptor_id CHAR(36) NOT NULL,
  ambulatorio_id CHAR(36) NOT NULL,
  data_avaliacao DATE NOT NULL DEFAULT (CURRENT_DATE),
  tipo_avaliacao TEXT NOT NULL, -- Padrão removido aqui, defina na aplicação
  nota DECIMAL(4, 2) CHECK (nota >= 0 AND nota <= 10),
  observacoes TEXT,
  criterios JSON,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  escala_id CHAR(36),
  PRIMARY KEY (id),
  CONSTRAINT avaliacoes_aluno_id_fkey FOREIGN KEY (aluno_id) REFERENCES alunos(id),
  CONSTRAINT avaliacoes_escala_id_fkey FOREIGN KEY (escala_id) REFERENCES preceptor_ambulatorio(id)
);

-- ----------------------------------------------------------------
-- Tabela: preceptor_checkins
-- ----------------------------------------------------------------
CREATE TABLE preceptor_checkins (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  preceptor_id CHAR(36) NOT NULL,
  ambulatorio_id CHAR(36) NOT NULL,
  data_checkin DATE NOT NULL DEFAULT (CURRENT_DATE),
  horario_checkin TIME,
  horario_checkout TIME,
  status ENUM('presente', 'ausente', 'atestado') NOT NULL DEFAULT 'presente',
  observacoes TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT preceptor_checkins_preceptor_id_fkey FOREIGN KEY (preceptor_id) REFERENCES preceptores(id),
  CONSTRAINT preceptor_checkins_ambulatorio_id_fkey FOREIGN KEY (ambulatorio_id) REFERENCES ambulatorios(id)
);

-- ----------------------------------------------------------------
-- Tabela: registros_ponto
-- ----------------------------------------------------------------
CREATE TABLE registros_ponto (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  preceptor_id CHAR(36) NOT NULL,
  ambulatorio_id CHAR(36) NOT NULL,
  data_entrada DATETIME NOT NULL,
  data_saida DATETIME,
  horario_programado_inicio TIME,
  horario_programado_fim TIME,
  observacoes TEXT,
  status_entrada ENUM('pontual', 'atraso', 'adiantado') DEFAULT 'pontual',
  status_saida ENUM('pontual', 'antecipado', 'atraso'),
  minutos_atraso_entrada INTEGER DEFAULT 0,
  minutos_diferenca_saida INTEGER DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  localizacao_endereco TEXT,
  numero_consultas INTEGER,
  PRIMARY KEY (id),
  CONSTRAINT registros_ponto_preceptor_id_fkey FOREIGN KEY (preceptor_id) REFERENCES preceptores(id),
  CONSTRAINT registros_ponto_ambulatorio_id_fkey FOREIGN KEY (ambulatorio_id) REFERENCES ambulatorios(id)
);

-- ----------------------------------------------------------------
-- Tabela: user_instituicao
-- ----------------------------------------------------------------
CREATE TABLE user_instituicao (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL,
  instituicao_id CHAR(36) NOT NULL,
  ativa TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT user_instituicao_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT user_instituicao_instituicao_id_fkey FOREIGN KEY (instituicao_id) REFERENCES instituicoes(id)
);

-- ----------------------------------------------------------------
-- Tabela: user_roles
-- ----------------------------------------------------------------
CREATE TABLE user_roles (
  id CHAR(36) NOT NULL DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL,
  role VARCHAR(50) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Habilita verificação de chaves estrangeiras novamente
SET FOREIGN_KEY_CHECKS = 1;