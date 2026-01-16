-- Create alunos table
CREATE TABLE public.alunos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  matricula TEXT UNIQUE NOT NULL,
  email TEXT,
  telefone TEXT,
  cpf TEXT,
  data_nascimento DATE,
  turma_id UUID REFERENCES public.turmas(id) ON DELETE SET NULL,
  periodo INTEGER,
  ativo BOOLEAN NOT NULL DEFAULT true,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.alunos ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Usuários autenticados podem visualizar alunos" 
ON public.alunos 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários autenticados podem criar alunos" 
ON public.alunos 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários autenticados podem atualizar alunos" 
ON public.alunos 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Usuários autenticados podem excluir alunos" 
ON public.alunos 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_alunos_updated_at
BEFORE UPDATE ON public.alunos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for aluno files and templates
INSERT INTO storage.buckets (id, name, public) VALUES ('aluno-files', 'aluno-files', false);

-- Create policies for aluno-files bucket
CREATE POLICY "Authenticated users can upload aluno files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'aluno-files' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view aluno files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'aluno-files' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update aluno files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'aluno-files' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete aluno files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'aluno-files' AND auth.uid() IS NOT NULL);