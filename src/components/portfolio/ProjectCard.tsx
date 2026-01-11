import { motion } from 'framer-motion';
import { ExternalLink, Github, Star, GitFork, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { GitHubRepo, LANGUAGE_COLORS } from '@/types/github';
import { formatDistanceToNow } from 'date-fns';

interface ProjectCardProps {
  repo: GitHubRepo;
  index: number;
}

export function ProjectCard({ repo, index }: ProjectCardProps) {
  const languageColor = repo.language ? LANGUAGE_COLORS[repo.language] || '#6e7681' : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      viewport={{ once: true }}
    >
      <Card className="h-full glass border-glow hover:glow-primary transition-all duration-300 group overflow-hidden">
        {/* Preview Image Placeholder */}
        <div className="h-40 bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/10 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-30" />
          <div className="relative z-10 font-mono text-2xl font-bold text-primary/50">
            {repo.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="absolute top-3 right-3 flex gap-2">
            {repo.stargazers_count > 0 && (
              <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                <Star className="h-3 w-3 mr-1 text-secondary" />
                {repo.stargazers_count}
              </Badge>
            )}
            {repo.forks_count > 0 && (
              <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                <GitFork className="h-3 w-3 mr-1 text-primary" />
                {repo.forks_count}
              </Badge>
            )}
          </div>
        </div>

        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-1">
              {repo.name.replace(/-/g, ' ').replace(/_/g, ' ')}
            </h3>
          </div>
        </CardHeader>

        <CardContent className="pb-4 space-y-4">
          {/* Description */}
          <p className="text-muted-foreground text-sm line-clamp-2 min-h-[2.5rem]">
            {repo.description || 'No description provided'}
          </p>

          {/* Topics/Tech Stack */}
          <div className="flex flex-wrap gap-1.5">
            {repo.language && (
              <Badge 
                variant="outline" 
                className="text-xs"
                style={{ 
                  borderColor: languageColor || undefined,
                  color: languageColor || undefined,
                  backgroundColor: `${languageColor}15`
                }}
              >
                {repo.language}
              </Badge>
            )}
            {repo.topics.slice(0, 3).map((topic) => (
              <Badge 
                key={topic} 
                variant="outline" 
                className="text-xs bg-muted/50"
              >
                {topic}
              </Badge>
            ))}
          </div>

          {/* Updated date */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>Updated {formatDistanceToNow(new Date(repo.pushed_at))} ago</span>
          </div>
        </CardContent>

        <CardFooter className="pt-0 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-primary/30 hover:border-primary hover:bg-primary/10"
            asChild
          >
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4 mr-2" />
              Code
            </a>
          </Button>
          {repo.homepage && (
            <Button
              size="sm"
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              asChild
            >
              <a href={repo.homepage} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Demo
              </a>
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
