import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { GitHubRepo, GitHubUser, GitHubStats, LANGUAGE_COLORS } from '@/types/github';

const GITHUB_USERNAME = 'mk-knight23';
const MAX_RETRIES = 3;

export function useGitHubData() {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGitHubData = useCallback(async (retryCount = 0) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fnError } = await supabase.functions.invoke('github-data', {
        body: { username: GITHUB_USERNAME }
      });

      if (fnError) {
        // Retry on failure
        if (retryCount < MAX_RETRIES) {
          console.log(`Retrying... attempt ${retryCount + 1}/${MAX_RETRIES}`);
          await new Promise(resolve => setTimeout(resolve, 1500 * (retryCount + 1)));
          return fetchGitHubData(retryCount + 1);
        }
        throw fnError;
      }

      if (data.error) {
        if (retryCount < MAX_RETRIES) {
          console.log(`API error, retrying... attempt ${retryCount + 1}/${MAX_RETRIES}`);
          await new Promise(resolve => setTimeout(resolve, 1500 * (retryCount + 1)));
          return fetchGitHubData(retryCount + 1);
        }
        throw new Error(data.error);
      }

      const { user: userData, repos: reposData } = data;

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

    } catch (err) {
      console.error('Error fetching GitHub data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch GitHub data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGitHubData();
  }, [fetchGitHubData]);

  return { repos, user, stats, loading, error };
}
