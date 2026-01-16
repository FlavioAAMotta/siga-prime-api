-- Criar tabela para associar alunos a turmas de prática
CREATE TABLE public.aluno_turma_pratica (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  aluno_id UUID NOT NULL REFERENCES public.alunos(id) ON DELETE CASCADE,
  turma_pratica_id UUID NOT NULL REFERENCES public.turmas(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(aluno_id, turma_pratica_id)
);

-- Habilitar RLS
ALTER TABLE public.aluno_turma_pratica ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS
CREATE POLICY "Usuários autenticados podem visualizar associações aluno-turma prática" 
ON public.aluno_turma_pratica 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários autenticados podem criar associações aluno-turma prática" 
ON public.aluno_turma_pratica 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários autenticados podem excluir associações aluno-turma prática" 
ON public.aluno_turma_pratica 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Criar trigger para updated_at
CREATE TRIGGER update_aluno_turma_pratica_updated_at
BEFORE UPDATE ON public.aluno_turma_pratica
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();