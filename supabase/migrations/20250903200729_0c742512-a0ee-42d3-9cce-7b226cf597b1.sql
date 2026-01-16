-- Create enum for turma types
CREATE TYPE public.tipo_turma AS ENUM ('periodo', 'pratica');

-- Create turmas table
CREATE TABLE public.turmas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  tipo public.tipo_turma NOT NULL,
  turma_periodo_id UUID REFERENCES public.turmas(id) ON DELETE CASCADE,
  periodo_letivo TEXT, -- Ex: "2024.1", "2024.2"
  ano INTEGER,
  semestre INTEGER CHECK (semestre IN (1, 2)),
  capacidade INTEGER DEFAULT 1,
  ativo BOOLEAN NOT NULL DEFAULT true,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Constraint: turmas de prática devem referenciar uma turma de período
  CONSTRAINT turma_pratica_deve_ter_periodo 
    CHECK (
      (tipo = 'periodo' AND turma_periodo_id IS NULL) OR 
      (tipo = 'pratica' AND turma_periodo_id IS NOT NULL)
    )
);

-- Enable Row Level Security
ALTER TABLE public.turmas ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Usuários autenticados podem visualizar turmas" 
ON public.turmas 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários autenticados podem criar turmas" 
ON public.turmas 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários autenticados podem atualizar turmas" 
ON public.turmas 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários autenticados podem excluir turmas" 
ON public.turmas 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_turmas_updated_at
BEFORE UPDATE ON public.turmas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();