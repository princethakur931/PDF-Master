import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, Download, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const toolConfigs = {
  'merge': { title: 'Merge PDF', acceptFiles: '.pdf', multiple: true, hasExtraInput: false },
  'split': { title: 'Split PDF', acceptFiles: '.pdf', multiple: false, hasExtraInput: true, inputLabel: 'Page Range (e.g., 1-3,5,7-9)', inputPlaceholder: '1-3,5' },
  'compress': { title: 'Compress PDF', acceptFiles: '.pdf', multiple: false, hasExtraInput: false },
  'rotate': { title: 'Rotate PDF', acceptFiles: '.pdf', multiple: false, hasExtraInput: true, inputLabel: 'Rotation Angle (90, 180, 270)', inputPlaceholder: '90' },
  'pdf-to-jpg': { title: 'PDF to JPG', acceptFiles: '.pdf', multiple: false, hasExtraInput: false },
  'pdf-to-png': { title: 'PDF to PNG', acceptFiles: '.pdf', multiple: false, hasExtraInput: false },
  'jpg-to-pdf': { title: 'JPG to PDF', acceptFiles: '.jpg,.jpeg', multiple: false, hasExtraInput: false },
  'png-to-pdf': { title: 'PNG to PDF', acceptFiles: '.png', multiple: false, hasExtraInput: false },
  'pdf-to-word': { title: 'PDF to Word', acceptFiles: '.pdf', multiple: false, hasExtraInput: false },
  'word-to-pdf': { title: 'Word to PDF', acceptFiles: '.doc,.docx', multiple: false, hasExtraInput: false },
  'pdf-to-excel': { title: 'PDF to Excel', acceptFiles: '.pdf', multiple: false, hasExtraInput: false },
  'excel-to-pdf': { title: 'Excel to PDF', acceptFiles: '.xls,.xlsx', multiple: false, hasExtraInput: false },
  'ocr': { title: 'OCR PDF', acceptFiles: '.pdf', multiple: false, hasExtraInput: false },
  'watermark': { title: 'Add Watermark', acceptFiles: '.pdf', multiple: false, hasExtraInput: true, inputLabel: 'Watermark Text', inputPlaceholder: 'CONFIDENTIAL' },
  'protect': { title: 'Protect PDF', acceptFiles: '.pdf', multiple: false, hasExtraInput: true, inputLabel: 'Password', inputPlaceholder: 'Enter password', inputType: 'password' },
  'unlock': { title: 'Unlock PDF', acceptFiles: '.pdf', multiple: false, hasExtraInput: true, inputLabel: 'Current Password', inputPlaceholder: 'Enter password', inputType: 'password' },
  'sign': { title: 'Sign PDF', acceptFiles: '.pdf', multiple: false, hasExtraInput: true, inputLabel: 'Signature Text', inputPlaceholder: 'Your Name' },
};

