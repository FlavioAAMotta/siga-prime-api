-- Criar tabela de instituições/campus
CREATE TABLE public.instituicoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL DEFAULT 'producao' CHECK (tipo IN ('producao', 'teste')),
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS na tabela instituicoes
ALTER TABLE public.instituicoes ENABLE ROW LEVEL SECURITY;

-- Policy: usuários autenticados podem ver instituições ativas
CREATE POLICY "Usuários podem ver instituições ativas"
  ON public.instituicoes FOR SELECT
  TO authenticated
  USING (ativo = true);

-- Policy: apenas admins podem gerenciar instituições
CREATE POLICY "Admins podem gerenciar instituições"
  ON public.instituicoes FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- Criar tabela de contexto do usuário (qual instituição está usando)
CREATE TABLE public.user_instituicao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  instituicao_id UUID NOT NULL REFERENCES public.instituicoes(id) ON DELETE CASCADE,
  ativa BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, instituicao_id)
);

-- Habilitar RLS
ALTER TABLE public.user_instituicao ENABLE ROW LEVEL SECURITY;

-- Policy: usuários podem ver suas próprias associações
CREATE POLICY "Usuários veem suas instituições"
  ON public.user_instituicao FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Policy: usuários podem atualizar qual instituição está ativa
CREATE POLICY "Usuários podem atualizar instituição ativa"
  ON public.user_instituicao FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Policy: admins podem gerenciar associações
CREATE POLICY "Admins podem gerenciar user_instituicao"
  ON public.user_instituicao FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- Função para pegar instituição ativa do usuário
