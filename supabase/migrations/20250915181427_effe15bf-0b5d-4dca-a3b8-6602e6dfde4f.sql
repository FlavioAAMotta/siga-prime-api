-- Inserir um preceptor administrador padrão
INSERT INTO preceptores (nome, especialidade, ativo, email) 
VALUES ('Administrador do Sistema', 'Administrador', true, 'admin@sistema.com')
ON CONFLICT DO NOTHING;

-- Criar função para vincular usuário autenticado ao preceptor administrador
CREATE OR REPLACE FUNCTION link_user_to_admin()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_preceptor_id uuid;
BEGIN
  -- Buscar o preceptor administrador
  SELECT id INTO admin_preceptor_id 
  FROM preceptores 
  WHERE especialidade = 'Administrador' 
  LIMIT 1;
  
  -- Se usuário estiver autenticado e não tiver vínculo, criar
  IF auth.uid() IS NOT NULL AND admin_preceptor_id IS NOT NULL THEN
    INSERT INTO preceptor_users (user_id, preceptor_id)
    VALUES (auth.uid(), admin_preceptor_id)
    ON CONFLICT (user_id, preceptor_id) DO NOTHING;
  END IF;
END;
$$;

-- Executar a função para vincular usuário atual (se autenticado)
SELECT link_user_to_admin();