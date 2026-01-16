-- Create policies for registros_ponto and preceptor_checkins
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