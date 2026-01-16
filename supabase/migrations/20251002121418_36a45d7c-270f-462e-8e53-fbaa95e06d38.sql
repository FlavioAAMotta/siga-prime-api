-- Clean up existing policies
DROP POLICY IF EXISTS "Admins can manage all registros_ponto" ON public.registros_ponto;
DROP POLICY IF EXISTS "Coordenadores can view registros_ponto from their nucleo" ON public.registros_ponto;
DROP POLICY IF EXISTS "Admins can manage all checkins" ON public.preceptor_checkins;
DROP POLICY IF EXISTS "Coordenadores can view checkins from their nucleo" ON public.preceptor_checkins;