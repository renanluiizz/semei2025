-- Criar trigger para automaticamente inserir usuários na tabela staff
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.staff (id, email, full_name, role, status)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'operator',
    'active'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger se não existir
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Atualizar o usuário renanluiizz@live.com para admin se já existir
UPDATE public.staff 
SET role = 'admin', status = 'active', full_name = 'Renan Luiz da Silva Alves (Admin)'
WHERE email = 'renanluiizz@live.com';

-- Garantir que a constraint de status está correta
ALTER TABLE public.staff DROP CONSTRAINT IF EXISTS staff_status_check;
ALTER TABLE public.staff 
ADD CONSTRAINT staff_status_check CHECK (status IN ('active', 'inactive'));

-- Garantir que a constraint de role está correta  
ALTER TABLE public.staff DROP CONSTRAINT IF EXISTS staff_role_check;
ALTER TABLE public.staff 
ADD CONSTRAINT staff_role_check CHECK (role IN ('admin', 'operator'));