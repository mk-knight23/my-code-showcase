import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  'https://eyvfhqqwunmbcaynqocc.supabase.co',
  'http://localhost:8080',
  'http://localhost:5173',
  'http://localhost:3000',
];

const LOVABLE_ORIGIN_PATTERN = /^https:\/\/[a-z0-9-]+\.lovableproject\.com$/;

function getCorsHeaders(req: Request) {
  const origin = req.headers.get('origin') || '';
  const isAllowed = ALLOWED_ORIGINS.includes(origin) || LOVABLE_ORIGIN_PATTERN.test(origin);
  
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
}

// Validate URL format
function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

// Extract OG image from HTML
function extractOgImage(html: string): string | null {
  // Try og:image first
  const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
                       html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
  
  if (ogImageMatch?.[1]) {
    return ogImageMatch[1];
  }

  // Try twitter:image as fallback
  const twitterImageMatch = html.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i) ||
                            html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:image["']/i);
  
  if (twitterImageMatch?.[1]) {
    return twitterImageMatch[1];
  }

  return null;
}

serve(async (req: Request) => {
  const corsHeaders = getCorsHeaders(req);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    if (!url || !isValidUrl(url)) {
      return new Response(
        JSON.stringify({ error: 'Valid URL is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    console.log(`Fetching OG image for: ${url}`);

    // Fetch the page with a timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; OGImageBot/1.0)',
          'Accept': 'text/html',
        },
      });

      clearTimeout(timeout);

      if (!response.ok) {
        console.log(`Failed to fetch ${url}: ${response.status}`);
        return new Response(
          JSON.stringify({ ogImage: null }),
          { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }

      // Only read first 50KB to find meta tags (they're in the head)
      const reader = response.body?.getReader();
      let html = '';
      let bytesRead = 0;
      const maxBytes = 50000;

      if (reader) {
        const decoder = new TextDecoder();
        while (bytesRead < maxBytes) {
          const { done, value } = await reader.read();
          if (done) break;
          html += decoder.decode(value, { stream: true });
          bytesRead += value.length;
          
          // If we've found </head>, we can stop early
          if (html.includes('</head>')) break;
        }
        reader.cancel();
      }

      const ogImage = extractOgImage(html);
      console.log(`OG image found: ${ogImage ? 'yes' : 'no'}`);

      return new Response(
        JSON.stringify({ ogImage }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );

    } catch (fetchError) {
      clearTimeout(timeout);
      console.log(`Fetch error for ${url}:`, fetchError);
      return new Response(
        JSON.stringify({ ogImage: null }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch OG image' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
});
