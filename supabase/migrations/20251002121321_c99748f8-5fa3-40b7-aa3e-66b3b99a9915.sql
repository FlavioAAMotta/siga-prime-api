-- Update RLS policies for avaliacoes
ALTER TABLE public.avaliacoes DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Usuários autenticados podem gerenciar avaliações" ON public.avaliacoes;
DROP POLICY IF EXISTS "Usuários autenticados podem visualizar avaliações" ON public.avaliacoes;

CREATE POLICY "Admins can manage all avaliacoes"
ON public.avaliacoes
FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Coordenadores can view avaliacoes from their nucleo"
ON public.avaliacoes
FOR SELECT
USING (
  public.is_coordenador(auth.uid()) 
  AND public.ambulatorio_in_coordenador_nucleo(ambulatorio_id, auth.uid())
);

ALTER TABLE public.avaliacoes ENABLE ROW LEVEL SECURITY;