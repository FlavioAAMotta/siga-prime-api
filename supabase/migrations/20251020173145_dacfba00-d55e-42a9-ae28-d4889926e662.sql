-- Grant admin role to the current user to satisfy disciplinas RLS
INSERT INTO public.user_roles (user_id, role)
VALUES ('7c14c2fa-61e0-4c7f-95c1-103185c559d1', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;