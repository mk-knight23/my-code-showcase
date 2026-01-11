import { motion } from 'framer-motion';
import { Code, Cpu, Zap, Globe, Sparkles, Terminal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const skills = [
  { name: 'TypeScript', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { name: 'Python', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  { name: 'React', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
  { name: 'Next.js', color: 'bg-white/20 text-white border-white/30' },
  { name: 'Node.js', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  { name: 'AI/ML', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  { name: 'n8n', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  { name: 'Make', color: 'bg-pink-500/20 text-pink-400 border-pink-500/30' },
  { name: 'Supabase', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  { name: 'Docker', color: 'bg-blue-400/20 text-blue-300 border-blue-400/30' },
  { name: 'LangChain', color: 'bg-teal-500/20 text-teal-400 border-teal-500/30' },
  { name: 'OpenAI', color: 'bg-green-400/20 text-green-300 border-green-400/30' },
];

const highlights = [
  { icon: Cpu, title: 'AI & Automation', desc: 'Building intelligent systems with LLMs' },
  { icon: Code, title: 'Full Stack Dev', desc: 'End-to-end web applications' },
  { icon: Zap, title: 'Workflow Automation', desc: 'n8n, Make, custom solutions' },
  { icon: Globe, title: 'Open Source', desc: 'Contributing to the community' },
];

export function About() {
  return (
    <section id="about" className="py-24 relative">
      <div className="absolute inset-0 bg-dots opacity-30" />
      
      <div className="container px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">About Me</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Passionate about building AI-powered solutions and automation workflows
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Bio */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="glass border-glow rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4 font-mono text-sm text-muted-foreground">
                <Terminal className="h-4 w-4 text-primary" />
                <span>about.json</span>
              </div>
              
              <div className="space-y-4 text-foreground">
                <p className="leading-relaxed">
                  Hey! I'm <span className="text-primary font-semibold">Kazi Musharraf</span>, 
                  a developer who loves turning complex problems into elegant solutions. 
                  I specialize in building AI-powered applications and automation workflows 
                  that help businesses scale efficiently.
                </p>
                <p className="leading-relaxed">
                  From crafting intelligent chatbots to designing robust web applications, 
                  I bring a unique blend of technical expertise and creative problem-solving 
                  to every project. My work spans across AI/ML, full-stack development, 
                  and process automation.
                </p>
                <p className="leading-relaxed">
                  When I'm not coding, you'll find me exploring new AI technologies, 
                  contributing to open-source projects, or sharing knowledge with the 
                  developer community.
                </p>
              </div>
            </div>

            {/* Skills */}
            <div className="glass border-glow rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">Tech Stack</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <Badge 
                      variant="outline" 
                      className={`${skill.color} hover:scale-105 transition-transform cursor-default`}
                    >
                      {skill.name}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right side - Highlights */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            {highlights.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass border-glow rounded-xl p-6 hover:glow-primary transition-all duration-300 group"
              >
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