export default function ToolPage() {
  const { toolId } = useParams();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [extraInput, setExtraInput] = useState('');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const config = toolConfigs[toolId];

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: config?.acceptFiles.split(',').reduce((acc, ext) => ({ ...acc, [ext]: [] }), {}),
    multiple: config?.multiple,
    maxSize: 10 * 1024 * 1024, // 10MB
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles);
      setError(null);
      setResult(null);
    },
    onDropRejected: (rejections) => {
      const error = rejections[0]?.errors[0];
      if (error?.code === 'file-too-large') {
        toast.error('File is too large. Maximum size is 10MB.');
      } else {
        toast.error('Invalid file type.');
      }
    }
  });

  const handleProcess = async () => {
    if (files.length === 0) {
      toast.error('Please upload a file first.');
      return;
    }

    if (config.hasExtraInput && !extraInput) {
      toast.error(`Please provide ${config.inputLabel}.`);
      return;
    }

    setProcessing(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      
      if (config.multiple) {
        files.forEach(file => formData.append('files', file));
      } else {
        formData.append('file', files[0]);
      }

      // Add extra input based on tool
      if (config.hasExtraInput) {
        if (toolId === 'split') {
          formData.append('pages', extraInput);
        } else if (toolId === 'rotate') {
          formData.append('angle', extraInput);
        } else if (toolId === 'watermark') {
          formData.append('text', extraInput);
        } else if (toolId === 'protect' || toolId === 'unlock') {
          formData.append('password', extraInput);
        } else if (toolId === 'sign') {
          formData.append('signature_text', extraInput);
        }
      }

      const response = await axios.post(`${API}/${toolId}`, formData, {
        responseType: toolId === 'ocr' ? 'json' : 'blob',
        timeout: 60000,
      });

      if (toolId === 'ocr') {
        setResult({ type: 'text', data: response.data });
        toast.success('Text extracted successfully!');
      } else {
        const blob = new Blob([response.data]);
        const url = window.URL.createObjectURL(blob);
        const extension = toolId.includes('jpg') ? 'jpg' : 
                         toolId.includes('png') ? 'png' : 
                         toolId.includes('word') ? 'docx' :
                         toolId.includes('excel') ? 'xlsx' : 'pdf';
        setResult({ type: 'file', url, filename: `output.${extension}` });
        toast.success('Processing complete!');
      }
    } catch (err) {
      console.error('Processing error:', err);
      setError(err.response?.data?.detail || 'An error occurred during processing.');
      toast.error('Processing failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (result?.type === 'file') {
      const a = document.createElement('a');
      a.href = result.url;
      a.download = result.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success('Download started!');
    }
  };

  const handleReset = () => {
    setFiles([]);
    setExtraInput('');
    setResult(null);
    setError(null);
  };

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Tool not found</h1>
          <Button onClick={() => navigate('/')} data-testid="back-button">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-pink-900/20" />
      </div>

      {/* Header */}
      <div className="py-8 px-6 border-b border-white/10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-gray-300 hover:text-white"
            data-testid="back-to-home-button"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
          <h1 className="text-2xl md:text-3xl font-heading font-bold gradient-text" data-testid="tool-title">
            {config.title}
          </h1>
          <div className="w-32" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* Main Content */}
      <div className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="glass rounded-2xl p-8">
                <h2 className="text-xl font-heading font-semibold mb-6 text-white">Upload File{config.multiple ? 's' : ''}</h2>
                
                {/* Dropzone */}
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 min-h-[300px] flex flex-col items-center justify-center ${
                    isDragActive 
                      ? 'border-indigo-500 bg-indigo-500/10' 
                      : 'border-white/20 hover:border-indigo-500/50 hover:bg-white/5'
                  }`}
                  data-testid="dropzone"
                >
                  <input {...getInputProps()} data-testid="file-input" />
                  <Upload className={`h-16 w-16 mb-4 ${
                    isDragActive ? 'text-indigo-400' : 'text-gray-400'
                  }`} />
                  {files.length === 0 ? (
                    <>
                      <p className="text-lg text-gray-300 mb-2">
                        {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
                      </p>
                      <p className="text-sm text-gray-500">or click to browse</p>
                      <p className="text-xs text-gray-600 mt-4">Max file size: 10MB</p>
                    </>
                  ) : (
                    <div className="w-full">
                      <p className="text-green-400 mb-2">✓ {files.length} file{files.length > 1 ? 's' : ''} selected</p>
                      {files.map((file, idx) => (
                        <p key={idx} className="text-sm text-gray-400 truncate">{file.name}</p>
                      ))}
                      <p className="text-xs text-gray-500 mt-4">Click to change</p>
                    </div>
                  )}
                </div>

                {/* Extra Input */}
                {config.hasExtraInput && (
                  <div className="mt-6">
                    <Label htmlFor="extra-input" className="text-white mb-2">
                      {config.inputLabel}
                    </Label>
                    <Input
                      id="extra-input"
                      type={config.inputType || 'text'}
                      placeholder={config.inputPlaceholder}
                      value={extraInput}
                      onChange={(e) => setExtraInput(e.target.value)}
                      className="bg-white/5 border-white/10 focus:border-indigo-500 text-white"
                      data-testid="extra-input"
                    />
                  </div>
                )}

                {/* Process Button */}
                <Button
                  onClick={handleProcess}
                  disabled={processing || files.length === 0}
                  className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium py-6 rounded-full shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  data-testid="process-button"
                >
                  {processing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Process File'
                  )}
                </Button>
              </div>
            </motion.div>

            {/* Result Section */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="glass rounded-2xl p-8 min-h-[500px] flex flex-col">
                <h2 className="text-xl font-heading font-semibold mb-6 text-white">Result</h2>
                
                {!result && !error && !processing && (
                  <div className="flex-1 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                        <Download className="h-12 w-12 text-gray-600" />
                      </div>
                      <p>Your processed file will appear here</p>
                    </div>
                  </div>
                )}

                {processing && (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <Loader2 className="h-16 w-16 text-indigo-500 animate-spin mx-auto mb-4" />
                      <p className="text-gray-400">Processing your file...</p>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
                        <AlertCircle className="h-12 w-12 text-red-500" />
                      </div>
                      <p className="text-red-400 mb-4">{error}</p>
                      <Button onClick={handleReset} variant="outline">
                        Try Again
                      </Button>
                    </div>
                  </div>
                )}

                {result && result.type === 'file' && (
                  <div className="flex-1 flex flex-col items-center justify-center" data-testid="result-section">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-500/10 flex items-center justify-center">
                      <Download className="h-12 w-12 text-green-500" />
                    </div>
                    <p className="text-green-400 mb-2 text-lg font-semibold">✓ Processing Complete!</p>
                    <p className="text-gray-400 mb-6">Your file is ready for download</p>
                    <div className="space-y-3 w-full">
                      <Button
                        onClick={handleDownload}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-medium py-6 rounded-full shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:-translate-y-0.5 transition-all duration-300"
                        data-testid="download-button"
                      >
                        <Download className="mr-2 h-5 w-5" />
                        Download File
                      </Button>
                      <Button
                        onClick={handleReset}
                        variant="outline"
                        className="w-full"
                        data-testid="process-another-button"
                      >
                        Process Another File
                      </Button>
                    </div>
                  </div>
                )}

                {result && result.type === 'text' && (
                  <div className="flex-1 flex flex-col" data-testid="ocr-result">
                    <div className="flex-1 bg-white/5 rounded-xl p-4 overflow-auto mb-4">
                      <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
                        {result.data.text}
                      </pre>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">
                      Extracted from {result.data.pages} page{result.data.pages > 1 ? 's' : ''}
                    </p>
                    <Button
                      onClick={handleReset}
                      variant="outline"
                      className="w-full"
                    >
                      Process Another File
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}