import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  username: string;
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

    console.log(`Fetching GitHub data for user: ${username}`);

    // Fetch user data
    const userResponse = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Lovable-Portfolio-App',
      },
    });

    if (!userResponse.ok) {
      throw new Error(`Failed to fetch user: ${userResponse.statusText}`);
    }

    const userData = await userResponse.json();
    console.log(`User data fetched: ${userData.name || userData.login}`);

    // Fetch all repositories (paginated)
    const allRepos = [];
    let page = 1;
    const perPage = 100;

    while (true) {
      const reposResponse = await fetch(
        `https://api.github.com/users/${username}/repos?per_page=${perPage}&page=${page}&sort=updated`,
        {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Lovable-Portfolio-App',
          },
        }
      );

      if (!reposResponse.ok) {
        throw new Error(`Failed to fetch repos: ${reposResponse.statusText}`);
      }

      const repos = await reposResponse.json();
      
      if (repos.length === 0) break;
      
      allRepos.push(...repos);
      
      if (repos.length < perPage) break;
      page++;
    }

    console.log(`Fetched ${allRepos.length} repositories`);

    return new Response(
      JSON.stringify({
        user: userData,
        repos: allRepos,
      }),
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
