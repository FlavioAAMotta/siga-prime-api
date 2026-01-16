
-- Criar preceptor Administrador para instituição Teste
INSERT INTO preceptores (nome, email, especialidade, ativo, instituicao_id)
VALUES (
  'Admin Teste',
  'testeiees@testeiees.com',
  'Administrador',
  true,
  'e182530b-53e5-4daa-9ecf-c25dedc4ca24'
)
ON CONFLICT DO NOTHING;

-- Vincular o usuário ao novo preceptor
INSERT INTO preceptor_users (user_id, preceptor_id)
SELECT 
  '7c14c2fa-61e0-4c7f-95c1-103185c559d1',
  p.id
FROM preceptores p
WHERE p.email = 'testeiees@testeiees.com'
  AND p.especialidade = 'Administrador'
  AND p.instituicao_id = 'e182530b-53e5-4daa-9ecf-c25dedc4ca24'
ON CONFLICT DO NOTHING;
