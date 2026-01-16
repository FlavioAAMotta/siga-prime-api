-- Allow admins (preceptores with especialidade = 'Administrador') to view all attendance records
CREATE POLICY "Administradores podem ver todas as presenças"
  ON public.aluno_presencas
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.preceptor_users pu
      JOIN public.preceptores p ON p.id = pu.preceptor_id
      WHERE pu.user_id = auth.uid()
        AND p.especialidade = 'Administrador'
    )
  );