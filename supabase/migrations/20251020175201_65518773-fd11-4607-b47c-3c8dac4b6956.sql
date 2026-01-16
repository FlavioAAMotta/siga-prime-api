-- Corrigir preceptores sem instituicao_id
-- Atribuir à primeira instituição de produção encontrada
UPDATE preceptores
SET instituicao_id = (
  SELECT id FROM instituicoes 
  WHERE tipo = 'producao' AND ativo = true 
  LIMIT 1
)
WHERE instituicao_id IS NULL;