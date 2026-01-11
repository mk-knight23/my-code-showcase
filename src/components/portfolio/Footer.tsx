import { Github, Twitter, Linkedin, Mail, Heart, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';

const socialLinks = [
  { icon: Github, href: 'https://github.com/mk-knight23', label: 'GitHub' },
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: Mail, href: '#contact', label: 'Email' },
];

const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#projects', label: 'Projects' },
  { href: '#contact', label: 'Contact' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 border-t border-border bg-muted/20">
      <div className="container px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo/Name */}
          <div className="flex items-center gap-2">
            <Code className="h-6 w-6 text-primary" />
            <span className="font-mono font-bold text-lg">mk-knight23</span>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Social Links */}
          <div className="flex items-center gap-2">
            {socialLinks.map((link) => (
              <Button
                key={link.label}
                variant="ghost"
                size="icon"
                className="h-9 w-9 hover:bg-primary/10 hover:text-primary"
                asChild
              >
                <a
                  href={link.href}
                  target={link.href.startsWith('#') ? undefined : '_blank'}
                  rel={link.href.startsWith('#') ? undefined : 'noopener noreferrer'}
                  aria-label={link.label}
                >
                  <link.icon className="h-4 w-4" />
                </a>
              </Button>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground text-sm">
          <p className="flex items-center justify-center gap-1">
            Built with <Heart className="h-4 w-4 text-red-400" /> by Kazi Musharraf
            <span className="mx-2">•</span>
            © {currentYear}
          </p>
        </div>
      </div>
    </footer>
  );
}
