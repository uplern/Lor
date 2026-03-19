const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://afgcwlinfecgutsbtgbs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmZ2N3bGluZmVjZ3V0c2J0Z2JzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mzg4NzcwNCwiZXhwIjoyMDg5NDYzNzA0fQ.PVOIorKS3hvYGFDbWCDwgxjJcL4rKNjJaZuWm6DRIX0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTemplates() {
  const { data, error } = await supabase.from('templates').select('*');
  if (error) {
    console.error('Error fetching templates:', error);
    return;
  }
  console.log('Templates:', JSON.stringify(data, null, 2));
}

checkTemplates();
