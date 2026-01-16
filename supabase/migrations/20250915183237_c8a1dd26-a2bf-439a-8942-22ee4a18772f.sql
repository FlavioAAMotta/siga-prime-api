CREATE OR REPLACE FUNCTION public.can_access_student(student_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  -- Admins can access all students
  SELECT EXISTS (
    SELECT 1
    FROM preceptor_users pu
    JOIN preceptores p ON pu.preceptor_id = p.id
    WHERE pu.user_id = auth.uid()
      AND p.especialidade = 'Administrador'
  )
  OR
  -- Other users can access students from their assigned classes
  EXISTS (
    SELECT 1
    FROM preceptor_users pu
    JOIN preceptor_ambulatorio pa ON pu.preceptor_id = pa.preceptor_id
    JOIN alunos a ON a.id = student_id
    JOIN turmas t ON a.turma_id = t.id
    WHERE pu.user_id = auth.uid()
      AND pa.ativo = true
      AND a.turma_id IS NOT NULL
      AND (
        pa.turma = t.nome 
        OR pa.turma = CONCAT(t.nome, ' - ', pa.periodo)
        OR EXISTS (
          SELECT 1 
          FROM aluno_turma_pratica atp
          JOIN turmas tp ON atp.turma_pratica_id = tp.id
          WHERE atp.aluno_id = student_id 
            AND pa.turma = tp.nome
        )
      )
  );
$function$