import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.raw(`
/*
  SCRIPT DE CRIAÇÃO - ARQUITETURA HÍBRIDA (ID INT + UUID)
  MySQL 8.0+
*/

SET FOREIGN_KEY_CHECKS = 0;
SET sql_mode = '';

-- ----------------------------------------------------------------
-- 1. Tabela Mock para Auth (Simulando o Supabase)
-- ----------------------------------------------------------------
-- Como essa tabela vem de fora, mantemos o ID como UUID na PK mesmo
CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) NOT NULL,
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; 


-- ----------------------------------------------------------------
-- 2. Tabelas Base (Cadastros Gerais)
-- ----------------------------------------------------------------

CREATE TABLE IF NOT EXISTS instituicoes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) NOT NULL UNIQUE DEFAULT (UUID()), -- Seu ID antigo entra aqui
    nome VARCHAR(255) NOT NULL,
    tipo ENUM('producao', 'teste') NOT NULL DEFAULT 'producao',
    ativo TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS nucleos (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
    nome VARCHAR(255) NOT NULL UNIQUE,
    descricao TEXT,
    ativo TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    instituicao_id CHAR(36), -- FK aponta para o UUID
    CONSTRAINT fk_nucleos_instituicao FOREIGN KEY (instituicao_id) REFERENCES instituicoes(uuid)
);

CREATE TABLE IF NOT EXISTS coordenadores (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    telefone VARCHAR(50),
    cpf VARCHAR(20),
    ativo TINYINT(1) NOT NULL DEFAULT 1,
    observacoes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    nucleo_id CHAR(36),
    instituicao_id CHAR(36),
    CONSTRAINT fk_coordenadores_nucleo FOREIGN KEY (nucleo_id) REFERENCES nucleos(uuid),
    CONSTRAINT fk_coordenadores_instituicao FOREIGN KEY (instituicao_id) REFERENCES instituicoes(uuid)
);

CREATE TABLE IF NOT EXISTS disciplinas (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
    nome VARCHAR(255) NOT NULL,
    codigo VARCHAR(50) UNIQUE,
    descricao TEXT,
    carga_horaria INTEGER,
    ativo TINYINT(1) NOT NULL DEFAULT 1,
    data_inicio DATE,
    data_fim DATE,
    periodo_numero INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    instituicao_id CHAR(36),
    CONSTRAINT fk_disciplinas_instituicao FOREIGN KEY (instituicao_id) REFERENCES instituicoes(uuid)
);

CREATE TABLE IF NOT EXISTS ambulatorios (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
    nome VARCHAR(255) NOT NULL,
    localizacao TEXT,
    capacidade INTEGER DEFAULT 1,
    ativo TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    disciplina_id CHAR(36) NOT NULL,
    instituicao_id CHAR(36),
    CONSTRAINT fk_ambulatorios_disciplina FOREIGN KEY (disciplina_id) REFERENCES disciplinas(uuid),
    CONSTRAINT fk_ambulatorios_instituicao FOREIGN KEY (instituicao_id) REFERENCES instituicoes(uuid)
);

CREATE TABLE IF NOT EXISTS turmas (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
    nome VARCHAR(255) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    turma_periodo_id CHAR(36),
    periodo_letivo VARCHAR(20),
    ano INTEGER,
    semestre INTEGER,
    capacidade INTEGER DEFAULT 1,
    ativo TINYINT(1) NOT NULL DEFAULT 1,
    observacoes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    instituicao_id CHAR(36),
    CONSTRAINT fk_turmas_self FOREIGN KEY (turma_periodo_id) REFERENCES turmas(uuid),
    CONSTRAINT fk_turmas_instituicao FOREIGN KEY (instituicao_id) REFERENCES instituicoes(uuid)
);

CREATE TABLE IF NOT EXISTS alunos (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
    nome VARCHAR(255) NOT NULL,
    matricula VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255),
    telefone VARCHAR(50),
    cpf VARCHAR(20),
    data_nascimento DATE,
    periodo INTEGER,
    ativo TINYINT(1) NOT NULL DEFAULT 1,
    observacoes TEXT,
    semestre_ingresso VARCHAR(20),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    turma_id CHAR(36),
    instituicao_id CHAR(36),
    CONSTRAINT fk_alunos_turma FOREIGN KEY (turma_id) REFERENCES turmas(uuid),
    CONSTRAINT fk_alunos_instituicao FOREIGN KEY (instituicao_id) REFERENCES instituicoes(uuid)
);

CREATE TABLE IF NOT EXISTS preceptores (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
    nome VARCHAR(255) NOT NULL,
    crm VARCHAR(50),
    email VARCHAR(255),
    telefone VARCHAR(50),
    ativo TINYINT(1) NOT NULL DEFAULT 1,
    usuario VARCHAR(255) UNIQUE,
    especialidade VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    instituicao_id CHAR(36),
    CONSTRAINT fk_preceptores_instituicao FOREIGN KEY (instituicao_id) REFERENCES instituicoes(uuid)
);

-- ----------------------------------------------------------------
-- 3. Tabelas de Relacionamento e Processos
-- ----------------------------------------------------------------

CREATE TABLE IF NOT EXISTS nucleo_disciplinas (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
    nucleo_id CHAR(36) NOT NULL,
    disciplina_id CHAR(36) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_nd_nucleo FOREIGN KEY (nucleo_id) REFERENCES nucleos(uuid),
    CONSTRAINT fk_nd_disciplina FOREIGN KEY (disciplina_id) REFERENCES disciplinas(uuid)
);

CREATE TABLE IF NOT EXISTS preceptor_ambulatorio (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
    preceptor_id CHAR(36) NOT NULL,
    ambulatorio_id CHAR(36) NOT NULL,
    dia_semana INTEGER,
    horario_inicio TIME,
    horario_fim TIME,
    turma VARCHAR(50),
    periodo VARCHAR(50),
    ativo TINYINT(1) NOT NULL DEFAULT 1,
    observacoes TEXT,
    data_inicio DATE,
    data_fim DATE,
    disciplina_id CHAR(36),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_pa_preceptor FOREIGN KEY (preceptor_id) REFERENCES preceptores(uuid),
    CONSTRAINT fk_pa_ambulatorio FOREIGN KEY (ambulatorio_id) REFERENCES ambulatorios(uuid),
    CONSTRAINT fk_pa_disciplina FOREIGN KEY (disciplina_id) REFERENCES disciplinas(uuid)
);

CREATE TABLE IF NOT EXISTS aluno_disciplina (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
    aluno_id CHAR(36) NOT NULL,
    disciplina_id CHAR(36) NOT NULL,
    turma_pratica_id CHAR(36),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_ad_aluno FOREIGN KEY (aluno_id) REFERENCES alunos(uuid),
    CONSTRAINT fk_ad_disciplina FOREIGN KEY (disciplina_id) REFERENCES disciplinas(uuid),
    CONSTRAINT fk_ad_turma FOREIGN KEY (turma_pratica_id) REFERENCES turmas(uuid)
);

CREATE TABLE IF NOT EXISTS aluno_escalas (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
    aluno_id CHAR(36) NOT NULL,
    preceptor_id CHAR(36) NOT NULL,
    ambulatorio_id CHAR(36) NOT NULL,
    dia_semana INTEGER NOT NULL,
    horario_inicio TIME NOT NULL,
    horario_fim TIME NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE,
    ativo TINYINT(1) NOT NULL DEFAULT 1,
    observacoes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_ae_aluno FOREIGN KEY (aluno_id) REFERENCES alunos(uuid),
    CONSTRAINT fk_ae_preceptor FOREIGN KEY (preceptor_id) REFERENCES preceptores(uuid),
    CONSTRAINT fk_ae_ambulatorio FOREIGN KEY (ambulatorio_id) REFERENCES ambulatorios(uuid)
);

CREATE TABLE IF NOT EXISTS aluno_presencas (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
    aluno_id CHAR(36) NOT NULL,
    preceptor_id CHAR(36) NOT NULL,
    ambulatorio_id CHAR(36) NOT NULL,
    data_presenca DATE NOT NULL DEFAULT (CURRENT_DATE),
    presente TINYINT(1) NOT NULL DEFAULT 0,
    observacoes TEXT,
    escala_id CHAR(36),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_ap_aluno FOREIGN KEY (aluno_id) REFERENCES alunos(uuid),
    CONSTRAINT fk_ap_preceptor FOREIGN KEY (preceptor_id) REFERENCES preceptores(uuid),
    CONSTRAINT fk_ap_ambulatorio FOREIGN KEY (ambulatorio_id) REFERENCES ambulatorios(uuid),
    CONSTRAINT fk_ap_escala FOREIGN KEY (escala_id) REFERENCES preceptor_ambulatorio(uuid)
);

CREATE TABLE IF NOT EXISTS aluno_registros_ponto (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
    aluno_id CHAR(36) NOT NULL,
    escala_id CHAR(36),
    ambulatorio_id CHAR(36) NOT NULL,
    preceptor_id CHAR(36) NOT NULL,
    data_entrada DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_saida DATETIME,
    horario_programado_inicio TIME,
    horario_programado_fim TIME,
    status_entrada VARCHAR(50) DEFAULT 'pontual',
    status_saida VARCHAR(50),
    minutos_atraso_entrada INTEGER DEFAULT 0,
    minutos_diferenca_saida INTEGER DEFAULT 0,
    numero_atendimentos INTEGER,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    localizacao_endereco TEXT,
    observacoes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_arp_aluno FOREIGN KEY (aluno_id) REFERENCES alunos(uuid),
    CONSTRAINT fk_arp_ambulatorio FOREIGN KEY (ambulatorio_id) REFERENCES ambulatorios(uuid),
    CONSTRAINT fk_arp_preceptor FOREIGN KEY (preceptor_id) REFERENCES preceptores(uuid)
);

CREATE TABLE IF NOT EXISTS aluno_turma_pratica (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
    aluno_id CHAR(36) NOT NULL,
    turma_pratica_id CHAR(36) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_atp_aluno FOREIGN KEY (aluno_id) REFERENCES alunos(uuid),
    CONSTRAINT fk_atp_turma FOREIGN KEY (turma_pratica_id) REFERENCES turmas(uuid)
);

CREATE TABLE IF NOT EXISTS avaliacoes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
    aluno_id CHAR(36) NOT NULL,
    preceptor_id CHAR(36) NOT NULL,
    ambulatorio_id CHAR(36) NOT NULL,
    data_avaliacao DATE NOT NULL DEFAULT (CURRENT_DATE),
    tipo_avaliacao VARCHAR(50) NOT NULL DEFAULT 'pratica',
    nota DECIMAL(4, 2),
    observacoes TEXT,
    criterios JSON,
    escala_id CHAR(36),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_avaliacoes_aluno FOREIGN KEY (aluno_id) REFERENCES alunos(uuid),
    CONSTRAINT fk_avaliacoes_escala FOREIGN KEY (escala_id) REFERENCES preceptor_ambulatorio(uuid)
);

CREATE TABLE IF NOT EXISTS preceptor_checkins (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
    preceptor_id CHAR(36) NOT NULL,
    ambulatorio_id CHAR(36) NOT NULL,
    data_checkin DATE NOT NULL DEFAULT (CURRENT_DATE),
    horario_checkin TIME,
    horario_checkout TIME,
    status ENUM('presente', 'ausente', 'atestado') NOT NULL DEFAULT 'presente',
    observacoes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_pc_preceptor FOREIGN KEY (preceptor_id) REFERENCES preceptores(uuid),
    CONSTRAINT fk_pc_ambulatorio FOREIGN KEY (ambulatorio_id) REFERENCES ambulatorios(uuid)
);

CREATE TABLE IF NOT EXISTS preceptor_disciplina (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
    preceptor_id CHAR(36) NOT NULL,
    disciplina_id CHAR(36) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    -- Sem FKs forçadas aqui para agilizar, mas pode adicionar se quiser
);

CREATE TABLE IF NOT EXISTS registros_ponto (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
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
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    localizacao_endereco TEXT,
    numero_consultas INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_rp_preceptor FOREIGN KEY (preceptor_id) REFERENCES preceptores(uuid),
    CONSTRAINT fk_rp_ambulatorio FOREIGN KEY (ambulatorio_id) REFERENCES ambulatorios(uuid)
);

CREATE TABLE IF NOT EXISTS turma_disciplinas (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
    turma_id CHAR(36) NOT NULL,
    disciplina_id CHAR(36) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_td_turma FOREIGN KEY (turma_id) REFERENCES turmas(uuid),
    CONSTRAINT fk_td_disciplina FOREIGN KEY (disciplina_id) REFERENCES disciplinas(uuid)
);

-- Tabelas de Ligação com Auth (Simulação)
CREATE TABLE IF NOT EXISTS aluno_users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    aluno_id CHAR(36) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_au_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_au_aluno FOREIGN KEY (aluno_id) REFERENCES alunos(uuid)
);

CREATE TABLE IF NOT EXISTS coordenador_users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    coordenador_id CHAR(36) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_cu_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_cu_coordenador FOREIGN KEY (coordenador_id) REFERENCES coordenadores(uuid)
);

CREATE TABLE IF NOT EXISTS preceptor_users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL UNIQUE,
    preceptor_id CHAR(36) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_pu_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_pu_preceptor FOREIGN KEY (preceptor_id) REFERENCES preceptores(uuid)
);

CREATE TABLE IF NOT EXISTS user_instituicao (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    instituicao_id CHAR(36) NOT NULL,
    ativa TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_ui_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_ui_instituicao FOREIGN KEY (instituicao_id) REFERENCES instituicoes(uuid)
);

CREATE TABLE IF NOT EXISTS user_roles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_ur_user FOREIGN KEY (user_id) REFERENCES users(id)
);

SET FOREIGN_KEY_CHECKS = 1;

    `);
}

