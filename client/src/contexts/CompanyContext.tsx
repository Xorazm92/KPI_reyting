import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Company } from '../types';
import { loadCompaniesFromSupabase, saveCompanyToSupabase, deleteCompanyFromSupabase, subscribeToCompanies } from '../utils/supabase';
import { UZ_RAILWAY_DATA } from '../utils/railwayData';

interface CompanyContextType {
  companies: Company[];
  loading: boolean;
  error: string | null;
  addCompany: (company: Company) => Promise<boolean>;
  updateCompany: (company: Company) => Promise<boolean>;
  deleteCompany: (id: string) => Promise<boolean>;
  refreshCompanies: () => Promise<void>;
  getCompanyById: (id: string) => Company | undefined;
  getChildCompanies: (parentId: string) => Company[];
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export function CompanyProvider({ children }: { children: ReactNode }) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCompanies = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const supabaseData = await loadCompaniesFromSupabase();
      
      if (supabaseData && supabaseData.length > 0) {
        setCompanies(supabaseData);
        console.log(`✅ ${supabaseData.length} ta korxona Supabase'dan yuklandi`);
      } else {
        setCompanies(UZ_RAILWAY_DATA);
        console.log(`📦 ${UZ_RAILWAY_DATA.length} ta korxona lokal ma'lumotlardan yuklandi`);
      }
    } catch (err) {
      console.error('Error loading companies:', err);
      setCompanies(UZ_RAILWAY_DATA);
      setError('Ma\'lumotlarni yuklashda xatolik');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
    
    const unsubscribe = subscribeToCompanies((newCompanies) => {
      setCompanies(newCompanies);
    });
    
    return unsubscribe;
  }, []);

  const addCompany = async (company: Company): Promise<boolean> => {
    try {
      const result = await saveCompanyToSupabase(company);
      if (result) {
        setCompanies(prev => [...prev, company]);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const updateCompany = async (company: Company): Promise<boolean> => {
    try {
      const result = await saveCompanyToSupabase(company);
      if (result) {
        setCompanies(prev => prev.map(c => c.id === company.id ? company : c));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const deleteCompany = async (id: string): Promise<boolean> => {
    try {
      const result = await deleteCompanyFromSupabase(id);
      if (result) {
        setCompanies(prev => prev.filter(c => c.id !== id));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const refreshCompanies = async () => {
    await loadCompanies();
  };

  const getCompanyById = (id: string) => {
    return companies.find(c => c.id === id);
  };

  const getChildCompanies = (parentId: string) => {
    return companies.filter(c => c.supervisorId === parentId);
  };

  return (
    <CompanyContext.Provider value={{
      companies,
      loading,
      error,
      addCompany,
      updateCompany,
      deleteCompany,
      refreshCompanies,
      getCompanyById,
      getChildCompanies
    }}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompanies() {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error('useCompanies must be used within a CompanyProvider');
  }
  return context;
}
