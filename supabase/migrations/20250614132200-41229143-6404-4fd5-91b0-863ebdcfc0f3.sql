
-- First, let's see what users exist and update your role to admin
-- Replace 'jethrolalio1117@gmail.com' with your actual email if different
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'jethrolalio1117@gmail.com';

-- If no profile exists yet, let's insert one
-- (This handles the case where the profile trigger didn't create one)
INSERT INTO public.profiles (id, email, full_name, role)
SELECT 
  auth.users.id,
  auth.users.email,
  auth.users.raw_user_meta_data ->> 'full_name',
  'admin'
FROM auth.users 
WHERE auth.users.email = 'jethrolalio1117@gmail.com'
  AND NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.users.id
  );
