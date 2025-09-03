import { Helmet } from 'react-helmet-async';
import { VideoCameraIcon } from '@heroicons/react/24/outline';

export default function AudioConverterPage() {
  return (
    <>
      <Helmet><title>Audio Converter - Convert Audio Formats Online</title></Helmet>
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <VideoCameraIcon className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Audio Converter</h1>
        <p className="text-xl text-gray-600 mb-8">Convert between audio formats</p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
          <p className="text-yellow-800">🚧 Coming soon!</p>
        </div>
      </div>
    </>
  );
}
