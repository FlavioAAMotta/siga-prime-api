-- Adicionar colunas de período de execução à tabela preceptor_ambulatorio
ALTER TABLE public.preceptor_ambulatorio 
ADD COLUMN data_inicio date,
ADD COLUMN data_fim date;

-- Atualizar registros existentes para ter data_inicio como hoje e data_fim como 3 meses à frente
UPDATE public.preceptor_ambulatorio 
SET data_inicio = CURRENT_DATE,
    data_fim = CURRENT_DATE + INTERVAL '3 months'
WHERE data_inicio IS NULL;