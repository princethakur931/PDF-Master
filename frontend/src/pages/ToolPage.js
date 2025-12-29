import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Upload,
  Download,
  Loader2,
  AlertCircle,
  Sun,
  Moon,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const toolConfigs = {
  merge: {
    title: "Merge PDF",
    acceptFiles: ".pdf",
    multiple: true,
    hasExtraInput: false,
  },
  split: {
    title: "Split PDF",
    acceptFiles: ".pdf",
    multiple: false,
    hasExtraInput: true,
    inputLabel: "Page Range (e.g., 1-3,5,7-9)",
    inputPlaceholder: "1-3,5",
  },
  compress: {
    title: "Compress PDF",
    acceptFiles: ".pdf",
    multiple: false,
    hasExtraInput: false,
  },
  rotate: {
    title: "Rotate PDF",
    acceptFiles: ".pdf",
    multiple: false,
    hasExtraInput: true,
    inputLabel: "Rotation Angle (90, 180, 270)",
    inputPlaceholder: "90",
  },
  "pdf-to-jpg": {
    title: "PDF to JPG",
    acceptFiles: ".pdf",
    multiple: false,
    hasExtraInput: false,
  },
  "pdf-to-png": {
    title: "PDF to PNG",
    acceptFiles: ".pdf",
    multiple: false,
    hasExtraInput: false,
  },
  "jpg-to-pdf": {
    title: "JPG to PDF",
    acceptFiles: ".jpg,.jpeg",
    multiple: false,
    hasExtraInput: false,
  },
  "png-to-pdf": {
    title: "PNG to PDF",
    acceptFiles: ".png",
    multiple: false,
    hasExtraInput: false,
  },
  "pdf-to-word": {
    title: "PDF to Word",
    acceptFiles: ".pdf",
    multiple: false,
    hasExtraInput: false,
  },
  "word-to-pdf": {
    title: "Word to PDF",
    acceptFiles: ".doc,.docx",
    multiple: false,
    hasExtraInput: false,
  },
  "pdf-to-excel": {
    title: "PDF to Excel",
    acceptFiles: ".pdf",
    multiple: false,
    hasExtraInput: false,
  },
  "excel-to-pdf": {
    title: "Excel to PDF",
    acceptFiles: ".xls,.xlsx",
    multiple: false,
    hasExtraInput: false,
  },
  "xml-to-pdf": {
    title: "XML to PDF",
    acceptFiles: ".xml",
    multiple: false,
    hasExtraInput: false,
  },
  "cpp-to-pdf": {
    title: "CPP to PDF",
    acceptFiles: ".cpp,.cc,.cxx,.h,.hpp",
    multiple: false,
    hasExtraInput: false,
  },
  "ipynb-to-pdf": {
    title: "Jupyter Notebook to PDF",
    acceptFiles: ".ipynb",
    multiple: false,
    hasExtraInput: false,
  },
  ocr: {
    title: "OCR PDF",
    acceptFiles: ".pdf",
    multiple: false,
    hasExtraInput: false,
  },
  watermark: {
    title: "Add Watermark",
    acceptFiles: ".pdf",
    multiple: false,
    hasExtraInput: true,
    hasWatermarkOptions: true,
    inputLabel: "Watermark Type",
    inputType: "select",
    options: [
      { value: "text", label: "Text Watermark" },
      { value: "image", label: "Image Watermark (PNG/JPG/JPEG)" },
    ],
  },
  protect: {
    title: "Protect PDF",
    acceptFiles: ".pdf",
    multiple: false,
    hasExtraInput: true,
    inputLabel: "Password",
    inputPlaceholder: "Enter password",
    inputType: "password",
  },
  unlock: {
    title: "Unlock PDF",
    acceptFiles: ".pdf",
    multiple: false,
    hasExtraInput: true,
    inputLabel: "Current Password",
    inputPlaceholder: "Enter password",
    inputType: "password",
  },
  sign: {
    title: "Sign PDF",
    acceptFiles: ".pdf",
    multiple: false,
    hasExtraInput: true,
    inputLabel: "Signature Text",
    inputPlaceholder: "Your Name",
  },
  "java-to-pdf": {
    title: "Java to PDF",
    acceptFiles: ".java",
    multiple: false,
    hasExtraInput: false,
  },
  "add-page-numbers": {
    title: "Add Page Numbers",
    acceptFiles: ".pdf",
    multiple: false,
    hasExtraInput: true,
    inputType: "select",
    inputLabel: "Page Number Format",
    options: [
      { value: "numeric", label: "1, 2, 3, 4, ..." },
      { value: "numeric-page", label: "Page 1, Page 2, Page 3, ..." },
      { value: "roman-lower", label: "i, ii, iii, iv, ..." },
      { value: "roman-lower-page", label: "Page i, Page ii, Page iii, ..." },
      { value: "roman-upper", label: "I, II, III, IV, ..." },
      { value: "roman-upper-page", label: "Page I, Page II, Page III, ..." },
    ],
    inputLabel2: "Page Number Position",
    options2: [
      { value: "bottom-left", label: "Bottom Left" },
      { value: "bottom-center", label: "Bottom Center" },
      { value: "bottom-right", label: "Bottom Right" },
    ],
  },
  "python-to-pdf": {
    title: "Python to PDF",
    acceptFiles: ".py",
    multiple: false,
    hasExtraInput: false,
  },
  "delete-pages": {
    title: "Delete Pages",
    acceptFiles: ".pdf",
    multiple: false,
    hasExtraInput: false,
    hasPageSelection: true,
  },
};

