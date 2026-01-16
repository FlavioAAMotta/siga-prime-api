-- Vincular usuário admin@admin.com à instituição Faminas Muriaé
INSERT INTO user_instituicao (user_id, instituicao_id, ativa)
SELECT 
  u.id,
  '3714eb23-598a-40d8-a783-f7eed17f7541'::uuid,
  true
FROM auth.users u
WHERE u.email = 'admin@admin.com'
ON CONFLICT DO NOTHING;