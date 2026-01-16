-- First, create a default discipline "CLINICA CIRURGICA I" if it doesn't exist
INSERT INTO public.disciplinas (nome, codigo, descricao, ativo)
VALUES ('CLINICA CIRURGICA I', 'CCI001', 'Disciplina padrão para ambulatórios existentes', true)
ON CONFLICT DO NOTHING;

-- Add disciplina_id column to ambulatorios table
ALTER TABLE public.ambulatorios 
ADD COLUMN disciplina_id UUID;

-- Update all existing ambulatorios to reference the default discipline
UPDATE public.ambulatorios 
SET disciplina_id = (
  SELECT id FROM public.disciplinas 
  WHERE nome = 'CLINICA CIRURGICA I' 
  LIMIT 1
);

-- Now make the column NOT NULL since all records have been updated
ALTER TABLE public.ambulatorios 
ALTER COLUMN disciplina_id SET NOT NULL;

-- Add foreign key constraint
ALTER TABLE public.ambulatorios
ADD CONSTRAINT ambulatorios_disciplina_id_fkey 
FOREIGN KEY (disciplina_id) REFERENCES public.disciplinas(id);