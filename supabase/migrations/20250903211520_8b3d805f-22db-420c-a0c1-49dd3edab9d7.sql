-- Adicionar campo semestre_ingresso à tabela alunos
ALTER TABLE public.alunos 
ADD COLUMN semestre_ingresso TEXT;