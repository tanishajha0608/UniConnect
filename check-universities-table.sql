-- Check the structure of the existing universities table
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'universities' 
ORDER BY ordinal_position;

