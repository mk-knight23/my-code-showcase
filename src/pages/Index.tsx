import { Navigation } from '@/components/portfolio/Navigation';
import { Hero } from '@/components/portfolio/Hero';
import { About } from '@/components/portfolio/About';
import { Projects } from '@/components/portfolio/Projects';
import { GitHubStats } from '@/components/portfolio/GitHubStats';
import { Contact } from '@/components/portfolio/Contact';
import { Footer } from '@/components/portfolio/Footer';
import { GitHubProvider } from '@/hooks/useGitHubData';

const Index = () => {
  return (
    <GitHubProvider>
      <div className="min-h-screen bg-background">
        <Navigation />
        <Hero />
        <About />
        <Projects />
        <GitHubStats />
        <Contact />
        <Footer />
      </div>
    </GitHubProvider>
  );
};

export default Index;
