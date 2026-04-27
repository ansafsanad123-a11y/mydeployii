import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User, GithubAuthProvider } from 'firebase/auth';
import { auth, loginWithGithub } from './lib/firebase';
import AppLayout from './components/AppLayout';
import Dashboard from './components/Dashboard';
import ProjectWizard from './components/ProjectWizard';
import { motion, AnimatePresence } from 'motion/react';
import { Github, Rocket, Loader2, Mail } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showWizard, setShowWizard] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-gray-500 font-mono text-xs tracking-widest uppercase">Initializing Deployii Engine</p>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={loginWithGithub} />;
  }

  return (
    <AppLayout user={user} onNewProject={() => setShowWizard(true)}>
      <Dashboard onStart={() => setShowWizard(true)} />
      
      {/* Wizard Trigger */}
      <AnimatePresence>
        {showWizard && <ProjectWizard onClose={() => setShowWizard(false)} user={user} />}
      </AnimatePresence>

      {/* Override global New Project button by adding an event listener or using a portal */}
      {/* For this demo, let's add a floating trigger or just rely on state */}
      <button 
        onClick={() => setShowWizard(true)}
        className="fixed bottom-8 right-8 px-6 py-3 bg-blue-600 text-white font-bold rounded-full shadow-[0_10px_30px_rgba(37,99,235,0.4)] hover:scale-105 transition-all z-40 flex items-center gap-2"
      >
        <Rocket size={18} />
        Start Deployment
      </button>
    </AppLayout>
  );
}

function Login({ onLogin }: { onLogin: () => Promise<any> }) {
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const result: any = await onLogin();
      const credential = GithubAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      if (token) {
        localStorage.setItem('github_token', token);
      }
    } catch (e) {
      console.error(e);
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 selection:bg-blue-500/30">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-600/10 blur-[150px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md bg-[#0a0a0a] border border-white/5 rounded-[40px] p-12 text-center shadow-2xl"
      >
        <div className="w-20 h-20 rounded-3xl bg-blue-600 mx-auto flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(37,99,235,0.4)]">
          <Rocket className="w-10 h-10 text-white" />
        </div>
        
        <h1 className="text-4xl font-bold tracking-tight mb-4">MyDeployii</h1>
        <p className="text-gray-500 text-lg mb-10 leading-relaxed">
          The autonomous deployment engine <br /> powered by Gemini AI.
        </p>

        <button 
          disabled={isLoggingIn}
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-white text-black font-bold rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {isLoggingIn ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Github size={20} />
              Connect GitHub Account
            </>
          )}
        </button>

        <p className="mt-8 text-[10px] uppercase font-bold tracking-widest text-gray-600 text-balance">
          * Ensure GitHub Auth is enabled in Firebase
        </p>
      </motion.div>
    </div>
  );
}
