
-- Update the user who signed up with jethrolalio1117@gmail.com to have admin role
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'jethrolalio1117@gmail.com';
