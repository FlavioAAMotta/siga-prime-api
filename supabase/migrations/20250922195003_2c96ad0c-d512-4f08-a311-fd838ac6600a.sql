-- Simplificar RLS para permitir acesso completo aos coordenadores
-- Remover políticas restritivas da tabela alunos e criar políticas mais simples

DROP POLICY IF EXISTS "Apenas administradores podem excluir alunos" ON public.alunos;
DROP POLICY IF EXISTS "Preceptores podem atualizar alunos de suas turmas" ON public.alunos;
DROP POLICY IF EXISTS "Preceptores podem visualizar alunos de suas turmas" ON public.alunos;
DROP POLICY IF EXISTS "Sistema pode criar alunos" ON public.alunos;

-- Criar políticas simples para coordenadores (todos os usuários autenticados)
CREATE POLICY "Coordenadores podem fazer tudo com alunos" ON public.alunos
FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Atualizar políticas de presenças para acesso completo
DROP POLICY IF EXISTS "Administradores podem ver todas as presenças" ON public.aluno_presencas;
DROP POLICY IF EXISTS "Usuários podem atualizar presenças de seu preceptor" ON public.aluno_presencas;
DROP POLICY IF EXISTS "Usuários podem criar presenças de seu preceptor" ON public.aluno_presencas;
DROP POLICY IF EXISTS "Usuários podem ver presenças de seu preceptor" ON public.aluno_presencas;

CREATE POLICY "Coordenadores podem fazer tudo com presenças" ON public.aluno_presencas
FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Atualizar políticas de registros de ponto
DROP POLICY IF EXISTS "Usuários podem atualizar registros de seu preceptor" ON public.registros_ponto;
DROP POLICY IF EXISTS "Usuários podem criar registros de seu preceptor" ON public.registros_ponto;
DROP POLICY IF EXISTS "Usuários podem ver registros de seu preceptor" ON public.registros_ponto;

CREATE POLICY "Coordenadores podem fazer tudo com registros de ponto" ON public.registros_ponto
FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Atualizar políticas de checkins de preceptores
DROP POLICY IF EXISTS "Usuários podem atualizar checkins de seu preceptor" ON public.preceptor_checkins;
DROP POLICY IF EXISTS "Usuários podem criar checkins de seu preceptor" ON public.preceptor_checkins;
DROP POLICY IF EXISTS "Usuários podem ver checkins de seu preceptor" ON public.preceptor_checkins;

CREATE POLICY "Coordenadores podem fazer tudo com checkins" ON public.preceptor_checkins
FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Permitir DELETE para todas as tabelas para coordenadores
CREATE POLICY "Coordenadores podem excluir presenças" ON public.aluno_presencas
FOR DELETE TO authenticated USING (true);

CREATE POLICY "Coordenadores podem excluir registros de ponto" ON public.registros_ponto
FOR DELETE TO authenticated USING (true);

CREATE POLICY "Coordenadores podem excluir checkins" ON public.preceptor_checkins
FOR DELETE TO authenticated USING (true);

-- Atualizar política de preceptor_users para acesso mais amplo
DROP POLICY IF EXISTS "Usuários podem atualizar seu próprio perfil" ON public.preceptor_users;
DROP POLICY IF EXISTS "Usuários podem criar seu próprio vínculo" ON public.preceptor_users;
DROP POLICY IF EXISTS "Usuários podem ver seu próprio perfil" ON public.preceptor_users;

CREATE POLICY "Coordenadores podem gerenciar vínculos de usuários" ON public.preceptor_users
FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Coordenadores podem excluir vínculos de usuários" ON public.preceptor_users
FOR DELETE TO authenticated USING (true);