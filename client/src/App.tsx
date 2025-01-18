import React, { useState, useCallback } from "react";
import { Upload, Github, Heart} from "lucide-react";
import { FileUploader } from "./components/FileUploader";
import { FeatureRequest } from "./components/FeatureRequest";
import { ThemeToggle } from "./components/ThemeToggle";
import { Navbar } from "./components/Navbar";

function App() {
  const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = useCallback(() => {
    setIsAuthenticated(true);
  }, []);

  const handleFilesSelected = useCallback((files: FileList) => {
    console.log("Files selected:", files);
  }, []);

  return (
    <div className="min-h-screen pt-10 bg-gray-50 dark:bg-[#121212] text-gray-900 dark:text-white font-fira-code relative overflow-hidden transition-colors duration-300">
      <ThemeToggle />
      <Navbar onFeatureRequest={() => setIsFeatureModalOpen(true)} />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500/20 to-blue-500/20 dark:from-fuchsia-500/10 dark:to-blue-500/10 animate-gradient" />
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-br from-fuchsia-500/5 to-blue-500/5"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 300 + 50}px`,
              height: `${Math.random() * 300 + 50}px`,
              animation: `float ${Math.random() * 10 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto pb-6 px-4 py-8 relative z-10 ">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-fuchsia-500 to-blue-500 bg-clip-text text-transparent">
            Ziode - zip tools
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Open-source platform for all your ZIP file needs. <br />
            <span className="font-bold text-xl italic">Compress</span>,{" "}
            <span className="font-bold text-xl italic">Protect</span>,{" "}
            <span className="font-bold text-xl italic">Manage</span> and{" "}
            <span className="font-bold text-xl italic">store</span> with ease
          </p>
        </header>

        <main>
          <FileUploader onFilesSelected={handleFilesSelected} />

          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6 text-center">Features</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "File Compression",
                  description:
                    "Compress multiple files into a single ZIP with a 50MB limit",
                  icon: <Upload className="w-6 h-6 text-fuchsia-500" />,
                },
                {
                  title: "Secure Storage",
                  description:
                    "Files are securely processed and stored using AWS S3",
                  icon: <Upload className="w-6 h-6 text-fuchsia-500" />,
                },
                {
                  title: "Fast Downloads",
                  description:
                    "Download your compressed files instantly with metadata",
                  icon: <Upload className="w-6 h-6 text-fuchsia-500" />,
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="p-6 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 
                    hover:border-fuchsia-500/50 transition-all duration-300 hover:transform hover:scale-105"
                >
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </main>

        <footer className="mt-16 text-center text-gray-600 dark:text-gray-400">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-fuchsia-500" />
            <span>by</span>
            <a
              href="https://github.com/ctrly4sh"
              className="text-fuchsia-500 hover:text-fuchsia-400 flex items-center gap-1"
            >
              <Github className="w-4 h-4" />
              ctrly4sh
            </a>
          </div>
        </footer>
      </div>

      <FeatureRequest
        isOpen={isFeatureModalOpen}
        onClose={() => setIsFeatureModalOpen(false)}
      />
    </div>
  );
}

export default App;
