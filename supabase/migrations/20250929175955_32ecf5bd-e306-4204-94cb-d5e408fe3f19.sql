-- Primeiro, criar ou atualizar o preceptor administrador
DO $$
DECLARE
  admin_preceptor_id uuid := 'a0000000-0000-0000-0000-000000000001';
BEGIN
  -- Inserir ou atualizar preceptor administrador
  IF NOT EXISTS (SELECT 1 FROM preceptores WHERE id = admin_preceptor_id) THEN
    INSERT INTO preceptores (id, nome, email, especialidade, ativo, crm)
    VALUES (admin_preceptor_id, 'Administrador Sistema', 'admin@admin.com', 'Administrador', true, 'ADMIN');
  ELSE
    UPDATE preceptores 
    SET especialidade = 'Administrador', 
        email = 'admin@admin.com',
        ativo = true
    WHERE id = admin_preceptor_id;
  END IF;

  -- Associar o usuário admin ao preceptor administrador
  IF NOT EXISTS (
    SELECT 1 FROM preceptor_users 
    WHERE user_id = '3af99e53-0110-4607-bb29-1f873a4e227e' 
    AND preceptor_id = admin_preceptor_id
  ) THEN
    INSERT INTO preceptor_users (user_id, preceptor_id)
    VALUES ('3af99e53-0110-4607-bb29-1f873a4e227e', admin_preceptor_id);
  END IF;
END $$;