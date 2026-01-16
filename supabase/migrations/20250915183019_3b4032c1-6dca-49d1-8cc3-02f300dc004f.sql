-- Link user directly to Administrator preceptor (master role)
INSERT INTO public.preceptor_users (user_id, preceptor_id)
VALUES ('4265cf2d-14b2-418f-8e7f-5884becd5420', '2f6b15d6-8472-46d7-b39e-15dd2de402e7')
ON CONFLICT DO NOTHING;