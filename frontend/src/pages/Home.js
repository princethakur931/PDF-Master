import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import {
  FileText,
  Combine,
  Scissors,
  Minimize2,
  RotateCw,
  FileImage,
  Image as ImageIcon,
  FileSpreadsheet,
  Lock,
  Unlock,
  PenTool,
  Droplet,
  FileSearch,
  Search,
  Sun,
  Moon,
  Linkedin,
  Github,
  Mail,
} from "lucide-react";

const tools = [
  {
    id: "merge",
    name: "Merge PDF",
    icon: Combine,
    description: "Combine multiple PDFs into one",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "split",
    name: "Split PDF",
    icon: Scissors,
    description: "Extract pages from your PDF",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "compress",
    name: "Compress PDF",
    icon: Minimize2,
    description: "Reduce your PDF file size",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "rotate",
    name: "Rotate PDF",
    icon: RotateCw,
    description: "Rotate PDF pages",
    color: "from-orange-500 to-red-500",
  },
  {
    id: "pdf-to-jpg",
    name: "PDF to JPG",
    icon: FileImage,
    description: "Convert PDF to JPG images",
    color: "from-indigo-500 to-purple-500",
  },
  {
    id: "pdf-to-png",
    name: "PDF to PNG",
    icon: ImageIcon,
    description: "Convert PDF to PNG images",
    color: "from-pink-500 to-rose-500",
  },
  {
    id: "jpg-to-pdf",
    name: "JPG to PDF",
    icon: FileImage,
    description: "Convert JPG to PDF",
    color: "from-cyan-500 to-blue-500",
  },
  {
    id: "png-to-pdf",
    name: "PNG to PDF",
    icon: ImageIcon,
    description: "Convert PNG to PDF",
    color: "from-teal-500 to-green-500",
  },
  {
    id: "pdf-to-word",
    name: "PDF to Word",
    icon: FileText,
    description: "Convert PDF to Word document",
    color: "from-blue-600 to-indigo-600",
  },
  {
    id: "word-to-pdf",
    name: "Word to PDF",
    icon: FileText,
    description: "Convert Word to PDF",
    color: "from-violet-500 to-purple-500",
  },
  {
    id: "pdf-to-excel",
    name: "PDF to Excel",
    icon: FileSpreadsheet,
    description: "Convert PDF to Excel",
    color: "from-green-600 to-teal-600",
  },
  {
    id: "excel-to-pdf",
    name: "Excel to PDF",
    icon: FileSpreadsheet,
    description: "Convert Excel to PDF",
    color: "from-emerald-500 to-green-500",
  },
  {
    id: "ocr",
    name: "OCR PDF",
    icon: FileSearch,
    description: "Extract text from PDF",
    color: "from-amber-500 to-orange-500",
  },
  {
    id: "watermark",
    name: "Watermark",
    icon: Droplet,
    description: "Add watermark to PDF",
    color: "from-sky-500 to-blue-500",
  },
  {
    id: "protect",
    name: "Protect PDF",
    icon: Lock,
    description: "Add password to PDF",
    color: "from-red-500 to-pink-500",
  },
  {
    id: "unlock",
    name: "Unlock PDF",
    icon: Unlock,
    description: "Remove PDF password",
    color: "from-yellow-500 to-amber-500",
  },
  {
    id: "sign",
    name: "Sign PDF",
    icon: PenTool,
    description: "Add signature to PDF",
    color: "from-fuchsia-500 to-pink-500",
  },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Filter tools based on search query
  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return tools;
    const query = searchQuery.toLowerCase();
    return tools.filter(
      tool =>
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <div
      className={`min-h-screen relative overflow-hidden ${
        isDarkMode ? "bg-gray-950" : "bg-gray-50"
      }`}
    >
      {/* Dark/Light Mode Toggle */}
      <motion.button
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        onClick={() => setIsDarkMode(!isDarkMode)}
        className={`fixed top-6 right-6 z-50 p-3 rounded-full ${
          isDarkMode
            ? "bg-white/10 hover:bg-white/20"
            : "bg-gray-800/10 hover:bg-gray-800/20"
        } backdrop-blur-lg border ${
          isDarkMode ? "border-white/20" : "border-gray-800/20"
        } transition-all duration-300 hover:scale-110`}
        aria-label="Toggle theme"
      >
        {isDarkMode ? (
          <Sun className="w-6 h-6 text-yellow-400" />
        ) : (
          <Moon className="w-6 h-6 text-gray-800" />
        )}
      </motion.button>

      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div
          className={`absolute inset-0 ${
            isDarkMode
              ? "bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-pink-900/20"
              : "bg-gradient-to-br from-indigo-100/40 via-purple-100/30 to-pink-100/40"
          }`}
        />
        <div
          className={`absolute top-0 left-1/4 w-96 h-96 ${
            isDarkMode ? "bg-indigo-500/30" : "bg-indigo-300/40"
          } rounded-full blur-3xl animate-pulse`}
        />
        <div
          className={`absolute bottom-0 right-1/4 w-96 h-96 ${
            isDarkMode ? "bg-purple-500/20" : "bg-purple-300/30"
          } rounded-full blur-3xl animate-pulse`}
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-24 md:py-32 px-6"
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className={`text-5xl md:text-7xl font-heading font-bold mb-6 tracking-tight ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
            data-testid="hero-heading"
          >
            PDF <span className="gradient-text">Master</span>
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className={`text-xl md:text-2xl ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            } mb-8 max-w-3xl mx-auto`}
            data-testid="hero-subtitle"
          >
            The ultimate toolkit for all your PDF needs. Merge, split, compress,
            convert, and more - all in one place.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <div
              className={`relative ${
                isDarkMode ? "glass" : "bg-white"
              } rounded-2xl p-2 ${
                isDarkMode ? "border-white/10" : "border-gray-300 border"
              } shadow-xl`}
            >
              <div className="flex items-center">
                <Search
                  className={`w-5 h-5 ml-3 ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Search for a PDF tool..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className={`w-full px-4 py-3 bg-transparent outline-none ${
                    isDarkMode
                      ? "text-white placeholder-gray-500"
                      : "text-gray-900 placeholder-gray-400"
                  } text-lg`}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className={`mr-3 px-3 py-1 rounded-lg text-sm ${
                      isDarkMode
                        ? "bg-white/10 hover:bg-white/20 text-gray-300"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                    } transition-colors`}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
            {searchQuery && (
              <p
                className={`text-sm mt-3 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Found {filteredTools.length} tool
                {filteredTools.length !== 1 ? "s" : ""}
              </p>
            )}
          </motion.div>
        </div>
      </motion.section>

      {/* Tools Grid */}
      <section className="pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            data-testid="tools-grid"
          >
            {filteredTools.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Search
                  className={`w-16 h-16 mx-auto mb-4 ${
                    isDarkMode ? "text-gray-600" : "text-gray-400"
                  }`}
                />
                <h3
                  className={`text-2xl font-semibold mb-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  No tools found
                </h3>
                <p className={isDarkMode ? "text-gray-500" : "text-gray-500"}>
                  Try searching with different keywords
                </p>
              </div>
            ) : (
              filteredTools.map((tool, index) => (
                <motion.div
                  key={tool.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                >
                  <Link
                    to={`/tool/${tool.id}`}
                    data-testid={`tool-card-${tool.id}`}
                  >
                    <div
                      className={`group relative overflow-hidden rounded-2xl p-6 ${
                        isDarkMode
                          ? "glass hover:bg-white/10 border-white/10"
                          : "bg-white hover:bg-gray-50 border-gray-200"
                      } border hover:border-indigo-500/30 h-full flex flex-col transition-all duration-300 shadow-lg hover:shadow-2xl`}
                    >
                      {/* Gradient Background on Hover */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                      />

                      {/* Icon */}
                      <div className="relative mb-4">
                        <div
                          className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tool.color} p-3 group-hover:scale-110 transition-transform duration-300`}
                        >
                          <tool.icon className="w-full h-full text-white" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="relative flex-1">
                        <h3
                          className={`text-xl font-heading font-semibold mb-2 ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          } group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300`}
                          data-testid={`tool-name-${tool.id}`}
                        >
                          {tool.name}
                        </h3>
                        <p
                          className={`text-sm ${
                            isDarkMode
                              ? "text-gray-400 group-hover:text-gray-300"
                              : "text-gray-600 group-hover:text-gray-500"
                          } transition-colors duration-300`}
                        >
                          {tool.description}
                        </p>
                      </div>

                      {/* Hover Arrow */}
                      <div className="relative mt-4 flex items-center text-indigo-400 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-2 transition-all duration-300">
                        <span className="text-sm font-medium">Get started</span>
                        <svg
                          className="w-4 h-4 ml-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className={`py-12 px-6 border-t ${
          isDarkMode ? "border-white/10" : "border-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto text-center">
          {/* Contact Me Heading */}
          <h3
            className={`text-2xl font-heading font-semibold mb-3 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Contact Me
          </h3>

          {/* Decorative Line */}
          <div className="flex items-center justify-center mb-6">
            <div
              className={`h-px w-16 ${
                isDarkMode
                  ? "bg-gradient-to-r from-transparent via-indigo-500 to-transparent"
                  : "bg-gradient-to-r from-transparent via-indigo-400 to-transparent"
              }`}
            />
            <div
              className={`mx-3 w-2 h-2 rounded-full ${
                isDarkMode ? "bg-indigo-500" : "bg-indigo-400"
              }`}
            />
            <div
              className={`h-px w-16 ${
                isDarkMode
                  ? "bg-gradient-to-r from-transparent via-indigo-500 to-transparent"
                  : "bg-gradient-to-r from-transparent via-indigo-400 to-transparent"
              }`}
            />
          </div>

          {/* Social Links */}
          <div className="flex justify-center items-center gap-6 mb-4">
            <a
              href="mailto:princethakur545454@gmail.com"
              className={`p-2 rounded-lg transition-all duration-300 ${
                isDarkMode
                  ? "text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                  : "text-gray-600 hover:text-red-600 hover:bg-red-50"
              }`}
              aria-label="Email"
            >
              <Mail className="w-6 h-6" />
            </a>
            <a
              href="https://www.linkedin.com/in/prince-thakur-578919272/"
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-lg transition-all duration-300 ${
                isDarkMode
                  ? "text-gray-400 hover:text-blue-400 hover:bg-blue-500/10"
                  : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
              }`}
              aria-label="LinkedIn"
            >
              <Linkedin className="w-6 h-6" />
            </a>
            <a
              href="https://github.com/princethakur931"
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-lg transition-all duration-300 ${
                isDarkMode
                  ? "text-gray-400 hover:text-purple-400 hover:bg-purple-500/10"
                  : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
              }`}
              aria-label="GitHub"
            >
              <Github className="w-6 h-6" />
            </a>
          </div>

          <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
            © 2025 PDF Master. All files are processed securely and deleted
            after use.
          </p>
        </div>
      </footer>
    </div>
  );
}
