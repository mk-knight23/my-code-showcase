import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const ogImageCache = new Map<string, string | null>();

export function useOgImage(url: string | null) {
  const [ogImage, setOgImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!url) {
      setOgImage(null);
      return;
    }

    // Check cache first
    if (ogImageCache.has(url)) {
      setOgImage(ogImageCache.get(url) || null);
      return;
    }

    let isMounted = true;

    async function fetchOgImage() {
      setLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke('fetch-og-image', {
          body: { url }
        });

        if (!isMounted) return;

        if (error) {
          console.log('Error fetching OG image:', error);
          ogImageCache.set(url, null);
          setOgImage(null);
        } else {
          const imageUrl = data?.ogImage || null;
          ogImageCache.set(url, imageUrl);
          setOgImage(imageUrl);
        }
      } catch (err) {
        console.log('Failed to fetch OG image:', err);
        ogImageCache.set(url, null);
        setOgImage(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchOgImage();

    return () => {
      isMounted = false;
    };
  }, [url]);

  return { ogImage, loading };
}
