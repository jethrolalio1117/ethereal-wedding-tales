
-- Create storage bucket for gallery images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('gallery-images', 'gallery-images', true);

-- Create policy to allow anyone to view gallery images
CREATE POLICY "Allow public viewing of gallery images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'gallery-images');

-- Create policy to allow authenticated users to upload gallery images
CREATE POLICY "Allow authenticated users to upload gallery images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'gallery-images' AND auth.role() = 'authenticated');

-- Create policy to allow authenticated users to delete gallery images
CREATE POLICY "Allow authenticated users to delete gallery images" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'gallery-images' AND auth.role() = 'authenticated');
