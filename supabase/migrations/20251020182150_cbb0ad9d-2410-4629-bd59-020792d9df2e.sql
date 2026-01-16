-- Corrigir RLS para alunos: criar trigger para preencher automaticamente instituicao_id

-- Criar função para preencher instituicao_id quando não estiver presente
CREATE OR REPLACE FUNCTION public.set_instituicao_id_for_alunos()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Se instituicao_id não foi informado ou é NULL, buscar a instituição ativa do usuário
  IF NEW.instituicao_id IS NULL THEN
    SELECT instituicao_id INTO NEW.instituicao_id
    FROM public.user_instituicao
    WHERE user_id = auth.uid() AND ativa = true
    LIMIT 1;
    
    -- Se não encontrou instituição ativa, usar a primeira disponível do usuário
    IF NEW.instituicao_id IS NULL THEN
      SELECT instituicao_id INTO NEW.instituicao_id
      FROM public.user_instituicao
      WHERE user_id = auth.uid()
      ORDER BY created_at ASC
      LIMIT 1;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$function$ LANGUAGE plpgsql;

-- Criar trigger para executar antes de INSERT na tabela alunos
DROP TRIGGER IF EXISTS trigger_set_instituicao_id_alunos ON public.alunos;
CREATE TRIGGER trigger_set_instituicao_id_alunos
  BEFORE INSERT ON public.alunos
  FOR EACH ROW
  EXECUTE FUNCTION public.set_instituicao_id_for_alunos();