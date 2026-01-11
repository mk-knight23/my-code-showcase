import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Filter, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProjectCard } from './ProjectCard';
import { useGitHubData } from '@/hooks/useGitHubData';
import { GitHubRepo, ProjectCategory } from '@/types/github';

const categories: { id: ProjectCategory; label: string; keywords: string[] }[] = [
  { id: 'all', label: 'All Projects', keywords: [] },
  { id: 'ai-ml', label: 'AI & ML', keywords: ['ai', 'ml', 'gpt', 'llm', 'chatbot', 'nlp', 'huggingface', 'langchain', 'openai', 'friday', 'chatgpt'] },
  { id: 'web-apps', label: 'Web Apps', keywords: ['web', 'app', 'portal', 'dashboard', 'website', 'next', 'react', 'builder'] },
  { id: 'automation', label: 'Automation', keywords: ['automation', 'n8n', 'make', 'workflow', 'cli', 'vibe'] },
  { id: 'games', label: 'Games & Fun', keywords: ['game', 'games', 'meme', 'draw', 'fun', 'quiz'] },
  { id: 'templates', label: 'Templates', keywords: ['template', 'starter', 'boilerplate', 'garden', 'fox'] },
];

function categorizeRepo(repo: GitHubRepo): ProjectCategory[] {
  const text = `${repo.name} ${repo.description || ''} ${repo.topics.join(' ')}`.toLowerCase();
  
  const matchedCategories: ProjectCategory[] = [];
  
  categories.forEach(cat => {
    if (cat.id === 'all') return;
    if (cat.keywords.some(kw => text.includes(kw))) {
      matchedCategories.push(cat.id);
    }
  });
  
  return matchedCategories.length > 0 ? matchedCategories : ['web-apps'];
}

export function Projects() {
  const { repos, loading, error } = useGitHubData();
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('all');

  const filteredRepos = useMemo(() => {
    if (activeCategory === 'all') return repos;
    
    return repos.filter(repo => {
      const repoCategories = categorizeRepo(repo);
      return repoCategories.includes(activeCategory);
    });
  }, [repos, activeCategory]);

  return (
    <section id="projects" className="py-24 relative">
      <div className="container px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">My Projects</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A collection of my work spanning AI, web development, and automation
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          <div className="flex items-center gap-2 text-muted-foreground mr-2">
            <Filter className="h-4 w-4" />
            <span className="text-sm">Filter:</span>
          </div>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={activeCategory === cat.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory(cat.id)}
              className={
                activeCategory === cat.id
                  ? 'bg-primary text-primary-foreground'
                  : 'border-primary/30 hover:border-primary hover:bg-primary/10'
              }
            >
              {cat.label}
              {cat.id !== 'all' && (
                <Badge variant="secondary" className="ml-2 text-xs px-1.5 py-0">
                  {repos.filter(r => categorizeRepo(r).includes(cat.id)).length}
                </Badge>
              )}
            </Button>
          ))}
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Fetching projects from GitHub...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex flex-col items-center justify-center py-20 glass border-glow rounded-xl max-w-md mx-auto p-8">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <p className="text-muted-foreground text-center">{error}</p>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && !error && (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRepos.map((repo, index) => (
                <ProjectCard key={repo.id} repo={repo} index={index} />
              ))}
            </div>

            {filteredRepos.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No projects found in this category.
              </div>
            )}

            {/* Total count */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mt-8 text-muted-foreground"
            >
              Showing {filteredRepos.length} of {repos.length} repositories
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}
