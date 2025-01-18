import React from 'react';
import { Github, Plus } from 'lucide-react';

interface NavbarProps {
  onFeatureRequest: () => void;
}

export function Navbar({ onFeatureRequest }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/10 dark:bg-gray-800/50 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold bg-gradient-to-r from-fuchsia-500 to-blue-500 bg-clip-text text-transparent">
              Ziode
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={onFeatureRequest}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-fuchsia-500 to-blue-500 hover:from-fuchsia-600 hover:to-blue-600 text-white transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
              Request Feature
            </button>
            <a
              href="https://github.com/ctrly4sh/Ziode-ZipTools"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors"
            >
              <Github className="w-4 h-4" />
              Contribute
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}