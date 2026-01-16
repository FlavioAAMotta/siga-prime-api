-- Update RLS policies for alunos - coordenadores only see alunos from turmas related to their nucleo
DROP POLICY IF EXISTS "Users can only view students they have access to" ON public.alunos;

CREATE POLICY "Admins can view all alunos"
ON public.alunos
FOR SELECT
USING (public.is_admin(auth.uid()));

CREATE POLICY "Coordenadores can view alunos from their nucleo"
ON public.alunos
FOR SELECT
USING (
  public.is_coordenador(auth.uid()) 
  AND (
    EXISTS (
      SELECT 1
      FROM public.turmas t
      JOIN public.turma_disciplinas td ON t.id = td.turma_id
      WHERE t.id = alunos.turma_id
        AND public.disciplina_in_coordenador_nucleo(td.disciplina_id, auth.uid())
    )
    OR EXISTS (
      SELECT 1
      FROM public.aluno_turma_pratica atp
      JOIN public.turmas tp ON atp.turma_pratica_id = tp.id
      JOIN public.turma_disciplinas td ON tp.id = td.turma_id
      WHERE atp.aluno_id = alunos.id
        AND public.disciplina_in_coordenador_nucleo(td.disciplina_id, auth.uid())
    )
  )
);

-- Update RLS policies for turmas
DROP POLICY IF EXISTS "Usuários autenticados podem visualizar turmas" ON public.turmas;

CREATE POLICY "Admins can view all turmas"
ON public.turmas
FOR SELECT
USING (public.is_admin(auth.uid()));

CREATE POLICY "Coordenadores can view turmas from their nucleo"
ON public.turmas
FOR SELECT
USING (
  public.is_coordenador(auth.uid()) 
  AND EXISTS (
    SELECT 1
    FROM public.turma_disciplinas td
    WHERE td.turma_id = turmas.id
      AND public.disciplina_in_coordenador_nucleo(td.disciplina_id, auth.uid())
  )
);

-- Update RLS policies for preceptor_ambulatorio
DROP POLICY IF EXISTS "Usuários autenticados podem visualizar associações preceptor" ON public.preceptor_ambulatorio;

CREATE POLICY "Admins can view all preceptor_ambulatorio"
ON public.preceptor_ambulatorio
FOR SELECT
USING (public.is_admin(auth.uid()));

CREATE POLICY "Coordenadores can view preceptor_ambulatorio from their nucleo"
ON public.preceptor_ambulatorio
FOR SELECT
USING (
  public.is_coordenador(auth.uid()) 
  AND public.ambulatorio_in_coordenador_nucleo(ambulatorio_id, auth.uid())
);