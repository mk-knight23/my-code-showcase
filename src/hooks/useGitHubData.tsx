import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { GitHubRepo, GitHubUser, GitHubStats, LANGUAGE_COLORS } from '@/types/github';

const GITHUB_USERNAME = 'mk-knight23';

interface GitHubContextType {
  repos: GitHubRepo[];
  user: GitHubUser | null;
  stats: GitHubStats | null;
  loading: boolean;
  error: string | null;
}

const GitHubContext = createContext<GitHubContextType | null>(null);

export function GitHubProvider({ children }: { children: ReactNode }) {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;
    const maxRetries = 3;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fnError } = await supabase.functions.invoke('github-data', {
          body: { username: GITHUB_USERNAME }
        });

        if (!isMounted) return;

        if (fnError || data?.error) {
          const errorMsg = fnError?.message || data?.error || 'Unknown error';
          
          if (retryCount < maxRetries) {
            retryCount++;
            console.log(`Retrying... attempt ${retryCount}/${maxRetries}`);
            setTimeout(fetchData, 1500 * retryCount);
            return;
          }
          
          throw new Error(errorMsg);
        }

        const { user: userData, repos: reposData } = data;

        if (!isMounted) return;

        setUser(userData);
        setRepos(reposData.filter((repo: GitHubRepo) => !repo.fork && !repo.archived));

        // Calculate stats
        const totalStars = reposData.reduce((acc: number, repo: GitHubRepo) => acc + repo.stargazers_count, 0);
        const totalForks = reposData.reduce((acc: number, repo: GitHubRepo) => acc + repo.forks_count, 0);

        // Calculate language distribution
        const languageCounts: Record<string, number> = {};
        reposData.forEach((repo: GitHubRepo) => {
          if (repo.language) {
            languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
          }
        });

        const topLanguages = Object.entries(languageCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 6)
          .map(([name, count]) => ({
            name,
            count,
            color: LANGUAGE_COLORS[name] || '#6e7681',
          }));

        setStats({
          totalStars,
          totalForks,
          totalRepos: userData.public_repos,
          followers: userData.followers,
          following: userData.following,
          topLanguages,
        });

        setLoading(false);

      } catch (err) {
        if (!isMounted) return;
        console.error('Error fetching GitHub data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch GitHub data');
        setLoading(false);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <GitHubContext.Provider value={{ repos, user, stats, loading, error }}>
      {children}
    </GitHubContext.Provider>
  );
}

export function useGitHubData() {
  const context = useContext(GitHubContext);
  if (!context) {
    throw new Error('useGitHubData must be used within a GitHubProvider');
  }
  return context;
}
