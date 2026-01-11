import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Code, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '#about', label: 'About' },
  { href: '#projects', label: 'Projects' },
  { href: '#contact', label: 'Contact' },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass border-b border-border' : ''
        }`}
      >
        <div className="container px-4">
          <nav className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href="#" className="flex items-center gap-2 font-mono font-bold text-lg">
              <Code className="h-6 w-6 text-primary" />
              <span className="text-gradient">MK</span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-muted-foreground hover:text-primary transition-colors relative group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="border-primary/30 hover:border-primary hover:bg-primary/10"
                asChild
              >
                <a href="https://github.com/mk-knight23" target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4 mr-2" />
                  GitHub
                </a>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </nav>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 glass border-b border-border md:hidden"
          >
            <nav className="container px-4 py-4">
              <div className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="text-muted-foreground hover:text-primary transition-colors py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="border-primary/30 hover:border-primary hover:bg-primary/10 w-fit"
                  asChild
                >
                  <a href="https://github.com/mk-knight23" target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4 mr-2" />
                    GitHub
                  </a>
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
