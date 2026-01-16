-- Primeiro, atribuir a primeira instituição (Faminas Muriaé) a todos os dados existentes sem instituicao_id
DO $$
DECLARE
  primeira_instituicao_id uuid;
BEGIN
  -- Buscar ID da primeira instituição
  SELECT id INTO primeira_instituicao_id
  FROM public.instituicoes
  WHERE tipo = 'producao'
  ORDER BY created_at
  LIMIT 1;

  -- Se encontrou uma instituição, atualizar os dados
  IF primeira_instituicao_id IS NOT NULL THEN
    -- Atualizar disciplinas
    UPDATE public.disciplinas
    SET instituicao_id = primeira_instituicao_id
    WHERE instituicao_id IS NULL;

    -- Atualizar alunos
    UPDATE public.alunos
    SET instituicao_id = primeira_instituicao_id
    WHERE instituicao_id IS NULL;

    -- Atualizar preceptores
    UPDATE public.preceptores
    SET instituicao_id = primeira_instituicao_id
    WHERE instituicao_id IS NULL;

    -- Atualizar coordenadores
    UPDATE public.coordenadores
    SET instituicao_id = primeira_instituicao_id
    WHERE instituicao_id IS NULL;

    -- Atualizar turmas
    UPDATE public.turmas
    SET instituicao_id = primeira_instituicao_id
    WHERE instituicao_id IS NULL;

    -- Atualizar ambulatorios
    UPDATE public.ambulatorios
    SET instituicao_id = primeira_instituicao_id
    WHERE instituicao_id IS NULL;

    -- Atualizar nucleos
    UPDATE public.nucleos
    SET instituicao_id = primeira_instituicao_id
    WHERE instituicao_id IS NULL;
  END IF;
END $$;

-- Agora atualizar as políticas RLS para NÃO permitir dados com instituicao_id NULL

-- Disciplinas
DROP POLICY IF EXISTS "Admins can view disciplinas from their instituicao" ON public.disciplinas;
CREATE POLICY "Admins can view disciplinas from their instituicao"
ON public.disciplinas
FOR SELECT
USING (
  is_admin(auth.uid()) 
  AND instituicao_id = get_user_instituicao_ativa(auth.uid())
);

-- Alunos
DROP POLICY IF EXISTS "Admins can view alunos from their instituicao" ON public.alunos;
CREATE POLICY "Admins can view alunos from their instituicao"
ON public.alunos
FOR SELECT
USING (
  is_admin(auth.uid()) 
  AND instituicao_id = get_user_instituicao_ativa(auth.uid())
);

-- Preceptores
DROP POLICY IF EXISTS "Admins can view preceptores from their instituicao" ON public.preceptores;
CREATE POLICY "Admins can view preceptores from their instituicao"
ON public.preceptores
FOR SELECT
USING (
  is_admin(auth.uid()) 
  AND instituicao_id = get_user_instituicao_ativa(auth.uid())
);

-- Coordenadores
DROP POLICY IF EXISTS "Admins can view coordenadores from their instituicao" ON public.coordenadores;
CREATE POLICY "Admins can view coordenadores from their instituicao"
ON public.coordenadores
FOR SELECT
USING (
  is_admin(auth.uid()) 
  AND instituicao_id = get_user_instituicao_ativa(auth.uid())
);

-- Turmas
DROP POLICY IF EXISTS "Admins can view turmas from their instituicao" ON public.turmas;
CREATE POLICY "Admins can view turmas from their instituicao"
ON public.turmas
FOR SELECT
USING (
  is_admin(auth.uid()) 
  AND instituicao_id = get_user_instituicao_ativa(auth.uid())
);

-- Ambulatorios
DROP POLICY IF EXISTS "Admins can view ambulatorios from their instituicao" ON public.ambulatorios;
CREATE POLICY "Admins can view ambulatorios from their instituicao"
ON public.ambulatorios
FOR SELECT
USING (
  is_admin(auth.uid()) 
  AND instituicao_id = get_user_instituicao_ativa(auth.uid())
);

-- Nucleos - esta política é diferente, permite ver todos os nucleos da instituição ativa
DROP POLICY IF EXISTS "Users can view nucleos from their instituicao" ON public.nucleos;
CREATE POLICY "Users can view nucleos from their instituicao"
ON public.nucleos
FOR SELECT
USING (
  instituicao_id = get_user_instituicao_ativa(auth.uid())
);