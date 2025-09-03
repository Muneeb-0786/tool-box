import { Helmet } from 'react-helmet-async';
import { DocumentIcon } from '@heroicons/react/24/outline';

export default function PdfToImagePage() {
  return (
    <>
      <Helmet>
        <title>Convert PDF to Image - PDF to JPG/PNG Converter</title>
        <meta name="description" content="Convert PDF pages to JPG or PNG images. Free online PDF to image converter." />
      </Helmet>
      
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <DocumentIcon className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">PDF to Image</h1>
        <p className="text-xl text-gray-600 mb-8">Convert PDF pages to JPG or PNG images</p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
          <p className="text-yellow-800">🚧 This tool is coming soon! Please check back later.</p>
        </div>
      </div>
    </>
  );
}
