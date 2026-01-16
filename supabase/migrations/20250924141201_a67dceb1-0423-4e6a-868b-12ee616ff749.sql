-- Adicionar campo usuario na tabela preceptores
ALTER TABLE public.preceptores 
ADD COLUMN usuario text UNIQUE;

-- Criar índice para o campo usuario
CREATE INDEX idx_preceptores_usuario ON public.preceptores(usuario);

-- Comentário explicativo
COMMENT ON COLUMN public.preceptores.usuario IS 'Nome de usuário único para login no sistema';