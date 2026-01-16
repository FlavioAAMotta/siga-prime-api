-- Move "testepreceptor.testepreceptor" para a instituição "Teste"
DO $$
DECLARE
  v_preceptor_id uuid;
  v_instituicao_teste_id uuid;
BEGIN
  SELECT id INTO v_preceptor_id
  FROM public.preceptores
  WHERE usuario = 'testepreceptor.testepreceptor'
     OR email = 'testepreceptor@testepreceptor.com'
  LIMIT 1;

  SELECT id INTO v_instituicao_teste_id
  FROM public.instituicoes
  WHERE nome = 'Teste' AND ativo = true
  ORDER BY created_at ASC
  LIMIT 1;

  IF v_preceptor_id IS NOT NULL AND v_instituicao_teste_id IS NOT NULL THEN
    UPDATE public.preceptores
    SET instituicao_id = v_instituicao_teste_id
    WHERE id = v_preceptor_id;
  END IF;
END $$;