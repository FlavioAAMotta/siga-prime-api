-- Update RLS policies for aluno_presencas
ALTER TABLE public.aluno_presencas DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Coordenadores podem excluir presenças" ON public.aluno_presencas;
DROP POLICY IF EXISTS "Coordenadores podem fazer tudo com presenças" ON public.aluno_presencas;

CREATE POLICY "Admins can manage all presencas"
ON public.aluno_presencas
FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Coordenadores can view presencas from their nucleo"
ON public.aluno_presencas
FOR SELECT
USING (
  public.is_coordenador(auth.uid()) 
  AND public.ambulatorio_in_coordenador_nucleo(ambulatorio_id, auth.uid())
);

ALTER TABLE public.aluno_presencas ENABLE ROW LEVEL SECURITY;