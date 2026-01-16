-- Update RLS policies for avaliacoes table to allow admin access

-- Drop existing policies
DROP POLICY IF EXISTS "Coordenadores podem fazer tudo com avaliações" ON avaliacoes;
DROP POLICY IF EXISTS "Preceptores podem gerenciar avaliações de seus ambulatórios" ON avaliacoes;

-- Create new policies
-- Allow all authenticated users to read avaliacoes (coordinators and preceptors)
CREATE POLICY "Usuários autenticados podem visualizar avaliações" 
ON avaliacoes 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Allow all authenticated users to create/update/delete avaliacoes
CREATE POLICY "Usuários autenticados podem gerenciar avaliações" 
ON avaliacoes 
FOR ALL 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);