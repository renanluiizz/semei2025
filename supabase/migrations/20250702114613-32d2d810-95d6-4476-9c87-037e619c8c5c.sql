-- Confirmar o email do usuário admin manualmente
UPDATE auth.users 
SET email_confirmed_at = NOW(),
    confirmed_at = NOW()
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

-- Garantir RLS nas outras tabelas
-- Activity Types
DROP POLICY IF EXISTS "Staff can view all activity types" ON public.activity_types;
CREATE POLICY "Staff can view all activity types"
ON public.activity_types FOR SELECT
TO authenticated
USING (true);

-- Elders
DROP POLICY IF EXISTS "Staff can view all elders" ON public.elders;
CREATE POLICY "Staff can view all elders"
ON public.elders FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Staff can insert elders" ON public.elders;
CREATE POLICY "Staff can insert elders"
ON public.elders FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Staff can update elders" ON public.elders;
CREATE POLICY "Staff can update elders"
ON public.elders FOR UPDATE
TO authenticated
USING (true);

-- Check-ins
DROP POLICY IF EXISTS "Staff can view all check-ins" ON public.check_ins;
CREATE POLICY "Staff can view all check-ins"
ON public.check_ins FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Staff can insert check-ins" ON public.check_ins;
CREATE POLICY "Staff can insert check-ins"
ON public.check_ins FOR INSERT
TO authenticated
WITH CHECK (true);