-- Allow admins (preceptores with especialidade = 'Administrador') to view all attendance records
create policy if not exists "Administradores podem ver todas as presenças"
  on public.aluno_presencas
  for select
  using (
    exists (
      select 1
      from public.preceptor_users pu
      join public.preceptores p on p.id = pu.preceptor_id
      where pu.user_id = auth.uid()
        and p.especialidade = 'Administrador'
    )
  );