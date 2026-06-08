import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Code2, ShieldCheck, Zap, ChevronRight, LayoutDashboard, GitMerge, FileCode2, CheckCircle, Check, Star } from 'lucide-react';

export default function LandingPage({ onLaunch }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1, y: 0,
      transition: { type: 'spring', stiffness: 80, damping: 15 }
    }
  };

  const features = [
    {
      icon: <Code2 className="w-6 h-6 text-emerald-500" />,
      title: "Syntax & Logic Detection",
      description: "Instantly discover hidden bugs, logical flaws, and edge cases using sophisticated static analysis models.",
      color: "bg-emerald-500/10 border-emerald-500/20"
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />,
      title: "Security & Vulnerability Auditing",
      description: "Uncover critical security vulnerabilities like SQL injection, XSS, and weak cryptography before they hit production.",
      color: "bg-emerald-500/10 border-emerald-500/20"
    },
    {
      icon: <Zap className="w-6 h-6 text-emerald-500" />,
      title: "Big-O Performance Tuning",
      description: "Receive exact Time & Space Complexity estimates and actionable recommendations to optimize CPU and Memory bottlenecks.",
      color: "bg-emerald-500/10 border-emerald-500/20"
    },
    {
      icon: <GitMerge className="w-6 h-6 text-emerald-500" />,
      title: "GitHub Native Integration",
      description: "No need to copy and paste. Paste any raw GitHub URL and fetch live code instantly for seamless enterprise workflow integration.",
      color: "bg-emerald-500/10 border-emerald-500/20"
    },
    {
      icon: <FileCode2 className="w-6 h-6 text-emerald-500" />,
      title: "Polyglot Language Support",
      description: "Natively understands JavaScript, TypeScript, Python, Java, C++, SQL with language-specific best practices.",
      color: "bg-emerald-500/10 border-emerald-500/20"
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-emerald-500" />,
      title: "One-Click Refactoring",
      description: "Review the AI's suggested fixes and apply them back to your source file with a single click. Zero manual typing required.",
      color: "bg-emerald-500/10 border-emerald-500/20"
    }
  ];

  const steps = [
    { number: "01", title: "Import", desc: "Paste your code or connect a GitHub URL." },
    { number: "02", title: "Analyze", desc: "Lumina scans for bugs, vulnerabilities, and Big-O metrics." },
    { number: "03", title: "Fix", desc: "Review exact line numbers and apply the AI-generated refactors instantly." }
  ];



  return (
    <div className="w-full flex flex-col relative overflow-hidden bg-light-bg dark:bg-dark-bg text-gray-900 dark:text-gray-100 font-sans pt-16">
      
      {/* Background glowing orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/15 dark:bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute top-[20%] right-0 w-[400px] h-[400px] bg-teal-500/15 dark:bg-teal-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Hero Section */}
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 pb-12 px-6 lg:px-12 relative z-10">
        <motion.div 
          className="max-w-6xl w-full flex flex-col items-center text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase tracking-widest mb-8 shadow-sm">
            <Sparkles className="w-4 h-4" />
            <span>Lumina 2.0 is Here</span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-black tracking-tighter text-gray-900 dark:text-white mb-8 leading-none">
            Code Review, <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-green-400 relative">
              Automated.
              {/* Decorative line */}
              <div className="absolute -bottom-2 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-green-400 opacity-50 blur-sm rounded-full"></div>
            </span>
          </motion.h1>

          <motion.p variants={itemVariants} className="max-w-3xl text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed font-medium">
            Stop waiting for senior engineers. Lumina instantly audits your codebase for security flaws, calculates Big-O complexity, and generates one-click refactors.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 mb-24 w-full sm:w-auto">
            <button 
              onClick={onLaunch}
              className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-emerald-500 hover:bg-emerald-400 text-dark-bg font-extrabold text-lg rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,255,136,0.3)] hover:shadow-[0_0_60px_rgba(0,255,136,0.5)] hover:-translate-y-1 transition-all"
            >
              <div className="absolute inset-0 w-full h-full bg-white/20 group-hover:scale-105 transition-transform origin-left rounded-2xl blur-md scale-0"></div>
              <LayoutDashboard className="w-6 h-6 relative z-10" />
              <span className="relative z-10">Launch Workspace</span>
              <ChevronRight className="w-6 h-6 relative z-10 group-hover:translate-x-1.5 transition-transform" />
            </button>
          </motion.div>

        </motion.div>
      </div>


      {/* How it Works Timeline */}
      <div className="py-24 px-6 lg:px-12 bg-gray-50 dark:bg-dark-bg relative z-10" id="how-it-works">
        <div className="max-w-6xl mx-auto flex flex-col">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">How it works</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">From raw code to production-ready perfection in three simple steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center p-8 bg-white dark:bg-dark-card rounded-3xl border border-light-border dark:border-dark-border shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center mb-6 border border-emerald-200 dark:border-emerald-500/20">
                  <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{step.number}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-24 px-6 lg:px-12 bg-white dark:bg-dark-card/50 relative z-10 border-t border-light-border dark:border-dark-border" id="features">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">Everything you need</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Built for individual developers and massive engineering teams alike.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <div 
                key={idx}
                className="group p-8 rounded-3xl border border-light-border dark:border-dark-border bg-gray-50 dark:bg-dark-bg/50 backdrop-blur-sm shadow-sm transition-all hover:-translate-y-2 hover:shadow-xl hover:border-emerald-500/30 cursor-default"
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white dark:bg-dark-card border border-light-border dark:border-dark-border mb-6 shadow-sm group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>


    </div>
  );
}
