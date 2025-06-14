
-- Update the user who signed up with admin@wedding.com to have admin role
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'admin@wedding.com';
