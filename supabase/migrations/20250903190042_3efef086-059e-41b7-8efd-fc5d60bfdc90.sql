-- Criar tabela de ambulatórios
CREATE TABLE public.ambulatorios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  localizacao TEXT,
  capacidade INTEGER DEFAULT 1,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar Row Level Security
ALTER TABLE public.ambulatorios ENABLE ROW LEVEL SECURITY;

-- Políticas RLS - usuários autenticados podem ver todos os ambulatórios
CREATE POLICY "Usuários autenticados podem visualizar ambulatórios" 
ON public.ambulatorios 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Usuários autenticados podem inserir ambulatórios
CREATE POLICY "Usuários autenticados podem criar ambulatórios" 
ON public.ambulatorios 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Usuários autenticados podem atualizar ambulatórios
CREATE POLICY "Usuários autenticados podem atualizar ambulatórios" 
ON public.ambulatorios 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Usuários autenticados podem excluir ambulatórios
CREATE POLICY "Usuários autenticados podem excluir ambulatórios" 
ON public.ambulatorios 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_ambulatorios_updated_at
  BEFORE UPDATE ON public.ambulatorios
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();