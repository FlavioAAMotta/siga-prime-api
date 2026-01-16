-- Adicionar campos de controle de período às disciplinas
ALTER TABLE public.disciplinas
ADD COLUMN IF NOT EXISTS data_inicio DATE,
ADD COLUMN IF NOT EXISTS data_fim DATE,
ADD COLUMN IF NOT EXISTS periodo_numero INTEGER;

-- Criar tabela de associação aluno-disciplina
CREATE TABLE IF NOT EXISTS public.aluno_disciplina (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aluno_id UUID NOT NULL REFERENCES public.alunos(id) ON DELETE CASCADE,
  disciplina_id UUID NOT NULL REFERENCES public.disciplinas(id) ON DELETE CASCADE,
  turma_pratica_id UUID REFERENCES public.turmas(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(aluno_id, disciplina_id, turma_pratica_id)
);

-- Habilitar RLS na tabela aluno_disciplina
ALTER TABLE public.aluno_disciplina ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para aluno_disciplina
CREATE POLICY "Admins can manage all aluno_disciplina"
ON public.aluno_disciplina
FOR ALL
TO authenticated
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Coordenadores can view aluno_disciplina from their nucleo"
ON public.aluno_disciplina
FOR SELECT
TO authenticated
USING (
  is_coordenador(auth.uid()) AND 
  disciplina_in_coordenador_nucleo(disciplina_id, auth.uid())
);

CREATE POLICY "Alunos can view their own associations"
ON public.aluno_disciplina
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.aluno_users au
    WHERE au.user_id = auth.uid() AND au.aluno_id = aluno_disciplina.aluno_id
  )
);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_aluno_disciplina_updated_at
BEFORE UPDATE ON public.aluno_disciplina
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();