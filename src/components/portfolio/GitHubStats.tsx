import { motion } from 'framer-motion';
import { Star, GitFork, Users, FolderGit2, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useGitHubData } from '@/hooks/useGitHubData';

export function GitHubStats() {
  const { stats, user, loading } = useGitHubData();

  if (loading || !stats || !user) return null;

  const statItems = [
    { icon: FolderGit2, label: 'Repositories', value: stats.totalRepos, color: 'text-primary' },
    { icon: Star, label: 'Total Stars', value: stats.totalStars, color: 'text-secondary' },
    { icon: GitFork, label: 'Total Forks', value: stats.totalForks, color: 'text-primary' },
    { icon: Users, label: 'Followers', value: stats.followers, color: 'text-terminal-green' },
  ];

  return (
    <section className="py-24 relative bg-muted/30">
      <div className="absolute inset-0 bg-grid opacity-20" />
      
      <div className="container px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">GitHub Stats</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            My open source contributions at a glance
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {statItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="glass border-glow hover:glow-primary transition-all duration-300 text-center">
                <CardContent className="pt-6">
                  <item.icon className={`h-8 w-8 mx-auto mb-3 ${item.color}`} />
                  <div className="text-3xl md:text-4xl font-bold mb-1">{item.value}</div>
                  <div className="text-muted-foreground text-sm">{item.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Language Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Card className="glass border-glow max-w-3xl mx-auto">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-6 justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">Most Used Languages</h3>
              </div>
              
              {/* Language bar */}
              <div className="h-4 rounded-full overflow-hidden flex mb-4">
                {stats.topLanguages.map((lang, index) => {
                  const percentage = (lang.count / stats.topLanguages.reduce((a, b) => a + b.count, 0)) * 100;
                  return (
                    <motion.div
                      key={lang.name}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="h-full"
                      style={{ backgroundColor: lang.color }}
                      title={`${lang.name}: ${lang.count} repos`}
                    />
                  );
                })}
              </div>

              {/* Language legend */}
              <div className="flex flex-wrap justify-center gap-4">
                {stats.topLanguages.map((lang) => (
                  <div key={lang.name} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: lang.color }}
                    />
                    <span className="text-sm text-muted-foreground">
                      {lang.name} ({lang.count})
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
