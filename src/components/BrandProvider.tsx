import React, { createContext, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Organization } from '../types';
import { getBrandBySlug } from '../lib/organizations';

interface BrandContextType {
  brand: Organization | null;
  brandId: string | null;
  slug: string;
  loading: boolean;
  notFound: boolean;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export function BrandProvider({ children }: { children: React.ReactNode }) {
  const { slug = '' } = useParams<{ slug: string }>();
  const [brand, setBrand] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    setBrand(null);

    getBrandBySlug(slug)
      .then((result) => {
        if (cancelled) return;
        if (!result || result.status !== 'active') {
          setNotFound(true);
        } else {
          setBrand(result);
        }
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [slug]);

  return (
    <BrandContext.Provider value={{ brand, brandId: brand?.id ?? null, slug, loading, notFound }}>
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand() {
  const context = useContext(BrandContext);
  if (context === undefined) {
    throw new Error('useBrand must be used within a BrandProvider');
  }
  return context;
}
