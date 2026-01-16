-- Update RLS policies for registros_ponto
ALTER TABLE public.registros_ponto DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Coordenadores podem excluir registros de ponto" ON public.registros_ponto;
DROP POLICY IF EXISTS "Coordenadores podem fazer tudo com registros de ponto" ON public.registros_ponto;

CREATE POLICY "Admins can manage all registros_ponto"
ON public.registros_ponto
FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Coordenadores can view registros_ponto from their nucleo"
ON public.registros_ponto
FOR SELECT
USING (
  public.is_coordenador(auth.uid()) 
  AND public.ambulatorio_in_coordenador_nucleo(ambulatorio_id, auth.uid())
);

ALTER TABLE public.registros_ponto ENABLE ROW LEVEL SECURITY;

-- Update RLS policies for preceptor_checkins
ALTER TABLE public.preceptor_checkins DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Coordenadores podem excluir checkins" ON public.preceptor_checkins;
DROP POLICY IF EXISTS "Coordenadores podem fazer tudo com checkins" ON public.preceptor_checkins;

CREATE POLICY "Admins can manage all checkins"
ON public.preceptor_checkins
FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Coordenadores can view checkins from their nucleo"
ON public.preceptor_checkins
FOR SELECT
USING (
  public.is_coordenador(auth.uid()) 
  AND public.ambulatorio_in_coordenador_nucleo(ambulatorio_id, auth.uid())
);

ALTER TABLE public.preceptor_checkins ENABLE ROW LEVEL SECURITY;