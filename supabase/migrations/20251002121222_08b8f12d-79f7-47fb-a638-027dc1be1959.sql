-- Create helper functions for coordenador access control
CREATE OR REPLACE FUNCTION public.get_coordenador_nucleo_id(_user_id UUID)
RETURNS UUID
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT c.nucleo_id
  FROM public.coordenador_users cu
  JOIN public.coordenadores c ON cu.coordenador_id = c.id
  WHERE cu.user_id = _user_id
  LIMIT 1
$$;

CREATE OR REPLACE FUNCTION public.disciplina_in_coordenador_nucleo(_disciplina_id UUID, _user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.nucleo_disciplinas nd
    WHERE nd.disciplina_id = _disciplina_id
      AND nd.nucleo_id = public.get_coordenador_nucleo_id(_user_id)
  )
$$;

CREATE OR REPLACE FUNCTION public.ambulatorio_in_coordenador_nucleo(_ambulatorio_id UUID, _user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.ambulatorios a
    WHERE a.id = _ambulatorio_id
      AND public.disciplina_in_coordenador_nucleo(a.disciplina_id, _user_id)
  )
$$;