export default function ToolPage() {
  const { toolId } = useParams();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [extraInput, setExtraInput] = useState("");
  const [extraInput2, setExtraInput2] = useState("");
  const [watermarkImage, setWatermarkImage] = useState(null);
  const [watermarkText, setWatermarkText] = useState("");
  const [watermarkOpacity, setWatermarkOpacity] = useState(30);
  const [watermarkRotation, setWatermarkRotation] = useState(45);
  const [watermarkSize, setWatermarkSize] = useState(50);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "light" ? false : true;
  });

  // States for delete-pages feature
  const [pdfPages, setPdfPages] = useState([]);
  const [selectedPages, setSelectedPages] = useState([]);
  const [loadingPages, setLoadingPages] = useState(false);

  // Save theme preference to localStorage
  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const config = toolConfigs[toolId];

  // Function to load PDF page previews
  const loadPdfPreviews = async file => {
    console.log("Loading PDF previews for:", file.name);
    setLoadingPages(true);
    setPdfPages([]);
    setSelectedPages([]);

    try {
      const formData = new FormData();
      formData.append("file", file);

      console.log("Sending request to:", `${API}/preview-pages`);
      const response = await axios.post(`${API}/preview-pages`, formData, {
        timeout: 60000,
      });

      console.log("Preview response:", response.data);
      setPdfPages(response.data.pages);
      toast.success(`Loaded ${response.data.totalPages} pages`);
    } catch (err) {
      console.error("Preview error:", err);
      console.error("Error details:", err.response?.data);
      toast.error(
        "Failed to load PDF previews: " +
          (err.response?.data?.detail || err.message)
      );
    } finally {
      setLoadingPages(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: config?.acceptFiles
      .split(",")
      .reduce((acc, ext) => ({ ...acc, [ext]: [] }), {}),
    multiple: config?.multiple,
    maxSize: 10 * 1024 * 1024, // 10MB
    onDrop: acceptedFiles => {
      console.log("Files dropped:", acceptedFiles);
      console.log("Current toolId:", toolId);
      console.log("Config hasPageSelection:", config?.hasPageSelection);

      setFiles(acceptedFiles);
      setError(null);
      setResult(null);
      // Set default values for select inputs
      if (config?.inputType === "select" && config?.options) {
        setExtraInput(config.options[0].value);
      }
      if (config?.options2) {
        setExtraInput2(config.options2[1].value); // Default to bottom-center
      }

      // Load page previews for delete-pages tool
      if (config?.hasPageSelection && acceptedFiles.length > 0) {
        console.log("Loading page previews...");
        loadPdfPreviews(acceptedFiles[0]);
      } else {
        console.log("Skipping page preview - condition not met");
      }
    },
    onDropRejected: rejections => {
      const error = rejections[0]?.errors[0];
      if (error?.code === "file-too-large") {
        toast.error("File is too large. Maximum size is 10MB.");
      } else {
        toast.error("Invalid file type.");
      }
    },
  });

  const handleProcess = async () => {
    if (files.length === 0) {
      toast.error("Please upload a file first.");
      return;
    }

    if (config.hasExtraInput && !extraInput) {
      toast.error(`Please provide ${config.inputLabel}.`);
      return;
    }

    // Special validation for delete-pages
    if (toolId === "delete-pages") {
      if (selectedPages.length === 0) {
        toast.error("Please select at least one page to delete.");
        return;
      }
      if (selectedPages.length === pdfPages.length) {
        toast.error("Cannot delete all pages. At least one page must remain.");
        return;
      }
    }

    // Special validation for watermark
    if (toolId === "watermark") {
      if (extraInput === "text" && !watermarkText) {
        toast.error("Please provide watermark text.");
        return;
      }
      if (extraInput === "image" && !watermarkImage) {
        toast.error("Please upload a watermark image.");
        return;
      }
    }

    setProcessing(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();

      if (config.multiple) {
        files.forEach(file => formData.append("files", file));
      } else {
        formData.append("file", files[0]);
      }

      // Add extra input based on tool
      if (config.hasExtraInput) {
        if (toolId === "split") {
          formData.append("pages", extraInput);
        } else if (toolId === "rotate") {
          formData.append("angle", extraInput);
        } else if (toolId === "watermark") {
          // Handle watermark options
          if (extraInput === "text") {
            formData.append("text", watermarkText);
          } else if (extraInput === "image" && watermarkImage) {
            formData.append("watermark_image", watermarkImage);
          }
          // Add position (always center), opacity, rotation, and size
          // Convert 0-100 scale to actual values
          formData.append("position", "center");
          formData.append("opacity", watermarkOpacity / 100); // Convert to 0-1
          formData.append("rotation", (watermarkRotation * 360) / 100); // Convert to 0-360
          formData.append("size", (watermarkSize * 80) / 100 + 20); // Convert to 20-100
        } else if (toolId === "protect" || toolId === "unlock") {
          formData.append("password", extraInput);
        } else if (toolId === "sign") {
          formData.append("signature_text", extraInput);
        } else if (toolId === "add-page-numbers") {
          formData.append("format", extraInput);
          formData.append("position", extraInput2);
        }
      }

      // Handle delete-pages
      if (toolId === "delete-pages") {
        const pagesToDelete = selectedPages.join(",");
        formData.append("pages_to_delete", pagesToDelete);
      }

      const response = await axios.post(`${API}/${toolId}`, formData, {
        responseType: toolId === "ocr" ? "json" : "blob",
        timeout: 60000,
      });

      if (toolId === "ocr") {
        setResult({ type: "text", data: response.data });
        toast.success("Text extracted successfully!");
      } else {
        const blob = new Blob([response.data]);
        const url = window.URL.createObjectURL(blob);

        // Try to get filename from Content-Disposition header
        let filename = "output.pdf";
        const contentDisposition = response.headers["content-disposition"];
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="?(.+?)"?$/);
          if (filenameMatch && filenameMatch[1]) {
            filename = filenameMatch[1];
          }
        } else {
          // Fallback: determine output file extension based on conversion direction
          let extension = "pdf";
          if (toolId === "pdf-to-jpg") extension = "jpg";
          else if (toolId === "pdf-to-png") extension = "png";
          else if (toolId === "pdf-to-word") extension = "docx";
          else if (toolId === "pdf-to-excel") extension = "xlsx";
          
          // For conversions to PDF, use original filename if available
          if (extension === "pdf" && files.length > 0) {
            const originalName = files[0].name;
            const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
            filename = `${nameWithoutExt}.${extension}`;
          } else {
            filename = `output.${extension}`;
          }
        }

        setResult({ type: "file", url, filename });
        toast.success("Processing complete!");
      }
    } catch (err) {
      console.error("Processing error:", err);
      setError(
        err.response?.data?.detail || "An error occurred during processing."
      );
      toast.error("Processing failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (result?.type === "file") {
      const a = document.createElement("a");
      a.href = result.url;
      a.download = result.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success("Download started!");
    }
  };

  const handleShare = async () => {
    try {
      if (!result || !result.url) {
        toast.error("No file available to share");
        return;
      }

      // Check if Web Share API is available
      if (!navigator.share) {
        toast.error(
          "Sharing is not supported on this browser. Please use download instead."
        );
        return;
      }

      // Convert blob URL to actual file
      const response = await fetch(result.url);
      const blob = await response.blob();
      const file = new File([blob], result.filename, { type: blob.type });

      // Check if sharing files is supported
      if (navigator.canShare && !navigator.canShare({ files: [file] })) {
        toast.error(
          "File sharing is not supported on this device. Please use download instead."
        );
        return;
      }

      // Share the file directly without downloading
      await navigator.share({
        files: [file],
        title: "PDF Master",
        text: `Sharing ${result.filename}`,
      });

      toast.success("File shared successfully!");
    } catch (error) {
      // User cancelled the share
      if (error.name === "AbortError") {
        toast.info("Share cancelled");
      } else {
        console.error("Share error:", error);
        toast.error("Failed to share file. Please try download instead.");
      }
    }
  };

  const handleReset = () => {
    setFiles([]);
    setExtraInput("");
    setExtraInput2("");
    setWatermarkImage(null);
    setWatermarkText("");
    setWatermarkOpacity(30);
    setWatermarkRotation(45);
    setWatermarkSize(50);
    setResult(null);
    setError(null);
    setPdfPages([]);
    setSelectedPages([]);
  };

  if (!config) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDarkMode ? "bg-gray-950" : "bg-gray-50"
        }`}
      >
        <div className="text-center">
          <h1
            className={`text-2xl font-bold mb-4 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Tool not found
          </h1>
          <Button onClick={() => navigate("/")} data-testid="back-button">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
        </div>
      </div>
    );
  }

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
      </div>

      {/* Header */}
      <div
        className={`py-8 px-6 border-b ${
          isDarkMode ? "border-white/10" : "border-gray-200"
        }`}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className={
              isDarkMode
                ? "text-gray-300 hover:text-white"
                : "text-gray-600 hover:text-gray-900"
            }
            data-testid="back-to-home-button"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
          <h1
            className="text-2xl md:text-3xl font-heading font-bold gradient-text"
            data-testid="tool-title"
          >
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
              <div
                className={`rounded-2xl p-8 ${
                  isDarkMode
                    ? "glass"
                    : "bg-white shadow-xl border border-gray-200"
                }`}
              >
                <h2
                  className={`text-xl font-heading font-semibold mb-6 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Upload File{config.multiple ? "s" : ""}
                </h2>

                {/* Dropzone */}
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 min-h-[300px] flex flex-col items-center justify-center ${
                    isDragActive
                      ? "border-indigo-500 bg-indigo-500/10"
                      : isDarkMode
                      ? "border-white/20 hover:border-indigo-500/50 hover:bg-white/5"
                      : "border-gray-300 hover:border-indigo-500 hover:bg-indigo-50"
                  }`}
                  data-testid="dropzone"
                >
                  <input {...getInputProps()} data-testid="file-input" />
                  <Upload
                    className={`h-16 w-16 mb-4 ${
                      isDragActive
                        ? "text-indigo-400"
                        : isDarkMode
                        ? "text-gray-400"
                        : "text-gray-500"
                    }`}
                  />
                  {files.length === 0 ? (
                    <>
                      <p
                        className={`text-lg mb-2 ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {isDragActive
                          ? "Drop files here"
                          : "Drag & drop files here"}
                      </p>
                      <p
                        className={`text-sm ${
                          isDarkMode ? "text-gray-500" : "text-gray-500"
                        }`}
                      >
                        or click to browse
                      </p>
                      <p
                        className={`text-xs mt-4 ${
                          isDarkMode ? "text-gray-600" : "text-gray-400"
                        }`}
                      >
                        Max file size: 10MB
                      </p>
                    </>
                  ) : (
                    <div className="w-full">
                      <p className="text-green-400 mb-2">
                        ✓ {files.length} file{files.length > 1 ? "s" : ""}{" "}
                        selected
                      </p>
                      {files.map((file, idx) => (
                        <p
                          key={idx}
                          className={`text-sm truncate ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {file.name}
                        </p>
                      ))}
                      <p
                        className={`text-xs mt-4 ${
                          isDarkMode ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        Click to change
                      </p>
                    </div>
                  )}
                </div>

                {/* Extra Input */}
                {config.hasExtraInput && (
                  <div className="mt-6 space-y-4">
                    {config.inputType === "select" ? (
                      <>
                        <div>
                          <Label
                            htmlFor="extra-input"
                            className={
                              isDarkMode ? "text-white" : "text-gray-900"
                            }
                          >
                            {config.inputLabel}
                          </Label>
                          <Select
                            value={extraInput}
                            onValueChange={setExtraInput}
                          >
                            <SelectTrigger
                              className={
                                isDarkMode
                                  ? "bg-white/5 border-white/10 focus:border-indigo-500 text-white mt-2"
                                  : "bg-white border-gray-300 focus:border-indigo-500 text-gray-900 mt-2"
                              }
                              data-testid="extra-input"
                            >
                              <SelectValue placeholder="Select format" />
                            </SelectTrigger>
                            <SelectContent>
                              {config.options?.map(option => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        {config.options2 && (
                          <div>
                            <Label
                              htmlFor="extra-input-2"
                              className={
                                isDarkMode ? "text-white" : "text-gray-900"
                              }
                            >
                              {config.inputLabel2}
                            </Label>
                            <Select
                              value={extraInput2}
                              onValueChange={setExtraInput2}
                            >
                              <SelectTrigger
                                className={
                                  isDarkMode
                                    ? "bg-white/5 border-white/10 focus:border-indigo-500 text-white mt-2"
                                    : "bg-white border-gray-300 focus:border-indigo-500 text-gray-900 mt-2"
                                }
                                data-testid="extra-input-2"
                              >
                                <SelectValue placeholder="Select position" />
                              </SelectTrigger>
                              <SelectContent>
                                {config.options2?.map(option => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        {/* Watermark-specific options */}
                        {config.hasWatermarkOptions && (
                          <>
                            {extraInput === "text" && (
                              <div>
                                <Label
                                  htmlFor="watermark-text"
                                  className={
                                    isDarkMode ? "text-white" : "text-gray-900"
                                  }
                                >
                                  Watermark Text
                                </Label>
                                <Input
                                  id="watermark-text"
                                  type="text"
                                  placeholder="CONFIDENTIAL"
                                  value={watermarkText}
                                  onChange={e =>
                                    setWatermarkText(e.target.value)
                                  }
                                  className={
                                    isDarkMode
                                      ? "bg-white/5 border-white/10 focus:border-indigo-500 text-white mt-2"
                                      : "bg-white border-gray-300 focus:border-indigo-500 text-gray-900 mt-2"
                                  }
                                />
                              </div>
                            )}

                            {extraInput === "image" && (
                              <div className="mb-4">
                                <Label
                                  htmlFor="watermark-image"
                                  className={
                                    isDarkMode
                                      ? "text-white mb-2 block"
                                      : "text-gray-900 mb-2 block"
                                  }
                                >
                                  Watermark Image
                                </Label>
                                <div className="relative">
                                  <Input
                                    id="watermark-image"
                                    type="file"
                                    accept=".png,.jpg,.jpeg"
                                    onChange={e =>
                                      setWatermarkImage(e.target.files[0])
                                    }
                                    className={
                                      isDarkMode
                                        ? "bg-white/5 border-white/10 focus:border-indigo-500 text-white w-full h-auto py-2 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 file:cursor-pointer"
                                        : "bg-white border-gray-300 focus:border-indigo-500 text-gray-900 w-full h-auto py-2 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 file:cursor-pointer"
                                    }
                                  />
                                </div>
                                {watermarkImage && (
                                  <p className="text-sm text-green-400 mt-2 flex items-center">
                                    <span className="mr-2">✓</span>
                                    <span className="font-medium">
                                      {watermarkImage.name}
                                    </span>
                                  </p>
                                )}
                              </div>
                            )}

                            <div className="grid grid-cols-3 gap-4 mt-6">
                              {/* Opacity Control */}
                              <div>
                                <Label
                                  className={
                                    isDarkMode
                                      ? "text-white text-sm text-center block mb-2"
                                      : "text-gray-900 text-sm text-center block mb-2"
                                  }
                                >
                                  Opacity
                                </Label>
                                <div className="flex items-center gap-2">
                                  <Button
                                    type="button"
                                    onClick={() =>
                                      setWatermarkOpacity(
                                        Math.max(0, watermarkOpacity - 10)
                                      )
                                    }
                                    className={
                                      isDarkMode
                                        ? "h-9 w-9 p-0 bg-white/5 hover:bg-white/10 border border-white/10 text-white"
                                        : "h-9 w-9 p-0 bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-900"
                                    }
                                  >
                                    -
                                  </Button>
                                  <Input
                                    type="text"
                                    value={watermarkOpacity}
                                    onChange={e => {
                                      const val = e.target.value.replace(
                                        /[^0-9]/g,
                                        ""
                                      );
                                      const num =
                                        val === "" ? 0 : parseInt(val);
                                      setWatermarkOpacity(
                                        Math.min(100, Math.max(0, num))
                                      );
                                    }}
                                    className={
                                      isDarkMode
                                        ? "h-9 text-center bg-white/5 border-white/10 text-white"
                                        : "h-9 text-center bg-white border-gray-300 text-gray-900"
                                    }
                                  />
                                  <Button
                                    type="button"
                                    onClick={() =>
                                      setWatermarkOpacity(
                                        Math.min(100, watermarkOpacity + 10)
                                      )
                                    }
                                    className={
                                      isDarkMode
                                        ? "h-9 w-9 p-0 bg-white/5 hover:bg-white/10 border border-white/10 text-white"
                                        : "h-9 w-9 p-0 bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-900"
                                    }
                                  >
                                    +
                                  </Button>
                                </div>
                              </div>

                              {/* Rotation Control */}
                              <div>
                                <Label
                                  className={
                                    isDarkMode
                                      ? "text-white text-sm text-center block mb-2"
                                      : "text-gray-900 text-sm text-center block mb-2"
                                  }
                                >
                                  Rotation
                                </Label>
                                <div className="flex items-center gap-2">
                                  <Button
                                    type="button"
                                    onClick={() =>
                                      setWatermarkRotation(
                                        Math.max(0, watermarkRotation - 10)
                                      )
                                    }
                                    className={
                                      isDarkMode
                                        ? "h-9 w-9 p-0 bg-white/5 hover:bg-white/10 border border-white/10 text-white"
                                        : "h-9 w-9 p-0 bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-900"
                                    }
                                  >
                                    -
                                  </Button>
                                  <Input
                                    type="text"
                                    value={watermarkRotation}
                                    onChange={e => {
                                      const val = e.target.value.replace(
                                        /[^0-9]/g,
                                        ""
                                      );
                                      const num =
                                        val === "" ? 0 : parseInt(val);
                                      setWatermarkRotation(
                                        Math.min(100, Math.max(0, num))
                                      );
                                    }}
                                    className={
                                      isDarkMode
                                        ? "h-9 text-center bg-white/5 border-white/10 text-white"
                                        : "h-9 text-center bg-white border-gray-300 text-gray-900"
                                    }
                                  />
                                  <Button
                                    type="button"
                                    onClick={() =>
                                      setWatermarkRotation(
                                        Math.min(100, watermarkRotation + 10)
                                      )
                                    }
                                    className={
                                      isDarkMode
                                        ? "h-9 w-9 p-0 bg-white/5 hover:bg-white/10 border border-white/10 text-white"
                                        : "h-9 w-9 p-0 bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-900"
                                    }
                                  >
                                    +
                                  </Button>
                                </div>
                              </div>

                              {/* Size Control */}
                              <div>
                                <Label
                                  className={
                                    isDarkMode
                                      ? "text-white text-sm text-center block mb-2"
                                      : "text-gray-900 text-sm text-center block mb-2"
                                  }
                                >
                                  Size
                                </Label>
                                <div className="flex items-center gap-2">
                                  <Button
                                    type="button"
                                    onClick={() =>
                                      setWatermarkSize(
                                        Math.max(0, watermarkSize - 10)
                                      )
                                    }
                                    className={
                                      isDarkMode
                                        ? "h-9 w-9 p-0 bg-white/5 hover:bg-white/10 border border-white/10 text-white"
                                        : "h-9 w-9 p-0 bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-900"
                                    }
                                  >
                                    -
                                  </Button>
                                  <Input
                                    type="text"
                                    value={watermarkSize}
                                    onChange={e => {
                                      const val = e.target.value.replace(
                                        /[^0-9]/g,
                                        ""
                                      );
                                      const num =
                                        val === "" ? 0 : parseInt(val);
                                      setWatermarkSize(
                                        Math.min(100, Math.max(0, num))
                                      );
                                    }}
                                    className={
                                      isDarkMode
                                        ? "h-9 text-center bg-white/5 border-white/10 text-white"
                                        : "h-9 text-center bg-white border-gray-300 text-gray-900"
                                    }
                                  />
                                  <Button
                                    type="button"
                                    onClick={() =>
                                      setWatermarkSize(
                                        Math.min(100, watermarkSize + 10)
                                      )
                                    }
                                    className={
                                      isDarkMode
                                        ? "h-9 w-9 p-0 bg-white/5 hover:bg-white/10 border border-white/10 text-white"
                                        : "h-9 w-9 p-0 bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-900"
                                    }
                                  >
                                    +
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </>
                    ) : (
                      <div>
                        <Label
                          htmlFor="extra-input"
                          className={
                            isDarkMode ? "text-white" : "text-gray-900"
                          }
                        >
                          {config.inputLabel}
                        </Label>
                        <Input
                          id="extra-input"
                          type={config.inputType || "text"}
                          placeholder={config.inputPlaceholder}
                          value={extraInput}
                          onChange={e => setExtraInput(e.target.value)}
                          className={
                            isDarkMode
                              ? "bg-white/5 border-white/10 focus:border-indigo-500 text-white"
                              : "bg-white border-gray-300 focus:border-indigo-500 text-gray-900"
                          }
                          data-testid="extra-input"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Page Selection for delete-pages */}
                {config?.hasPageSelection && pdfPages.length > 0 && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-4">
                      <Label
                        className={isDarkMode ? "text-white" : "text-gray-900"}
                      >
                        Select Pages to Delete ({selectedPages.length} selected)
                      </Label>
                      <div className="space-x-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setSelectedPages(pdfPages.map(p => p.pageNumber))
                          }
                          className={
                            isDarkMode ? "text-white border-white/10" : ""
                          }
                        >
                          Select All
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedPages([])}
                          className={
                            isDarkMode ? "text-white border-white/10" : ""
                          }
                        >
                          Clear
                        </Button>
                      </div>
                    </div>
                    <div
                      className={`max-h-[400px] overflow-y-auto rounded-xl p-4 ${
                        isDarkMode
                          ? "bg-white/5"
                          : "bg-gray-50 border border-gray-200"
                      }`}
                    >
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {pdfPages.map(page => (
                          <div
                            key={page.pageNumber}
                            onClick={() => {
                              setSelectedPages(prev =>
                                prev.includes(page.pageNumber)
                                  ? prev.filter(p => p !== page.pageNumber)
                                  : [...prev, page.pageNumber]
                              );
                            }}
                            className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                              selectedPages.includes(page.pageNumber)
                                ? "border-red-500 shadow-lg shadow-red-500/25"
                                : isDarkMode
                                ? "border-white/10 hover:border-white/30"
                                : "border-gray-200 hover:border-gray-400"
                            }`}
                          >
                            <img
                              src={page.imageData}
                              alt={`Page ${page.pageNumber}`}
                              className="w-full h-auto"
                            />
                            <div
                              className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                selectedPages.includes(page.pageNumber)
                                  ? "bg-red-500 border-red-500"
                                  : isDarkMode
                                  ? "bg-white/10 border-white/30"
                                  : "bg-white border-gray-300"
                              }`}
                            >
                              {selectedPages.includes(page.pageNumber) && (
                                <svg
                                  className="w-4 h-4 text-white"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                            </div>
                            <div
                              className={`absolute bottom-0 left-0 right-0 py-2 text-center text-sm font-medium ${
                                selectedPages.includes(page.pageNumber)
                                  ? "bg-red-500/90 text-white"
                                  : isDarkMode
                                  ? "bg-black/50 text-white"
                                  : "bg-white/90 text-gray-900"
                              }`}
                            >
                              Page {page.pageNumber}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {loadingPages && (
                  <div className="mt-6 flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 text-indigo-500 animate-spin mr-3" />
                    <p
                      className={isDarkMode ? "text-gray-400" : "text-gray-600"}
                    >
                      Loading page previews...
                    </p>
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
                    "Process File"
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
              <div
                className={`rounded-2xl p-8 min-h-[500px] flex flex-col ${
                  isDarkMode
                    ? "glass"
                    : "bg-white shadow-xl border border-gray-200"
                }`}
              >
                <h2
                  className={`text-xl font-heading font-semibold mb-6 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Result
                </h2>

                {!result && !error && !processing && (
                  <div
                    className={`flex-1 flex items-center justify-center ${
                      isDarkMode ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    <div className="text-center">
                      <div
                        className={`w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center ${
                          isDarkMode ? "bg-white/5" : "bg-gray-100"
                        }`}
                      >
                        <Download
                          className={`h-12 w-12 ${
                            isDarkMode ? "text-gray-600" : "text-gray-400"
                          }`}
                        />
                      </div>
                      <p>Your processed file will appear here</p>
                    </div>
                  </div>
                )}

                {processing && (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <Loader2 className="h-16 w-16 text-indigo-500 animate-spin mx-auto mb-4" />
                      <p
                        className={
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }
                      >
                        Processing your file...
                      </p>
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

                {result && result.type === "file" && (
                  <div
                    className="flex-1 flex flex-col items-center justify-center"
                    data-testid="result-section"
                  >
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-500/10 flex items-center justify-center">
                      <Download className="h-12 w-12 text-green-500" />
                    </div>
                    <p className="text-green-400 mb-2 text-lg font-semibold">
                      ✓ Processing Complete!
                    </p>
                    <p className="text-gray-400 mb-6">
                      Your file is ready for download
                    </p>
                    <div className="space-y-3 w-full">
                      <Button
                        onClick={handleDownload}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-medium py-6 rounded-full shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:-translate-y-0.5 transition-all duration-300"
                        data-testid="download-button"
                      >
                        <Download className="mr-2 h-5 w-5" />
                        Download File
                      </Button>

                      {/* Native Share Button */}
                      <Button
                        onClick={handleShare}
                        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-medium py-6 rounded-full shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-300"
                      >
                        <Share2 className="mr-2 h-5 w-5" />
                        Share File
                      </Button>

                      <Button
                        onClick={handleReset}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium py-6 rounded-full shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all duration-300"
                        data-testid="process-another-button"
                      >
                        Process Another File
                      </Button>
                    </div>
                  </div>
                )}

                {result && result.type === "text" && (
                  <div
                    className="flex-1 flex flex-col"
                    data-testid="ocr-result"
                  >
                    <div
                      className={`flex-1 rounded-xl p-4 overflow-auto mb-4 ${
                        isDarkMode
                          ? "bg-white/5"
                          : "bg-gray-50 border border-gray-200"
                      }`}
                    >
                      <pre
                        className={`text-sm whitespace-pre-wrap font-mono ${
                          isDarkMode ? "text-gray-300" : "text-gray-800"
                        }`}
                      >
                        {result.data.text}
                      </pre>
                    </div>
                    <p
                      className={`text-sm mb-4 ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Extracted from {result.data.pages} page
                      {result.data.pages > 1 ? "s" : ""}
                    </p>
                    <Button
                      onClick={handleReset}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium py-6 rounded-full shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all duration-300"
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
