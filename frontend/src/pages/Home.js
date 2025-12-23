import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FileText, Combine, Scissors, Minimize2, RotateCw, FileImage, 
  Image as ImageIcon, FileSpreadsheet, Lock, Unlock, 
  PenTool, Droplet, FileSearch
} from 'lucide-react';

const tools = [
  { id: 'merge', name: 'Merge PDF', icon: Combine, description: 'Combine multiple PDFs into one', color: 'from-blue-500 to-cyan-500' },
  { id: 'split', name: 'Split PDF', icon: Scissors, description: 'Extract pages from your PDF', color: 'from-purple-500 to-pink-500' },
  { id: 'compress', name: 'Compress PDF', icon: Minimize2, description: 'Reduce your PDF file size', color: 'from-green-500 to-emerald-500' },
  { id: 'rotate', name: 'Rotate PDF', icon: RotateCw, description: 'Rotate PDF pages', color: 'from-orange-500 to-red-500' },
  { id: 'pdf-to-jpg', name: 'PDF to JPG', icon: FileImage, description: 'Convert PDF to JPG images', color: 'from-indigo-500 to-purple-500' },
  { id: 'pdf-to-png', name: 'PDF to PNG', icon: ImageIcon, description: 'Convert PDF to PNG images', color: 'from-pink-500 to-rose-500' },
  { id: 'jpg-to-pdf', name: 'JPG to PDF', icon: FileImage, description: 'Convert JPG to PDF', color: 'from-cyan-500 to-blue-500' },
  { id: 'png-to-pdf', name: 'PNG to PDF', icon: ImageIcon, description: 'Convert PNG to PDF', color: 'from-teal-500 to-green-500' },
  { id: 'pdf-to-word', name: 'PDF to Word', icon: FileText, description: 'Convert PDF to Word document', color: 'from-blue-600 to-indigo-600' },
  { id: 'word-to-pdf', name: 'Word to PDF', icon: FileText, description: 'Convert Word to PDF', color: 'from-violet-500 to-purple-500' },
  { id: 'pdf-to-excel', name: 'PDF to Excel', icon: FileSpreadsheet, description: 'Convert PDF to Excel', color: 'from-green-600 to-teal-600' },
  { id: 'excel-to-pdf', name: 'Excel to PDF', icon: FileSpreadsheet, description: 'Convert Excel to PDF', color: 'from-emerald-500 to-green-500' },
  { id: 'ocr', name: 'OCR PDF', icon: FileSearch, description: 'Extract text from PDF', color: 'from-amber-500 to-orange-500' },
  { id: 'watermark', name: 'Watermark', icon: Droplet, description: 'Add watermark to PDF', color: 'from-sky-500 to-blue-500' },
  { id: 'protect', name: 'Protect PDF', icon: Lock, description: 'Add password to PDF', color: 'from-red-500 to-pink-500' },
  { id: 'unlock', name: 'Unlock PDF', icon: Unlock, description: 'Remove PDF password', color: 'from-yellow-500 to-amber-500' },
  { id: 'sign', name: 'Sign PDF', icon: PenTool, description: 'Add signature to PDF', color: 'from-fuchsia-500 to-pink-500' },
];

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-pink-900/20" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
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
            className="text-5xl md:text-7xl font-heading font-bold mb-6 tracking-tight"
            data-testid="hero-heading"
          >
            PDF <span className="gradient-text">Master</span>
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto"
            data-testid="hero-subtitle"
          >
            The ultimate toolkit for all your PDF needs. Merge, split, compress, convert, and more - all in one place.
          </motion.p>
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
            {tools.map((tool, index) => (
              <motion.div
                key={tool.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
              >
                <Link to={`/tool/${tool.id}`} data-testid={`tool-card-${tool.id}`}>
                  <div className="group relative overflow-hidden rounded-2xl p-6 glass hover:bg-white/10 border border-white/10 hover:border-indigo-500/30 h-full flex flex-col">
                    {/* Gradient Background on Hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                    
                    {/* Icon */}
                    <div className="relative mb-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tool.color} p-3 group-hover:scale-110 transition-transform duration-300`}>
                        <tool.icon className="w-full h-full text-white" />
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="relative flex-1">
                      <h3 className="text-xl font-heading font-semibold mb-2 text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300" data-testid={`tool-name-${tool.id}`}>
                        {tool.name}
                      </h3>
                      <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                        {tool.description}
                      </p>
                    </div>
                    
                    {/* Hover Arrow */}
                    <div className="relative mt-4 flex items-center text-indigo-400 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-2 transition-all duration-300">
                      <span className="text-sm font-medium">Get started</span>
                      <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            © 2025 PDF Master. All files are processed securely and deleted after use.
          </p>
        </div>
      </footer>
    </div>
  );
}