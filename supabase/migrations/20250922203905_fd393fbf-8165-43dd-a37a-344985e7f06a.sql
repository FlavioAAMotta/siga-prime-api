-- First, create "Sem disc" discipline if it doesn't exist
INSERT INTO public.disciplinas (nome, codigo, descricao, ativo)
VALUES ('Sem disc', 'SD001', 'Sem disciplina específica', true)
ON CONFLICT DO NOTHING;

-- Update all ambulatorios that have CLINICA CIRURGICA I to use "Sem disc"
UPDATE public.ambulatorios 
SET disciplina_id = (
  SELECT id FROM public.disciplinas 
  WHERE nome = 'Sem disc' 
  LIMIT 1
)
WHERE disciplina_id = (
  SELECT id FROM public.disciplinas 
  WHERE nome = 'CLINICA CIRURGICA I' 
  LIMIT 1
);