import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { MusicalNoteIcon, VideoCameraIcon } from '@heroicons/react/24/outline';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';
import AdBanner from '../../components/AdBanner';

interface ConversionOptions {
  format: 'mp3' | 'wav' | 'aac' | 'ogg';
  quality: 'low' | 'medium' | 'high';
  bitrate: string;
}

interface ConversionResult {
  name: string;
  originalFormat: string;
  outputFormat: string;
  originalSize: number;
  convertedSize: number;
  duration: number;
}

export default function VideoToAudioPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversionOptions, setConversionOptions] = useState<ConversionOptions>({
    format: 'mp3',
    quality: 'medium',
    bitrate: '128',
  });
  const [conversionResults, setConversionResults] = useState<ConversionResult[]>([]);
  const [progress, setProgress] = useState(0);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'video/*': ['.mp4', '.avi', '.mov', '.mkv', '.wmv', '.flv', '.webm', '.m4v']
    },
    onDrop: (acceptedFiles) => {
      setFiles(prev => [...prev, ...acceptedFiles]);
      setConversionResults([]);
    }
  });

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };
      
      video.onerror = () => {
        resolve(0);
      };
      
      video.src = URL.createObjectURL(file);
    });
  };

  const extractAudio = async (file: File): Promise<Blob> => {
    // This is a simplified simulation of audio extraction
    // In a real implementation, you would use FFmpeg.wasm or server-side processing
    
    const duration = await getVideoDuration(file);
    
    // Create a mock audio file for demonstration
    const sampleRate = 44100;
    const channels = 2;
    const length = sampleRate * Math.min(duration, 10); // Limit to 10 seconds for demo
    const arrayBuffer = new ArrayBuffer(44 + length * channels * 2);
    
    // Create WAV header
    const view = new DataView(arrayBuffer);
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, arrayBuffer.byteLength - 8, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, channels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * channels * 2, true);
    view.setUint16(32, channels * 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, arrayBuffer.byteLength - 44, true);
    
    // Generate some mock audio data
    for (let i = 44; i < arrayBuffer.byteLength; i += 2) {
      const sample = Math.sin(2 * Math.PI * 440 * (i - 44) / (sampleRate * 2)) * 0.1;
      view.setInt16(i, sample * 32767, true);
    }
    
    return new Blob([arrayBuffer], { type: `audio/${conversionOptions.format}` });
  };

  const convertFiles = async () => {
    if (files.length === 0) {
      toast.error('Please select video files to convert');
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    const results: ConversionResult[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setProgress(((i + 1) / files.length) * 100);
        
        const duration = await getVideoDuration(file);
        const audioBlob = await extractAudio(file);
        
        // Download the converted audio file
        const fileName = file.name.replace(/\.[^/.]+$/, `.${conversionOptions.format}`);
        const url = URL.createObjectURL(audioBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        results.push({
          name: file.name,
          originalFormat: file.type,
          outputFormat: conversionOptions.format,
          originalSize: file.size,
          convertedSize: audioBlob.size,
          duration,
        });
      }

      setConversionResults(results);
      toast.success(`Converted ${files.length} video file(s) to audio successfully!`);
    } catch (error) {
      console.error('Conversion error:', error);
      toast.error('Failed to convert video files');
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setConversionResults([]);
  };

  const clearAll = () => {
    setFiles([]);
    setConversionResults([]);
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <Helmet>
        <title>Video to Audio Converter - Extract Audio from Video</title>
        <meta name="description" content="Extract audio from video files. Convert MP4, AVI, MOV to MP3, WAV, AAC. Free online video to audio converter." />
        <meta name="keywords" content="video to audio, extract audio, MP4 to MP3, video converter, audio extraction" />
      </Helmet>

      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <div className="flex items-center space-x-1">
              <VideoCameraIcon className="w-6 h-6 text-white" />
              <span className="text-white">→</span>
              <MusicalNoteIcon className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Video to Audio Converter</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Extract audio tracks from video files. Convert MP4, AVI, MOV to MP3, WAV, AAC, and more.
          </p>
        </div>

        {/* Conversion Options */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Audio Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Output Format</label>
              <select
                value={conversionOptions.format}
                onChange={(e) => setConversionOptions(prev => ({
                  ...prev,
                  format: e.target.value as 'mp3' | 'wav' | 'aac' | 'ogg'
                }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="mp3">MP3 (Most Compatible)</option>
                <option value="wav">WAV (Lossless)</option>
                <option value="aac">AAC (High Quality)</option>
                <option value="ogg">OGG (Open Source)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quality</label>
              <select
                value={conversionOptions.quality}
                onChange={(e) => setConversionOptions(prev => ({
                  ...prev,
                  quality: e.target.value as 'low' | 'medium' | 'high'
                }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="low">Low (Smaller file)</option>
                <option value="medium">Medium (Balanced)</option>
                <option value="high">High (Best quality)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bitrate (kbps)</label>
              <select
                value={conversionOptions.bitrate}
                onChange={(e) => setConversionOptions(prev => ({
                  ...prev,
                  bitrate: e.target.value
                }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="64">64 kbps (Voice)</option>
                <option value="128">128 kbps (Standard)</option>
                <option value="192">192 kbps (Good)</option>
                <option value="256">256 kbps (High)</option>
                <option value="320">320 kbps (Highest)</option>
              </select>
            </div>
          </div>
        </div>

        {/* File Upload */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-8 shadow-lg">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer ${
              isDragActive 
                ? 'border-purple-400 bg-purple-50' 
                : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50'
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex items-center justify-center mb-4">
              <VideoCameraIcon className="w-12 h-12 text-purple-500 mr-2" />
              <span className="text-2xl text-purple-500">→</span>
              <MusicalNoteIcon className="w-12 h-12 text-purple-500 ml-2" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {isDragActive ? 'Drop video files here' : 'Select video files to convert'}
            </h3>
            <p className="text-gray-600 mb-4">
              Drag and drop video files or click to browse
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Supported formats: MP4, AVI, MOV, MKV, WMV, FLV, WebM
            </p>
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors">
              Choose Video Files
            </button>
          </div>

          {/* Selected Files */}
          {files.length > 0 && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-gray-900">Selected Files ({files.length})</h4>
                <div className="space-x-2">
                  <button
                    onClick={convertFiles}
                    disabled={isProcessing}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? 'Converting...' : 'Convert to Audio'}
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
                    <div className="flex items-center space-x-3">
                      <VideoCameraIcon className="w-8 h-8 text-purple-500" />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{file.name}</div>
                        <div className="text-sm text-gray-500">
                          {formatFileSize(file.size)} • {file.type}
                        </div>
                      </div>
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

          {/* Progress Bar */}
          {isProcessing && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Converting...</span>
                <span className="text-sm text-gray-600">{progress.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Conversion Results */}
        {conversionResults.length > 0 && (
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Results</h3>
            <div className="space-y-3">
              {conversionResults.map((result, index) => (
                <div key={index} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <MusicalNoteIcon className="w-8 h-8 text-green-600" />
                      <div>
                        <div className="font-medium text-gray-900">
                          {result.name.replace(/\.[^/.]+$/, `.${result.outputFormat}`)}
                        </div>
                        <div className="text-sm text-gray-600">
                          Duration: {formatDuration(result.duration)} • Size: {formatFileSize(result.convertedSize)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-green-600 font-medium">
                        ✓ Converted to {result.outputFormat.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm">
                💡 Audio files have been downloaded automatically. Check your Downloads folder.
              </p>
            </div>
          </div>
        )}

        {/* Ad */}
        <AdBanner 
          slot="video-to-audio-middle"
          size="728x90"
          className="mx-auto"
        />

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-purple-600 text-xl">🎵</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">High Quality Audio</h3>
            <p className="text-sm text-gray-600">
              Extract crystal clear audio from your videos with customizable quality settings.
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-purple-600 text-xl">🔄</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Multiple Formats</h3>
            <p className="text-sm text-gray-600">
              Convert to MP3, WAV, AAC, or OGG formats with various bitrate options.
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-purple-600 text-xl">⚡</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Fast Processing</h3>
            <p className="text-sm text-gray-600">
              Quick conversion process with batch support for multiple files.
            </p>
          </div>
        </div>

        {/* Supported Formats */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Supported Formats</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Input Video Formats</h4>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span>MP4</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span>AVI</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span>MOV</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span>MKV</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span>WMV</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span>WebM</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Output Audio Formats</h4>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                  <span>MP3 (Universal)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                  <span>WAV (Lossless)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                  <span>AAC (High Quality)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                  <span>OGG (Open Source)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-purple-600 font-bold">1</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Upload</h4>
              <p className="text-xs text-gray-600">Select video files from your device</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-purple-600 font-bold">2</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Configure</h4>
              <p className="text-xs text-gray-600">Choose audio format and quality</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Extract</h4>
              <p className="text-xs text-gray-600">Process video and extract audio</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-purple-600 font-bold">4</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Download</h4>
              <p className="text-xs text-gray-600">Get your extracted audio files</p>
            </div>
          </div>
        </div>

        {/* Processing Overlay */}
        {isProcessing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
              <LoadingSpinner />
              <p className="text-center text-gray-700 mt-4">
                Converting video to audio...
              </p>
              <p className="text-center text-sm text-gray-500 mt-2">
                Progress: {progress.toFixed(0)}%
              </p>
            </div>
          </div>
        )}

        {/* Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 text-sm">
            <strong>Note:</strong> This demo version creates sample audio files for demonstration. 
            In a production environment, this would use FFmpeg.wasm or server-side processing for real audio extraction.
          </p>
        </div>
      </div>
    </>
  );
}
