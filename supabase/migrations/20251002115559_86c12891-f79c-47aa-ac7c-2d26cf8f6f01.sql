-- Create coordenadores table
CREATE TABLE public.coordenadores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  telefone TEXT,
  cpf TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.coordenadores ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Only admins can manage coordenadores
CREATE POLICY "Only admins can view coordenadores"
ON public.coordenadores
FOR SELECT
USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can insert coordenadores"
ON public.coordenadores
FOR INSERT
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can update coordenadores"
ON public.coordenadores
FOR UPDATE
USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can delete coordenadores"
ON public.coordenadores
FOR DELETE
USING (public.is_admin(auth.uid()));

-- Update trigger
CREATE TRIGGER update_coordenadores_updated_at
BEFORE UPDATE ON public.coordenadores
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create coordenador_users table to link auth users to coordenadores
CREATE TABLE public.coordenador_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  coordenador_id UUID REFERENCES public.coordenadores(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (user_id, coordenador_id)
);

-- Enable RLS
ALTER TABLE public.coordenador_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Only admins can view coordenador_users"
ON public.coordenador_users
FOR SELECT
USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can insert coordenador_users"
ON public.coordenador_users
FOR INSERT
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can update coordenador_users"
ON public.coordenador_users
FOR UPDATE
USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can delete coordenador_users"
ON public.coordenador_users
FOR DELETE
USING (public.is_admin(auth.uid()));

-- Update trigger
CREATE TRIGGER update_coordenador_users_updated_at
BEFORE UPDATE ON public.coordenador_users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();