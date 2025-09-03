import { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import {
  PhotoIcon,
  CloudArrowUpIcon,
  TrashIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';
import AdBanner from '../../components/AdBanner';
import LoadingSpinner from '../../components/LoadingSpinner';

interface ImageFile {
  id: string;
  file: File;
  name: string;
  size: string;
  preview: string;
  originalFormat: string;
}

const supportedFormats = [
  { value: 'jpeg', label: 'JPEG', description: 'Best for photos' },
  { value: 'png', label: 'PNG', description: 'Best for graphics with transparency' },
  { value: 'webp', label: 'WebP', description: 'Modern format, smaller size' },
  { value: 'bmp', label: 'BMP', description: 'Uncompressed bitmap' },
];

export default function ImageConverterPage() {
  const [files, setFiles] = useState<ImageFile[]>([]);
  const [outputFormat, setOutputFormat] = useState('jpeg');
  const [quality, setQuality] = useState(0.9);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getImageFormat = (file: File): string => {
    const type = file.type.split('/')[1];
    return type || 'unknown';
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newFiles: ImageFile[] = [];
    
    for (const file of acceptedFiles) {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        continue;
      }

      const preview = URL.createObjectURL(file);
      
      newFiles.push({
        id: Math.random().toString(36).substr(2, 9),
        file,
        name: file.name,
        size: formatFileSize(file.size),
        preview,
        originalFormat: getImageFormat(file),
      });
    }

    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'],
    },
    multiple: true,
  });

  const removeFile = (id: string) => {
    const fileToRemove = files.find(f => f.id === id);
    if (fileToRemove) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    setFiles(files => files.filter(file => file.id !== id));
  };

  const convertImage = (file: File, format: string, quality: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current || document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        
        // Fill with white background for JPEG (no transparency)
        if (format === 'jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to convert image'));
            }
          },
          `image/${format}`,
          quality
        );
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  };

  const convertImages = async () => {
    if (files.length === 0) {
      toast.error('Please select at least one image file');
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      const convertedFiles: { name: string; blob: Blob }[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const newName = file.name.replace(/\.[^/.]+$/, '') + '.' + outputFormat;
        
        try {
          const blob = await convertImage(file.file, outputFormat, quality);
          convertedFiles.push({ name: newName, blob });
        } catch {
          toast.error(`Failed to convert ${file.name}`);
        }
        
        setProgress(((i + 1) / files.length) * 100);
      }

      if (convertedFiles.length === 0) {
        toast.error('No images were converted successfully');
        return;
      }

      // Download files
      if (convertedFiles.length === 1) {
        // Single file download
        saveAs(convertedFiles[0].blob, convertedFiles[0].name);
      } else {
        // Multiple files - create ZIP
        const zip = new JSZip();
        convertedFiles.forEach(({ name, blob }) => {
          zip.file(name, blob);
        });
        
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        saveAs(zipBlob, `converted-images-${outputFormat}.zip`);
      }
      
      toast.success(`${convertedFiles.length} image(s) converted successfully!`);
    } catch (error) {
      console.error('Error converting images:', error);
      toast.error('Error converting images. Please try again.');
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const clearFiles = () => {
    files.forEach(file => URL.revokeObjectURL(file.preview));
    setFiles([]);
  };

  return (
    <>
      <Helmet>
        <title>Image Converter - Convert Image Formats Online</title>
        <meta name="description" content="Convert images between different formats: JPG, PNG, WebP, BMP. Free online image converter with batch processing." />
        <meta name="keywords" content="image converter, convert JPG to PNG, convert PNG to JPG, WebP converter, image format" />
      </Helmet>

      <div className="space-y-8">
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <PhotoIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Image Converter</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Convert images between different formats. Support for JPG, PNG, WebP, BMP with quality control and batch processing.
          </p>
        </div>

        {/* Upload Area */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-8 shadow-lg">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
              isDragActive
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-300 hover:border-orange-400 hover:bg-gray-50'
            }`}
          >
            <input {...getInputProps()} />
            <CloudArrowUpIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            {isDragActive ? (
              <p className="text-lg text-orange-600">Drop image files here...</p>
            ) : (
              <>
                <p className="text-lg text-gray-600 mb-2">
                  Drag & drop image files here, or click to select
                </p>
                <p className="text-sm text-gray-500">
                  Supports JPG, PNG, GIF, BMP, WebP, SVG formats
                </p>
              </>
            )}
          </div>
        </div>

        {/* Conversion Settings */}
        {files.length > 0 && (
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Conversion Settings
              </h2>
              <button
                onClick={clearFiles}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Clear All Files
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Output Format */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Output Format
                </label>
                <select
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {supportedFormats.map((format) => (
                    <option key={format.value} value={format.value}>
                      {format.label} - {format.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quality (for JPEG and WebP) */}
              {(outputFormat === 'jpeg' || outputFormat === 'webp') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quality: {Math.round(quality * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={quality}
                    onChange={(e) => setQuality(parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Lower size</span>
                    <span>Higher quality</span>
                  </div>
                </div>
              )}
            </div>

            {/* File List */}
            <div className="space-y-3 mb-6">
              <h3 className="font-medium text-gray-900">Selected Images ({files.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {files.map((file) => (
                  <div key={file.id} className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="aspect-square mb-3 overflow-hidden rounded-lg bg-gray-100">
                      <img
                        src={file.preview}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {file.size} • {file.originalFormat.toUpperCase()}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-green-600">
                          → {outputFormat.toUpperCase()}
                        </span>
                        <button
                          onClick={() => removeFile(file.id)}
                          className="p-1 text-red-400 hover:text-red-600"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Convert Button */}
            <div className="text-center">
              <button
                onClick={convertImages}
                disabled={isProcessing}
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <div className="flex items-center space-x-2">
                    <LoadingSpinner size="sm" />
                    <span>Converting... {Math.round(progress)}%</span>
                  </div>
                ) : (
                  <>
                    <ArrowDownTrayIcon className="w-5 h-5 inline mr-2" />
                    Convert {files.length} Image{files.length !== 1 ? 's' : ''} to {outputFormat.toUpperCase()}
                  </>
                )}
              </button>
              
              {files.length > 1 && (
                <p className="text-sm text-gray-500 mt-2">
                  Multiple files will be downloaded as a ZIP archive
                </p>
              )}
            </div>
          </div>
        )}

        {/* Ad */}
        <AdBanner 
          slot="image-converter-bottom"
          size="728x90"
          className="mx-auto"
        />

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <PhotoIcon className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Multiple Formats</h3>
            <p className="text-sm text-gray-600">
              Convert between JPG, PNG, WebP, BMP and other popular image formats.
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-orange-600 font-bold">⚙️</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Quality Control</h3>
            <p className="text-sm text-gray-600">
              Adjust compression quality for JPEG and WebP formats to balance size and quality.
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-orange-600 font-bold">📦</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Batch Processing</h3>
            <p className="text-sm text-gray-600">
              Convert multiple images at once. Bulk downloads are provided as ZIP files.
            </p>
          </div>
        </div>

        {/* Format Comparison */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Image Format Guide</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">JPEG (.jpg)</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Best for photographs</li>
                <li>• Smaller file sizes</li>
                <li>• No transparency support</li>
                <li>• Lossy compression</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">PNG (.png)</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Best for graphics and logos</li>
                <li>• Supports transparency</li>
                <li>• Larger file sizes</li>
                <li>• Lossless compression</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">WebP (.webp)</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Modern format</li>
                <li>• Smaller than JPEG and PNG</li>
                <li>• Supports transparency</li>
                <li>• Great browser support</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">BMP (.bmp)</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Uncompressed format</li>
                <li>• Very large file sizes</li>
                <li>• Maximum quality</li>
                <li>• Windows compatible</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
