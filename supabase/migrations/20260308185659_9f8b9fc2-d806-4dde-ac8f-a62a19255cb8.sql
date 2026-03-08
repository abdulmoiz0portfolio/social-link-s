
-- Create avatars storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Allow anyone to view avatars
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');

-- Allow authenticated users to upload avatars
CREATE POLICY "Authenticated users can upload avatars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND (auth.role() = 'authenticated' OR auth.role() = 'anon'));

-- Allow authenticated users to update their avatars
CREATE POLICY "Users can update their own avatars" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars') WITH CHECK (bucket_id = 'avatars');

-- Allow authenticated users to delete their avatars
CREATE POLICY "Users can delete their own avatars" ON storage.objects FOR DELETE USING (bucket_id = 'avatars');
