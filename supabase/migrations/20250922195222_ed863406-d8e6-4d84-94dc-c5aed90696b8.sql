-- Corrigir todas as funções com search_path mutável
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.calcular_status_entrada(hora_entrada timestamp with time zone, hora_programada time without time zone)
 RETURNS record
 LANGUAGE plpgsql
 SET search_path = 'public'
AS $function$
DECLARE
  hora_entrada_time TIME;
  diferenca_minutos INTEGER;
  status TEXT;
  result RECORD;
BEGIN
  -- Extrair apenas o horário da entrada
  hora_entrada_time := hora_entrada::TIME;
  
  -- Calcular diferença em minutos
  diferenca_minutos := EXTRACT(EPOCH FROM (hora_entrada_time - hora_programada)) / 60;
  
  -- Determinar status
  IF diferenca_minutos <= -10 THEN
    status := 'adiantado';
  ELSIF diferenca_minutos <= 15 THEN
    status := 'pontual';
  ELSE
    status := 'atraso';
  END IF;
  
  SELECT status, GREATEST(0, diferenca_minutos) INTO result;
  RETURN result;
END;
$function$;

CREATE OR REPLACE FUNCTION public.link_user_to_admin()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
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
$function$;