import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  username: string;
}

// Simple in-memory cache
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function fetchWithRetry(url: string, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Lovable-Portfolio-App',
      },
    });
    
    if (response.ok) {
      return response;
    }
    
    // If rate limited, wait and retry
    if (response.status === 403 || response.status === 429) {
      console.log(`Rate limited, attempt ${i + 1}/${retries}, waiting...`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      continue;
    }
    
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }
  
  throw new Error('Max retries exceeded');
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { username }: RequestBody = await req.json();

    if (!username) {
      throw new Error('Username is required');
    }

    const cacheKey = `github_${username}`;
    const cached = cache.get(cacheKey);
    
    // Return cached data if still valid
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log(`Returning cached data for user: ${username}`);
      return new Response(
        JSON.stringify(cached.data),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    console.log(`Fetching GitHub data for user: ${username}`);

    // Fetch user data with retry
    const userResponse = await fetchWithRetry(`https://api.github.com/users/${username}`);
    const userData = await userResponse.json();
    console.log(`User data fetched: ${userData.name || userData.login}`);

    // Fetch all repositories (paginated) with retry
    const allRepos = [];
    let page = 1;
    const perPage = 100;

    while (true) {
      const reposResponse = await fetchWithRetry(
        `https://api.github.com/users/${username}/repos?per_page=${perPage}&page=${page}&sort=updated`
      );

      const repos = await reposResponse.json();
      
      if (repos.length === 0) break;
      
      allRepos.push(...repos);
      
      if (repos.length < perPage) break;
      page++;
    }

    console.log(`Fetched ${allRepos.length} repositories`);

    const responseData = {
      user: userData,
      repos: allRepos,
    };

    // Cache the result
    cache.set(cacheKey, { data: responseData, timestamp: Date.now() });

    return new Response(
      JSON.stringify(responseData),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error: unknown) {
    console.error('Error in github-data function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
});