CREATE OR REPLACE FUNCTION public.get_user_instituicao_ativa(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT instituicao_id
  FROM public.user_instituicao
  WHERE user_id = _user_id AND ativa = true
  LIMIT 1
$$;

-- Adicionar coluna instituicao_id nas tabelas principais
ALTER TABLE public.disciplinas ADD COLUMN instituicao_id UUID REFERENCES public.instituicoes(id);
ALTER TABLE public.alunos ADD COLUMN instituicao_id UUID REFERENCES public.instituicoes(id);
ALTER TABLE public.preceptores ADD COLUMN instituicao_id UUID REFERENCES public.instituicoes(id);
ALTER TABLE public.coordenadores ADD COLUMN instituicao_id UUID REFERENCES public.instituicoes(id);
ALTER TABLE public.turmas ADD COLUMN instituicao_id UUID REFERENCES public.instituicoes(id);
ALTER TABLE public.ambulatorios ADD COLUMN instituicao_id UUID REFERENCES public.instituicoes(id);
ALTER TABLE public.nucleos ADD COLUMN instituicao_id UUID REFERENCES public.instituicoes(id);

-- Criar índices para performance
CREATE INDEX idx_disciplinas_instituicao ON public.disciplinas(instituicao_id);
CREATE INDEX idx_alunos_instituicao ON public.alunos(instituicao_id);
CREATE INDEX idx_preceptores_instituicao ON public.preceptores(instituicao_id);
CREATE INDEX idx_coordenadores_instituicao ON public.coordenadores(instituicao_id);
CREATE INDEX idx_turmas_instituicao ON public.turmas(instituicao_id);
CREATE INDEX idx_ambulatorios_instituicao ON public.ambulatorios(instituicao_id);
CREATE INDEX idx_nucleos_instituicao ON public.nucleos(instituicao_id);
CREATE INDEX idx_user_instituicao_user ON public.user_instituicao(user_id);
CREATE INDEX idx_user_instituicao_ativa ON public.user_instituicao(user_id, ativa) WHERE ativa = true;

-- Atualizar políticas RLS existentes para incluir filtro de instituição

-- Disciplinas
DROP POLICY IF EXISTS "Admins can view all disciplinas" ON public.disciplinas;
CREATE POLICY "Admins can view disciplinas from their instituicao"
  ON public.disciplinas FOR SELECT
  TO authenticated
  USING (
    is_admin(auth.uid()) AND 
    (instituicao_id IS NULL OR instituicao_id = get_user_instituicao_ativa(auth.uid()))
  );

DROP POLICY IF EXISTS "Only admins can insert disciplinas" ON public.disciplinas;
CREATE POLICY "Admins can insert disciplinas in their instituicao"
  ON public.disciplinas FOR INSERT
  TO authenticated
  WITH CHECK (
    is_admin(auth.uid()) AND 
    instituicao_id = get_user_instituicao_ativa(auth.uid())
  );

DROP POLICY IF EXISTS "Only admins can update disciplinas" ON public.disciplinas;
CREATE POLICY "Admins can update disciplinas in their instituicao"
  ON public.disciplinas FOR UPDATE
  TO authenticated
  USING (
    is_admin(auth.uid()) AND 
    instituicao_id = get_user_instituicao_ativa(auth.uid())
  );

DROP POLICY IF EXISTS "Only admins can delete disciplinas" ON public.disciplinas;
CREATE POLICY "Admins can delete disciplinas in their instituicao"
  ON public.disciplinas FOR DELETE
  TO authenticated
  USING (
    is_admin(auth.uid()) AND 
    instituicao_id = get_user_instituicao_ativa(auth.uid())
  );

-- Alunos
DROP POLICY IF EXISTS "Admins can view all alunos" ON public.alunos;
CREATE POLICY "Admins can view alunos from their instituicao"
  ON public.alunos FOR SELECT
  TO authenticated
  USING (
    is_admin(auth.uid()) AND 
    (instituicao_id IS NULL OR instituicao_id = get_user_instituicao_ativa(auth.uid()))
  );

DROP POLICY IF EXISTS "Only admins can insert alunos" ON public.alunos;
CREATE POLICY "Admins can insert alunos in their instituicao"
  ON public.alunos FOR INSERT
  TO authenticated
  WITH CHECK (
    is_admin(auth.uid()) AND 
    instituicao_id = get_user_instituicao_ativa(auth.uid())
  );

DROP POLICY IF EXISTS "Only admins can update alunos" ON public.alunos;
CREATE POLICY "Admins can update alunos in their instituicao"
  ON public.alunos FOR UPDATE
  TO authenticated
  USING (
    is_admin(auth.uid()) AND 
    instituicao_id = get_user_instituicao_ativa(auth.uid())
  );

DROP POLICY IF EXISTS "Only admins can delete alunos" ON public.alunos;
CREATE POLICY "Admins can delete alunos in their instituicao"
  ON public.alunos FOR DELETE
  TO authenticated
  USING (
    is_admin(auth.uid()) AND 
    instituicao_id = get_user_instituicao_ativa(auth.uid())
  );

-- Preceptores
DROP POLICY IF EXISTS "Admins can view all preceptores" ON public.preceptores;
CREATE POLICY "Admins can view preceptores from their instituicao"
  ON public.preceptores FOR SELECT
  TO authenticated
  USING (
    is_admin(auth.uid()) AND 
    (instituicao_id IS NULL OR instituicao_id = get_user_instituicao_ativa(auth.uid()))
  );

DROP POLICY IF EXISTS "Only admins can insert preceptores" ON public.preceptores;
CREATE POLICY "Admins can insert preceptores in their instituicao"
  ON public.preceptores FOR INSERT
  TO authenticated
  WITH CHECK (
    is_admin(auth.uid()) AND 
    instituicao_id = get_user_instituicao_ativa(auth.uid())
  );

DROP POLICY IF EXISTS "Only admins can update preceptores" ON public.preceptores;
CREATE POLICY "Admins can update preceptores in their instituicao"
  ON public.preceptores FOR UPDATE
  TO authenticated
  USING (
    is_admin(auth.uid()) AND 
    instituicao_id = get_user_instituicao_ativa(auth.uid())
  );

DROP POLICY IF EXISTS "Only admins can delete preceptores" ON public.preceptores;
CREATE POLICY "Admins can delete preceptores in their instituicao"
  ON public.preceptores FOR DELETE
  TO authenticated
  USING (
    is_admin(auth.uid()) AND 
    instituicao_id = get_user_instituicao_ativa(auth.uid())
  );

-- Turmas
DROP POLICY IF EXISTS "Admins can view all turmas" ON public.turmas;
CREATE POLICY "Admins can view turmas from their instituicao"
  ON public.turmas FOR SELECT
  TO authenticated
  USING (
    is_admin(auth.uid()) AND 
    (instituicao_id IS NULL OR instituicao_id = get_user_instituicao_ativa(auth.uid()))
  );

DROP POLICY IF EXISTS "Only admins can insert turmas" ON public.turmas;
CREATE POLICY "Admins can insert turmas in their instituicao"
  ON public.turmas FOR INSERT
  TO authenticated
  WITH CHECK (
    is_admin(auth.uid()) AND 
    instituicao_id = get_user_instituicao_ativa(auth.uid())
  );

DROP POLICY IF EXISTS "Only admins can update turmas" ON public.turmas;
CREATE POLICY "Admins can update turmas in their instituicao"
  ON public.turmas FOR UPDATE
  TO authenticated
  USING (
    is_admin(auth.uid()) AND 
    instituicao_id = get_user_instituicao_ativa(auth.uid())
  );

DROP POLICY IF EXISTS "Only admins can delete turmas" ON public.turmas;
CREATE POLICY "Admins can delete turmas in their instituicao"
  ON public.turmas FOR DELETE
  TO authenticated
  USING (
    is_admin(auth.uid()) AND 
    instituicao_id = get_user_instituicao_ativa(auth.uid())
  );

-- Ambulatórios
DROP POLICY IF EXISTS "Admins can view all ambulatorios" ON public.ambulatorios;
CREATE POLICY "Admins can view ambulatorios from their instituicao"
  ON public.ambulatorios FOR SELECT
  TO authenticated
  USING (
    is_admin(auth.uid()) AND 
    (instituicao_id IS NULL OR instituicao_id = get_user_instituicao_ativa(auth.uid()))
  );

DROP POLICY IF EXISTS "Only admins can insert ambulatorios" ON public.ambulatorios;
CREATE POLICY "Admins can insert ambulatorios in their instituicao"
  ON public.ambulatorios FOR INSERT
  TO authenticated
  WITH CHECK (
    is_admin(auth.uid()) AND 
    instituicao_id = get_user_instituicao_ativa(auth.uid())
  );

DROP POLICY IF EXISTS "Only admins can update ambulatorios" ON public.ambulatorios;
CREATE POLICY "Admins can update ambulatorios in their instituicao"
  ON public.ambulatorios FOR UPDATE
  TO authenticated
  USING (
    is_admin(auth.uid()) AND 
    instituicao_id = get_user_instituicao_ativa(auth.uid())
  );

DROP POLICY IF EXISTS "Only admins can delete ambulatorios" ON public.ambulatorios;
CREATE POLICY "Admins can delete ambulatorios in their instituicao"
  ON public.ambulatorios FOR DELETE
  TO authenticated
  USING (
    is_admin(auth.uid()) AND 
    instituicao_id = get_user_instituicao_ativa(auth.uid())
  );

-- Núcleos
DROP POLICY IF EXISTS "Authenticated users can view nucleos" ON public.nucleos;
CREATE POLICY "Users can view nucleos from their instituicao"
  ON public.nucleos FOR SELECT
  TO authenticated
  USING (
    instituicao_id IS NULL OR 
    instituicao_id = get_user_instituicao_ativa(auth.uid())
  );

DROP POLICY IF EXISTS "Only admins can insert nucleos" ON public.nucleos;
CREATE POLICY "Admins can insert nucleos in their instituicao"
  ON public.nucleos FOR INSERT
  TO authenticated
  WITH CHECK (
    is_admin(auth.uid()) AND 
    instituicao_id = get_user_instituicao_ativa(auth.uid())
  );

DROP POLICY IF EXISTS "Only admins can update nucleos" ON public.nucleos;
CREATE POLICY "Admins can update nucleos in their instituicao"
  ON public.nucleos FOR UPDATE
  TO authenticated
  USING (
    is_admin(auth.uid()) AND 
    instituicao_id = get_user_instituicao_ativa(auth.uid())
  );

DROP POLICY IF EXISTS "Only admins can delete nucleos" ON public.nucleos;
CREATE POLICY "Admins can delete nucleos in their instituicao"
  ON public.nucleos FOR DELETE
  TO authenticated
  USING (
    is_admin(auth.uid()) AND 
    instituicao_id = get_user_instituicao_ativa(auth.uid())
  );

-- Coordenadores
DROP POLICY IF EXISTS "Only admins can view coordenadores" ON public.coordenadores;
CREATE POLICY "Admins can view coordenadores from their instituicao"
  ON public.coordenadores FOR SELECT
  TO authenticated
  USING (
    is_admin(auth.uid()) AND 
    (instituicao_id IS NULL OR instituicao_id = get_user_instituicao_ativa(auth.uid()))
  );

DROP POLICY IF EXISTS "Only admins can insert coordenadores" ON public.coordenadores;
CREATE POLICY "Admins can insert coordenadores in their instituicao"
  ON public.coordenadores FOR INSERT
  TO authenticated
  WITH CHECK (
    is_admin(auth.uid()) AND 
    instituicao_id = get_user_instituicao_ativa(auth.uid())
  );

DROP POLICY IF EXISTS "Only admins can update coordenadores" ON public.coordenadores;
CREATE POLICY "Admins can update coordenadores in their instituicao"
  ON public.coordenadores FOR UPDATE
  TO authenticated
  USING (
    is_admin(auth.uid()) AND 
    instituicao_id = get_user_instituicao_ativa(auth.uid())
  );

DROP POLICY IF EXISTS "Only admins can delete coordenadores" ON public.coordenadores;
CREATE POLICY "Admins can delete coordenadores in their instituicao"
  ON public.coordenadores FOR DELETE
  TO authenticated
  USING (
    is_admin(auth.uid()) AND 
    instituicao_id = get_user_instituicao_ativa(auth.uid())
  );

-- Inserir instituição padrão para dados existentes
INSERT INTO public.instituicoes (nome, tipo, ativo)
VALUES ('Faminas Muriaé', 'producao', true)
RETURNING id;