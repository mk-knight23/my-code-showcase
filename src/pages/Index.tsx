import { Navigation } from '@/components/portfolio/Navigation';
import { Hero } from '@/components/portfolio/Hero';
import { About } from '@/components/portfolio/About';
import { Projects } from '@/components/portfolio/Projects';
import { GitHubStats } from '@/components/portfolio/GitHubStats';
import { Contact } from '@/components/portfolio/Contact';
import { Footer } from '@/components/portfolio/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <About />
      <Projects />
      <GitHubStats />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
