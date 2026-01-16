-- Adicionar coluna disciplina_id na tabela preceptor_ambulatorio
ALTER TABLE public.preceptor_ambulatorio 
ADD COLUMN disciplina_id uuid REFERENCES public.disciplinas(id);

-- Criar índice para melhor performance
CREATE INDEX idx_preceptor_ambulatorio_disciplina 
ON public.preceptor_ambulatorio(disciplina_id);