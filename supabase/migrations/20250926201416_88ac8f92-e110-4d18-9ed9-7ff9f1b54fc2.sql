-- Criar tabela para associar preceptores às disciplinas
CREATE TABLE public.preceptor_disciplina (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  preceptor_id UUID NOT NULL,
  disciplina_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(preceptor_id, disciplina_id)
);

-- Habilitar RLS
ALTER TABLE public.preceptor_disciplina ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS
CREATE POLICY "Usuários autenticados podem visualizar associações preceptor-disciplina"
ON public.preceptor_disciplina
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários autenticados podem criar associações preceptor-disciplina"
ON public.preceptor_disciplina
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários autenticados podem excluir associações preceptor-disciplina"
ON public.preceptor_disciplina
FOR DELETE
USING (auth.uid() IS NOT NULL);

-- Criar trigger para updated_at
CREATE TRIGGER update_preceptor_disciplina_updated_at
BEFORE UPDATE ON public.preceptor_disciplina
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();