-- Create preceptor_ambulatorio table for many-to-many relationship
CREATE TABLE public.preceptor_ambulatorio (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  preceptor_id UUID NOT NULL REFERENCES public.preceptores(id) ON DELETE CASCADE,
  ambulatorio_id UUID NOT NULL REFERENCES public.ambulatorios(id) ON DELETE CASCADE,
  dia_semana INTEGER, -- 0=Domingo, 1=Segunda, ..., 6=Sábado
  horario_inicio TIME,
  horario_fim TIME,
  turma TEXT, -- Por enquanto como texto, depois podemos referenciar tabela de turmas
  periodo TEXT, -- Ex: "2024.1", "2024.2"
  ativo BOOLEAN NOT NULL DEFAULT true,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Evita duplicatas para mesmo preceptor, ambulatorio, dia e horário
  UNIQUE(preceptor_id, ambulatorio_id, dia_semana, horario_inicio, turma, periodo)
);

-- Enable Row Level Security
ALTER TABLE public.preceptor_ambulatorio ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Usuários autenticados podem visualizar associações preceptor-ambulatório" 
ON public.preceptor_ambulatorio 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários autenticados podem criar associações preceptor-ambulatório" 
ON public.preceptor_ambulatorio 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários autenticados podem atualizar associações preceptor-ambulatório" 
ON public.preceptor_ambulatorio 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários autenticados podem excluir associações preceptor-ambulatório" 
ON public.preceptor_ambulatorio 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_preceptor_ambulatorio_updated_at
BEFORE UPDATE ON public.preceptor_ambulatorio
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();