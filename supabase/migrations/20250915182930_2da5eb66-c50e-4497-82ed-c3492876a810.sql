-- Ensure unique pairing of user and preceptor to support ON CONFLICT usage
ALTER TABLE public.preceptor_users
ADD CONSTRAINT IF NOT EXISTS preceptor_users_user_id_preceptor_id_key UNIQUE (user_id, preceptor_id);

-- Ensure the requesting user is linked to the Administrator preceptor (master access)
-- Note: user id obtained from recent auth logs
INSERT INTO public.preceptor_users (user_id, preceptor_id)
SELECT '4265cf2d-14b2-418f-8e7f-5884becd5420', p.id
FROM public.preceptores p
WHERE p.especialidade = 'Administrador'
LIMIT 1
ON CONFLICT (user_id, preceptor_id) DO NOTHING;