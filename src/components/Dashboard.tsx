import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Github, ExternalLink, ShieldCheck, Zap, Server, Globe, Search } from 'lucide-react';

export default function Dashboard({ onStart }: { onStart?: () => void }) {
  const [projects] = useState([
    { id: '1', name: 'personal-blog', status: 'live', framework: 'Next.js', url: 'blog.deployii.in', updatedAt: '2h ago' },
    { id: '2', name: 'e-commerce-api', status: 'building', framework: 'FastAPI', url: 'api.deployii.in', updatedAt: '15m ago' },
    { id: '3', name: 'portfolio-v3', status: 'failed', framework: 'TypeScript', url: '-', updatedAt: '1d ago' },
  ]);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900/20 to-transparent border border-white/5 p-12">
        <div className="relative z-10 max-w-2xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold tracking-tight mb-4"
          >
            Deploy everything, <br />
            <span className="text-blue-500">without the headache.</span>
          </motion.h1>
          <p className="text-gray-400 text-lg mb-8 leading-relaxed">
            Connect your repository and let our AI optimize your codebase for 
            professional-grade deployments. Automatic domain provisioning included.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={onStart}
              className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-xl hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.15)]"
            >
              <Github size={20} />
              Connect GitHub
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-[#111] text-white font-bold rounded-xl border border-white/5 hover:bg-white/5 transition-all">
              Documentation
            </button>
          </div>
        </div>
        <div className="absolute right-[-10%] top-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full" />
      </section>

      {/* Projects Grid */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Your Projects</h2>
            <p className="text-gray-500 text-sm mt-1">Manage and monitor your live deployments</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input 
                type="text" 
                placeholder="Search projects..." 
                className="pl-10 pr-4 py-2 bg-[#0a0a0a] border border-white/5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all w-64"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
            <motion.button 
              whileHover={{ scale: 0.98 }}
              whileTap={{ scale: 0.95 }}
              className="group h-[220px] rounded-2xl border-2 border-dashed border-white/5 flex flex-col items-center justify-center gap-4 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all text-gray-500 hover:text-blue-400"
            >
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-blue-500/20 group-hover:rotate-90 transition-all duration-300">
                <Plus size={24} />
              </div>
              <span className="font-semibold text-sm">Create New Project</span>
            </motion.button>
          </AnimatePresence>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
        <FeatureCard 
          icon={<ShieldCheck className="text-emerald-400" />}
          title="AI-Audit Layer"
          description="Every line of code is analyzed by Gemini for security and optimization before build."
        />
        <FeatureCard 
          icon={<Zap className="text-amber-400" />}
          title="Turbo Deploy"
          description="Proprietary container caching ensures your builds are live in under 60 seconds."
        />
        <FeatureCard 
          icon={<Globe className="text-blue-400" />}
          title="Edge Domains"
          description="Instant DNS provisioning with worldwide CDN delivery for no extra cost."
        />
      </section>
    </div>
  );
}

function ProjectCard({ project, index, ...props }: { project: any; index: number; [key: string]: any }) {
  const statusColors: any = {
    live: 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]',
    building: 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] animate-pulse',
    failed: 'bg-red-500 shadow-[0_0_10px_rgba(239,44,44,0.5)]',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all hover:translate-y-[-4px]"
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-mono text-xs font-bold ring-1 ring-white/10">
            {project.framework.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-lg">{project.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <div className={`w-2 h-2 rounded-full ${statusColors[project.status]}`} />
              <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">{project.status}</span>
            </div>
          </div>
        </div>
        <button className="text-gray-500 hover:text-white transition-colors">
          <ExternalLink size={18} />
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Domain</span>
          <span className="text-blue-400 font-mono">{project.url}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Updated</span>
          <span className="text-gray-300">{project.updatedAt}</span>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-white/5 flex gap-2">
        <button className="flex-1 py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-xs font-semibold transition-all">
          Manage
        </button>
        <button className="flex-1 py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-xs font-semibold transition-all">
          Logs
        </button>
      </div>
    </motion.div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-3xl bg-[#0a0a0a] border border-white/5">
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 ring-1 ring-white/10">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
