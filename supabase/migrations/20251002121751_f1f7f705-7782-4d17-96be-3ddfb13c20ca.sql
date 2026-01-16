-- Update RLS policies for disciplinas - coordenadores only see their nucleo's disciplinas
DROP POLICY IF EXISTS "Usuários autenticados podem visualizar disciplinas" ON public.disciplinas;

CREATE POLICY "Admins can view all disciplinas"
ON public.disciplinas
FOR SELECT
USING (public.is_admin(auth.uid()));

CREATE POLICY "Coordenadores can only view their nucleo disciplinas"
ON public.disciplinas
FOR SELECT
USING (
  public.is_coordenador(auth.uid()) 
  AND public.disciplina_in_coordenador_nucleo(id, auth.uid())
);

-- Update RLS policies for ambulatorios - coordenadores only see ambulatorios from their nucleo disciplinas
DROP POLICY IF EXISTS "Usuários autenticados podem visualizar ambulatórios" ON public.ambulatorios;

CREATE POLICY "Admins can view all ambulatorios"
ON public.ambulatorios
FOR SELECT
USING (public.is_admin(auth.uid()));

CREATE POLICY "Coordenadores can only view ambulatorios from their nucleo"
ON public.ambulatorios
FOR SELECT
USING (
  public.is_coordenador(auth.uid()) 
  AND public.disciplina_in_coordenador_nucleo(disciplina_id, auth.uid())
);

-- Update RLS policies for preceptores - coordenadores only see preceptores assigned to their nucleo ambulatorios
DROP POLICY IF EXISTS "Usuários autenticados podem visualizar preceptores" ON public.preceptores;

CREATE POLICY "Admins can view all preceptores"
ON public.preceptores
FOR SELECT
USING (public.is_admin(auth.uid()));

CREATE POLICY "Coordenadores can view preceptores from their nucleo"
ON public.preceptores
FOR SELECT
USING (
  public.is_coordenador(auth.uid()) 
  AND EXISTS (
    SELECT 1
    FROM public.preceptor_ambulatorio pa
    JOIN public.ambulatorios a ON pa.ambulatorio_id = a.id
    WHERE pa.preceptor_id = preceptores.id
      AND public.disciplina_in_coordenador_nucleo(a.disciplina_id, auth.uid())
  )
);