import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uqxtzlmdvmseirolfwgq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxeHR6bG1kdm1zZWlyb2xmd2dxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM0OTgzNjgsImV4cCI6MjA0OTA3NDM2OH0.hIHxKbQfX0vZYOgXW3f2n9Pj9Qv3KUOHSBPiV9CKqpI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// API endpoint (for testing/backup)
export const API_BASE_URL = import.meta.env.DEV
  ? 'http://localhost:3001/api'
  : '/api';

// Test API connection
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('count');

    if (error) {
      console.error('❌ Supabase connection failed:', error);
      return false;
    }

    console.log('✅ Supabase connection successful');
    return true;
  } catch (err) {
    console.error('❌ Supabase connection error:', err);
    return false;
  }
}

export const loadCompaniesFromSupabase = async () => {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('overallIndex', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return null;
    }

    console.log(`✅ Supabase: ${data?.length || 0} ta korxona yuklandi`);
    return data;
  } catch (err) {
    console.error('Failed to load from Supabase:', err);
    return null;
  }
};

export const saveCompanyToSupabase = async (company: any) => {
  try {
    const { data, error } = await supabase
      .from('companies')
      .upsert(company, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      console.error('Save error:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Failed to save company:', err);
    return null;
  }
};

export const deleteCompanyFromSupabase = async (id: string) => {
  try {
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete error:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Failed to delete company:', err);
    return false;
  }
};

export const subscribeToCompanies = (callback: (companies: any[]) => void) => {
  const channel = supabase
    .channel('companies-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'companies' },
      async () => {
        const companies = await loadCompaniesFromSupabase();
        if (companies) callback(companies);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};