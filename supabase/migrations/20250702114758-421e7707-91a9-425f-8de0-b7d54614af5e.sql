-- Confirmar o email do usuário admin manualmente
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email = 'renanluiizz@live.com';

-- Verificar se existem políticas RLS corretas
-- Garantir que as políticas de staff permitem acesso
DROP POLICY IF EXISTS "Staff can view all staff members" ON public.staff;
CREATE POLICY "Staff can view all staff members"
ON public.staff FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Staff can update staff members" ON public.staff;
CREATE POLICY "Staff can update staff members"
ON public.staff FOR UPDATE
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Staff can insert staff members" ON public.staff;
CREATE POLICY "Staff can insert staff members"
ON public.staff FOR INSERT
TO authenticated
WITH CHECK (true);