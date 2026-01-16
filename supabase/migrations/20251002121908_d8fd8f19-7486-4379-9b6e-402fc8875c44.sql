-- Ensure coordenadores cannot write/update/delete - only read
-- Disciplinas
DROP POLICY IF EXISTS "Usuários autenticados podem criar disciplinas" ON public.disciplinas;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar disciplinas" ON public.disciplinas;
DROP POLICY IF EXISTS "Usuários autenticados podem excluir disciplinas" ON public.disciplinas;

CREATE POLICY "Only admins can insert disciplinas"
ON public.disciplinas
FOR INSERT
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can update disciplinas"
ON public.disciplinas
FOR UPDATE
USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can delete disciplinas"
ON public.disciplinas
FOR DELETE
USING (public.is_admin(auth.uid()));

-- Ambulatorios
DROP POLICY IF EXISTS "Usuários autenticados podem criar ambulatórios" ON public.ambulatorios;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar ambulatórios" ON public.ambulatorios;
DROP POLICY IF EXISTS "Usuários autenticados podem excluir ambulatórios" ON public.ambulatorios;

CREATE POLICY "Only admins can insert ambulatorios"
ON public.ambulatorios
FOR INSERT
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can update ambulatorios"
ON public.ambulatorios
FOR UPDATE
USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can delete ambulatorios"
ON public.ambulatorios
FOR DELETE
USING (public.is_admin(auth.uid()));

-- Preceptores
DROP POLICY IF EXISTS "Usuários autenticados podem criar preceptores" ON public.preceptores;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar preceptores" ON public.preceptores;
DROP POLICY IF EXISTS "Usuários autenticados podem excluir preceptores" ON public.preceptores;

CREATE POLICY "Only admins can insert preceptores"
ON public.preceptores
FOR INSERT
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can update preceptores"
ON public.preceptores
FOR UPDATE
USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can delete preceptores"
ON public.preceptores
FOR DELETE
USING (public.is_admin(auth.uid()));

-- Turmas
DROP POLICY IF EXISTS "Usuários autenticados podem criar turmas" ON public.turmas;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar turmas" ON public.turmas;
DROP POLICY IF EXISTS "Usuários autenticados podem excluir turmas" ON public.turmas;

CREATE POLICY "Only admins can insert turmas"
ON public.turmas
FOR INSERT
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can update turmas"
ON public.turmas
FOR UPDATE
USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can delete turmas"
ON public.turmas
FOR DELETE
USING (public.is_admin(auth.uid()));

-- Alunos - keep existing write policies for admin
DROP POLICY IF EXISTS "Users can only insert students they have access to" ON public.alunos;
DROP POLICY IF EXISTS "Users can only update students they have access to" ON public.alunos;
DROP POLICY IF EXISTS "Users can only delete students they have access to" ON public.alunos;

CREATE POLICY "Only admins can insert alunos"
ON public.alunos
FOR INSERT
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can update alunos"
ON public.alunos
FOR UPDATE
USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can delete alunos"
ON public.alunos
FOR DELETE
USING (public.is_admin(auth.uid()));

-- Preceptor_ambulatorio
DROP POLICY IF EXISTS "Usuários autenticados podem criar associações preceptor-ambu" ON public.preceptor_ambulatorio;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar associações preceptor-" ON public.preceptor_ambulatorio;
DROP POLICY IF EXISTS "Usuários autenticados podem excluir associações preceptor-am" ON public.preceptor_ambulatorio;

CREATE POLICY "Only admins can insert preceptor_ambulatorio"
ON public.preceptor_ambulatorio
FOR INSERT
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can update preceptor_ambulatorio"
ON public.preceptor_ambulatorio
FOR UPDATE
USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can delete preceptor_ambulatorio"
ON public.preceptor_ambulatorio
FOR DELETE
USING (public.is_admin(auth.uid()));