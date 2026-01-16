-- Create nucleos table
CREATE TABLE public.nucleos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL UNIQUE,
  descricao TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.nucleos ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Authenticated users can view, only admins can manage
CREATE POLICY "Authenticated users can view nucleos"
ON public.nucleos
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can insert nucleos"
ON public.nucleos
FOR INSERT
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can update nucleos"
ON public.nucleos
FOR UPDATE
USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can delete nucleos"
ON public.nucleos
FOR DELETE
USING (public.is_admin(auth.uid()));

-- Update trigger
CREATE TRIGGER update_nucleos_updated_at
BEFORE UPDATE ON public.nucleos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add nucleo_id to coordenadores table
ALTER TABLE public.coordenadores
ADD COLUMN nucleo_id UUID REFERENCES public.nucleos(id) ON DELETE SET NULL;

-- Create nucleo_disciplinas table for N:N relationship
CREATE TABLE public.nucleo_disciplinas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nucleo_id UUID REFERENCES public.nucleos(id) ON DELETE CASCADE NOT NULL,
  disciplina_id UUID REFERENCES public.disciplinas(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (nucleo_id, disciplina_id)
);

-- Enable RLS
ALTER TABLE public.nucleo_disciplinas ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Authenticated users can view nucleo_disciplinas"
ON public.nucleo_disciplinas
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can insert nucleo_disciplinas"
ON public.nucleo_disciplinas
FOR INSERT
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can update nucleo_disciplinas"
ON public.nucleo_disciplinas
FOR UPDATE
USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can delete nucleo_disciplinas"
ON public.nucleo_disciplinas
FOR DELETE
USING (public.is_admin(auth.uid()));

-- Update trigger
CREATE TRIGGER update_nucleo_disciplinas_updated_at
BEFORE UPDATE ON public.nucleo_disciplinas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();