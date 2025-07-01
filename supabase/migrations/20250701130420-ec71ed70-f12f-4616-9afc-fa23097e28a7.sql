
-- Add missing columns to the staff table
ALTER TABLE public.staff 
ADD COLUMN cpf text,
ADD COLUMN phone text,
ADD COLUMN position text,
ADD COLUMN status text NOT NULL DEFAULT 'active';

-- Add a check constraint to ensure status is either 'active' or 'inactive'
ALTER TABLE public.staff 
ADD CONSTRAINT staff_status_check CHECK (status IN ('active', 'inactive'));
