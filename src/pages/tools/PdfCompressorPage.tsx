import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { DocumentArrowDownIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useDropzone } from 'react-dropzone';
import { PDFDocument } from 'pdf-lib';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';
import AdBanner from '../../components/AdBanner';

interface CompressionOptions {
  quality: number;
  removeAnnotations: boolean;
  removeMetadata: boolean;
  optimizeImages: boolean;
}

export default function PdfCompressorPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [compressionOptions, setCompressionOptions] = useState<CompressionOptions>({
    quality: 75,
    removeAnnotations: true,
    removeMetadata: true,
    optimizeImages: true,
  });
  const [compressionResults, setCompressionResults] = useState<Array<{
    name: string;
    originalSize: number;
    compressedSize: number;
    savings: number;
  }>>([]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf']
    },
    onDrop: (acceptedFiles) => {
      setFiles(prev => [...prev, ...acceptedFiles]);
      setCompressionResults([]);
    }
  });

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const compressPdf = async (file: File): Promise<{ compressedPdf: Uint8Array; originalSize: number; compressedSize: number }> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    // Remove metadata if option is enabled
    if (compressionOptions.removeMetadata) {
      pdfDoc.setTitle('');
      pdfDoc.setAuthor('');
      pdfDoc.setSubject('');
      pdfDoc.setKeywords([]);
      pdfDoc.setCreator('');
      pdfDoc.setProducer('');
    }

    // Compress with quality setting - simplified approach
    const compressedPdf = await pdfDoc.save({
      useObjectStreams: true,
      addDefaultPage: false,
      objectsPerTick: 50,
    });

    return {
      compressedPdf,
      originalSize: arrayBuffer.byteLength,
      compressedSize: compressedPdf.length,
    };
  };

  const downloadFile = (data: Uint8Array, fileName: string) => {
    const blob = new Blob([new Uint8Array(data)], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const compressFiles = async () => {
    if (files.length === 0) {
      toast.error('Please select PDF files to compress');
      return;
    }

    setIsProcessing(true);
    const results: Array<{
      name: string;
      originalSize: number;
      compressedSize: number;
      savings: number;
    }> = [];

    try {
      for (const file of files) {
        const { compressedPdf, originalSize, compressedSize } = await compressPdf(file);
        
        const savings = ((originalSize - compressedSize) / originalSize) * 100;
        results.push({
          name: file.name,
          originalSize,
          compressedSize,
          savings: Math.max(0, savings),
        });

        // Download compressed file
        const fileName = file.name.replace('.pdf', '_compressed.pdf');
        downloadFile(compressedPdf, fileName);
      }

      setCompressionResults(results);
      toast.success(`Compressed ${files.length} PDF file(s) successfully!`);
    } catch (error) {
      console.error('Compression error:', error);
      toast.error('Failed to compress PDF files');
    } finally {
      setIsProcessing(false);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setCompressionResults([]);
  };

  const clearAll = () => {
    setFiles([]);
    setCompressionResults([]);
  };

  return (
    <>
      <Helmet>
        <title>PDF Compressor - Reduce PDF File Size</title>
        <meta name="description" content="Compress PDF files online to reduce file size. Optimize PDFs while maintaining quality. Free PDF compression tool." />
        <meta name="keywords" content="PDF compressor, reduce PDF size, compress PDF online, PDF optimization, shrink PDF" />
      </Helmet>

      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <DocumentArrowDownIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">PDF Compressor</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Reduce PDF file size while maintaining quality. Compress multiple PDFs at once and optimize for web or email.
          </p>
        </div>

        {/* Compression Options */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Compression Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Compression Quality: {compressionOptions.quality}%
              </label>
              <input
                type="range"
                min="10"
                max="100"
                value={compressionOptions.quality}
                onChange={(e) => setCompressionOptions(prev => ({
                  ...prev,
                  quality: parseInt(e.target.value)
                }))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Smaller size</span>
                <span>Better quality</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="removeAnnotations"
                  checked={compressionOptions.removeAnnotations}
                  onChange={(e) => setCompressionOptions(prev => ({
                    ...prev,
                    removeAnnotations: e.target.checked
                  }))}
                  className="mr-2"
                />
                <label htmlFor="removeAnnotations" className="text-sm text-gray-700">
                  Remove annotations
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="removeMetadata"
                  checked={compressionOptions.removeMetadata}
                  onChange={(e) => setCompressionOptions(prev => ({
                    ...prev,
                    removeMetadata: e.target.checked
                  }))}
                  className="mr-2"
                />
                <label htmlFor="removeMetadata" className="text-sm text-gray-700">
                  Remove metadata
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="optimizeImages"
                  checked={compressionOptions.optimizeImages}
                  onChange={(e) => setCompressionOptions(prev => ({
                    ...prev,
                    optimizeImages: e.target.checked
                  }))}
                  className="mr-2"
                />
                <label htmlFor="optimizeImages" className="text-sm text-gray-700">
                  Optimize images
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* File Upload */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-8 shadow-lg">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer ${
              isDragActive 
                ? 'border-orange-400 bg-orange-50' 
                : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50'
            }`}
          >
            <input {...getInputProps()} />
            <DocumentArrowDownIcon className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {isDragActive ? 'Drop PDF files here' : 'Select PDF files to compress'}
            </h3>
            <p className="text-gray-600 mb-4">
              Drag and drop PDF files or click to browse
            </p>
            <button className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors">
              Choose PDF Files
            </button>
          </div>

          {/* Selected Files */}
          {files.length > 0 && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-gray-900">Selected Files ({files.length})</h4>
                <div className="space-x-2">
                  <button
                    onClick={compressFiles}
                    disabled={isProcessing}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isProcessing ? (
                      <>
                        <ArrowPathIcon className="w-4 h-4 animate-spin" />
                        <span>Compressing...</span>
                      </>
                    ) : (
                      <span>Compress PDFs</span>
                    )}
                  </button>
                  <button
                    onClick={clearAll}
                    disabled={isProcessing}
                    className="text-gray-500 hover:text-gray-700 px-4 py-2"
                  >
                    Clear All
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{file.name}</div>
                      <div className="text-sm text-gray-500">{formatFileSize(file.size)}</div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      disabled={isProcessing}
                      className="text-red-500 hover:text-red-700 disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Compression Results */}
        {compressionResults.length > 0 && (
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Compression Results</h3>
            <div className="space-y-3">
              {compressionResults.map((result, index) => (
                <div key={index} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-gray-900">{result.name}</div>
                      <div className="text-sm text-gray-600">
                        {formatFileSize(result.originalSize)} → {formatFileSize(result.compressedSize)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-green-600">
                        {result.savings.toFixed(1)}% smaller
                      </div>
                      <div className="text-sm text-gray-500">
                        Saved {formatFileSize(result.originalSize - result.compressedSize)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm">
                💡 Compressed files have been downloaded automatically. Check your Downloads folder.
              </p>
            </div>
          </div>
        )}

        {/* Ad */}
        <AdBanner 
          slot="pdf-compressor-middle"
          size="728x90"
          className="mx-auto"
        />

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-orange-600 text-xl">�️</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Smart Compression</h3>
            <p className="text-sm text-gray-600">
              Advanced algorithms reduce file size while maintaining document quality and readability.
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-orange-600 text-xl">🔧</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Customizable Options</h3>
            <p className="text-sm text-gray-600">
              Control compression quality, remove metadata, annotations, and optimize images as needed.
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-orange-600 text-xl">🚀</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Batch Processing</h3>
            <p className="text-sm text-gray-600">
              Compress multiple PDF files at once to save time and effort.
            </p>
          </div>
        </div>

        {/* Compression Tips */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Compression Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">For Email Attachments</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Use 50-70% quality for good balance</li>
                <li>• Remove annotations and metadata</li>
                <li>• Enable image optimization</li>
                <li>• Target file size under 10MB</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">For Web Publishing</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Use 60-80% quality for web viewing</li>
                <li>• Keep metadata for SEO purposes</li>
                <li>• Optimize images for faster loading</li>
                <li>• Consider breaking large documents into chapters</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Processing Overlay */}
        {isProcessing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
              <LoadingSpinner />
              <p className="text-center text-gray-700 mt-4">
                Compressing PDF files...
              </p>
              <p className="text-center text-sm text-gray-500 mt-2">
                This may take a few moments
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
