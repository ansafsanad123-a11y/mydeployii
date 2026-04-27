import React from 'react';
import { LayoutGrid, Rocket, Settings, Github, LogOut, Terminal, Shield, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth } from '../lib/firebase';

interface LayoutProps {
  children: React.ReactNode;
  user: any;
  onNewProject?: () => void;
}

export default function AppLayout({ children, user, onNewProject }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 font-sans selection:bg-blue-500/30">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 border-r border-white/5 bg-[#0a0a0a] z-50">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)]">
            <Rocket className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            MyDeployii
          </span>
        </div>

        <nav className="px-4 mt-8 space-y-1">
          <NavItem icon={<LayoutGrid size={18} />} label="Dashboard" active />
          <NavItem icon={<Terminal size={18} />} label="Editor" />
          <NavItem icon={<Globe size={18} />} label="Domains" />
          <NavItem icon={<Shield size={18} />} label="Security" />
          <NavItem icon={<Settings size={18} />} label="Settings" />
        </nav>

        <div className="absolute bottom-0 left-0 w-full p-4 border-t border-white/5 bg-[#0a0a0a]/50 backdrop-blur-md">
          <div className="flex items-center gap-3 px-2">
            <img 
              src={user?.photoURL || 'https://github.com/identicons/default.png'} 
              className="w-8 h-8 rounded-full border border-white/10"
              alt="User"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{user?.displayName || 'User'}</p>
              <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
            </div>
            <button 
              onClick={() => auth.signOut()}
              className="p-1.5 hover:bg-white/5 rounded-md text-gray-400 hover:text-white transition-colors"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="pl-64 min-h-screen">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#050505]/80 backdrop-blur-xl sticky top-0 z-40">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>Projects</span>
            <span className="text-gray-600">/</span>
            <span className="text-gray-100 font-medium tracking-wide">Overview</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                auth.signOut().then(() => {
                  localStorage.removeItem('github_token');
                });
              }}
              className="text-xs text-gray-500 hover:text-white transition-colors"
            >
              Sign Out
            </button>
            <button 
              onClick={onNewProject}
              className="px-4 py-2 bg-white text-black font-semibold text-xs rounded-full hover:bg-gray-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              New Project
            </button>
          </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <button
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
        active 
          ? 'bg-blue-600/10 text-blue-400' 
          : 'text-gray-500 hover:text-white hover:bg-white/5'
      }`}
    >
      {icon}
      {label}
      {active && (
        <motion.div 
          layoutId="nav-active"
          className="ml-auto w-1 h-4 bg-blue-500 rounded-full"
        />
      )}
    </button>
  );
}
