import React from 'react';
import { Github, Mail, Globe } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950/80 backdrop-blur-xl border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <div className="text-slate-400 text-sm">
            <span className="font-medium text-white">Stem Player</span> © 2025 by{' '}
            <span className="font-medium text-violet-400">Adar Bahar</span>
          </div>
          
          {/* Contact Links */}
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/AdarBahar/sync-stem-player"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-200 group"
            >
              <Github className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
              <span className="text-sm font-medium">GitHub</span>
            </a>
            
            <a
              href="https://www.bahar.co.il"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-200 group"
            >
              <Globe className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
              <span className="text-sm font-medium">www.bahar.co.il</span>
            </a>
            
            <a
              href="mailto:adar@bahar.co.il"
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-200 group"
            >
              <Mail className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
              <span className="text-sm font-medium">adar@bahar.co.il</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;