export async function down(knex: Knex): Promise<void> {
    await knex.raw(`
        SET FOREIGN_KEY_CHECKS = 0;
        DROP TABLE IF EXISTS user_roles;
        DROP TABLE IF EXISTS user_instituicao;
        DROP TABLE IF EXISTS preceptor_users;
        DROP TABLE IF EXISTS coordenador_users;
        DROP TABLE IF EXISTS aluno_users;
        DROP TABLE IF EXISTS turma_disciplinas;
        DROP TABLE IF EXISTS registros_ponto;
        DROP TABLE IF EXISTS preceptor_disciplina;
        DROP TABLE IF EXISTS preceptor_checkins;
        DROP TABLE IF EXISTS avaliacoes;
        DROP TABLE IF EXISTS aluno_turma_pratica;
        DROP TABLE IF EXISTS aluno_registros_ponto;
        DROP TABLE IF EXISTS aluno_presencas;
        DROP TABLE IF EXISTS aluno_escalas;
        DROP TABLE IF EXISTS aluno_disciplina;
        DROP TABLE IF EXISTS preceptor_ambulatorio;
        DROP TABLE IF EXISTS nucleo_disciplinas;
        DROP TABLE IF EXISTS preceptores;
        DROP TABLE IF EXISTS alunos;
        DROP TABLE IF EXISTS turmas;
        DROP TABLE IF EXISTS ambulatorios;
        DROP TABLE IF EXISTS disciplinas;
        DROP TABLE IF EXISTS coordenadores;
        DROP TABLE IF EXISTS nucleos;
        DROP TABLE IF EXISTS instituicoes;
        DROP TABLE IF EXISTS users;
        SET FOREIGN_KEY_CHECKS = 1;
    `);
}
