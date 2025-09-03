import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';
import {
  DocumentIcon,
  CloudArrowUpIcon,
  ScissorsIcon,
} from '@heroicons/react/24/outline';
import AdBanner from '../../components/AdBanner';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function PdfSplitterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [pageRange, setPageRange] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [pdfData, setPdfData] = useState<ArrayBuffer | null>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const pdfFile = acceptedFiles[0];
    
    if (!pdfFile || pdfFile.type !== 'application/pdf') {
      toast.error('Please select a PDF file');
      return;
    }

    try {
      setFile(pdfFile);
      const arrayBuffer = await pdfFile.arrayBuffer();
      setPdfData(arrayBuffer);
      
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pageCount = pdfDoc.getPageCount();
      setTotalPages(pageCount);
      setPageRange(`1-${pageCount}`);
      toast.success(`PDF loaded successfully! ${pageCount} pages found.`);
    } catch (error) {
      toast.error('Error reading PDF file');
      console.error(error);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    multiple: false,
  });

  const parsePageRange = (range: string): number[] => {
    const pages: number[] = [];
    const parts = range.split(',');
    
    for (const part of parts) {
      const trimmed = part.trim();
      if (trimmed.includes('-')) {
        const [start, end] = trimmed.split('-').map(n => parseInt(n.trim()));
        if (start && end && start <= end && start > 0 && end <= totalPages) {
          for (let i = start; i <= end; i++) {
            if (!pages.includes(i)) pages.push(i);
          }
        }
      } else {
        const pageNum = parseInt(trimmed);
        if (pageNum && pageNum > 0 && pageNum <= totalPages && !pages.includes(pageNum)) {
          pages.push(pageNum);
        }
      }
    }
    
    return pages.sort((a, b) => a - b);
  };

  const splitPDF = async () => {
    if (!file || !pdfData) {
      toast.error('Please select a PDF file first');
      return;
    }

    const pages = parsePageRange(pageRange);
    if (pages.length === 0) {
      toast.error('Please enter valid page numbers');
      return;
    }

    setIsProcessing(true);

    try {
      const originalPdf = await PDFDocument.load(pdfData);
      const newPdf = await PDFDocument.create();
      
      // Copy selected pages
      const pagesToCopy = pages.map(pageNum => pageNum - 1); // Convert to 0-based index
      const copiedPages = await newPdf.copyPages(originalPdf, pagesToCopy);
      
      copiedPages.forEach(page => newPdf.addPage(page));
      
      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      
      const fileName = file.name.replace('.pdf', '') + `_pages_${pages.join('-')}.pdf`;
      saveAs(blob, fileName);
      
      toast.success(`PDF split successfully! Pages ${pages.join(', ')} extracted.`);
    } catch (error) {
      console.error('Error splitting PDF:', error);
      toast.error('Error splitting PDF. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPdfData(null);
    setTotalPages(0);
    setPageRange('');
  };

  return (
    <>
      <Helmet>
        <title>Split PDF Files - Extract Pages from PDF Online</title>
        <meta name="description" content="Split PDF files and extract specific pages. Free online PDF splitter with page range selection." />
        <meta name="keywords" content="split PDF, extract PDF pages, PDF splitter, separate PDF pages" />
      </Helmet>

      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ScissorsIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Split PDF Files</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Extract specific pages from your PDF documents. Select page ranges like "1-3, 5, 7-10" to create a new PDF with only the pages you need.
          </p>
        </div>

        {/* Upload Area */}
        {!file && (
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-8 shadow-lg">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                isDragActive
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300 hover:border-red-400 hover:bg-gray-50'
              }`}
            >
              <input {...getInputProps()} />
              <CloudArrowUpIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              {isDragActive ? (
                <p className="text-lg text-red-600">Drop your PDF file here...</p>
              ) : (
                <>
                  <p className="text-lg text-gray-600 mb-2">
                    Drag & drop a PDF file here, or click to select
                  </p>
                  <p className="text-sm text-gray-500">
                    Select a PDF file to split into separate pages
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        {/* File Info and Page Selection */}
        {file && (
          <div className="space-y-6">
            {/* File Info */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Selected PDF</h2>
                <button
                  onClick={clearFile}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Select Different File
                </button>
              </div>
              
              <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
                <DocumentIcon className="w-8 h-8 text-red-500 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)} • {totalPages} pages
                  </p>
                </div>
              </div>
            </div>

            {/* Page Range Selection */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Pages to Extract</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Page Range
                  </label>
                  <input
                    type="text"
                    value={pageRange}
                    onChange={(e) => setPageRange(e.target.value)}
                    placeholder="e.g., 1-3, 5, 7-10"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter page numbers separated by commas. Use dashes for ranges (e.g., 1-3, 5, 7-10)
                  </p>
                </div>

                {/* Quick Select Buttons */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setPageRange('1')}
                    className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md"
                  >
                    First Page
                  </button>
                  <button
                    onClick={() => setPageRange(totalPages.toString())}
                    className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md"
                  >
                    Last Page
                  </button>
                  <button
                    onClick={() => setPageRange(`1-${Math.ceil(totalPages / 2)}`)}
                    className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md"
                  >
                    First Half
                  </button>
                  <button
                    onClick={() => setPageRange(`${Math.ceil(totalPages / 2) + 1}-${totalPages}`)}
                    className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md"
                  >
                    Second Half
                  </button>
                  <button
                    onClick={() => setPageRange(`1-${totalPages}`)}
                    className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md"
                  >
                    All Pages
                  </button>
                </div>

                {/* Preview Selected Pages */}
                {pageRange && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-700 mb-2">Pages to extract:</p>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        {(() => {
                          const pages = parsePageRange(pageRange);
                          if (pages.length === 0) return 'Invalid page range';
                          if (pages.length === 1) return `Page ${pages[0]}`;
                          if (pages.length <= 10) return `Pages ${pages.join(', ')}`;
                          return `${pages.length} pages: ${pages.slice(0, 5).join(', ')}...`;
                        })()}
                      </p>
                    </div>
                  </div>
                )}

                {/* Split Button */}
                <button
                  onClick={splitPDF}
                  disabled={!pageRange.trim() || parsePageRange(pageRange).length === 0 || isProcessing}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center space-x-2">
                      <LoadingSpinner size="sm" />
                      <span>Splitting PDF...</span>
                    </div>
                  ) : (
                    <>
                      <ScissorsIcon className="w-5 h-5 inline mr-2" />
                      Split PDF
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Ad */}
        <AdBanner 
          slot="pdf-splitter-bottom"
          size="728x90"
          className="mx-auto"
        />

        {/* Instructions */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">How to Split PDF Files</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Page Range Examples:</h4>
              <ul className="space-y-1">
                <li>• <code className="bg-gray-100 px-1 rounded">1-5</code> - Pages 1 through 5</li>
                <li>• <code className="bg-gray-100 px-1 rounded">1,3,5</code> - Pages 1, 3, and 5</li>
                <li>• <code className="bg-gray-100 px-1 rounded">1-3,7-10</code> - Pages 1-3 and 7-10</li>
                <li>• <code className="bg-gray-100 px-1 rounded">5</code> - Just page 5</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Features:</h4>
              <ul className="space-y-1">
                <li>• Extract specific pages or ranges</li>
                <li>• Maintain original PDF quality</li>
                <li>• Quick selection buttons</li>
                <li>• Client-side processing (secure)</li>
                <li>• No file size limits</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <ScissorsIcon className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Precise Selection</h3>
            <p className="text-sm text-gray-600">
              Extract exactly the pages you need with flexible range selection.
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-red-600 font-bold">🔒</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">100% Secure</h3>
            <p className="text-sm text-gray-600">
              All processing happens in your browser. Files never leave your computer.
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-red-600 font-bold">⚡</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Fast Processing</h3>
            <p className="text-sm text-gray-600">
              Split large PDFs quickly with optimized processing algorithms.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
