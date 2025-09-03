import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  DocumentIcon,
  VideoCameraIcon,
  CalculatorIcon,
  DocumentTextIcon,
  PhotoIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import AdBanner from '../components/AdBanner';

const toolCategories = [
  {
    name: 'PDF Tools',
    icon: DocumentIcon,
    color: 'from-red-500 to-red-600',
    textColor: 'text-red-600',
    description: 'Merge, split, compress and convert PDF files',
    tools: [
      { name: 'Merge PDF', path: '/pdf-merger', description: 'Combine multiple PDFs into one' },
      { name: 'Split PDF', path: '/pdf-splitter', description: 'Extract specific pages' },
      { name: 'Compress PDF', path: '/pdf-compressor', description: 'Reduce file size' },
      { name: 'PDF to Image', path: '/pdf-to-image', description: 'Convert to JPG/PNG' },
    ]
  },
  {
    name: 'Media Tools',
    icon: VideoCameraIcon,
    color: 'from-purple-500 to-purple-600',
    textColor: 'text-purple-600',
    description: 'Convert and compress audio/video files',
    tools: [
      { name: 'Video to Audio', path: '/video-to-audio', description: 'Extract audio from videos' },
      { name: 'Audio Converter', path: '/audio-converter', description: 'Convert audio formats' },
      { name: 'Video Converter', path: '/video-converter', description: 'Convert video formats' },
      { name: 'Video Compressor', path: '/video-compressor', description: 'Reduce video size' },
    ]
  },
  {
    name: 'Calculators',
    icon: CalculatorIcon,
    color: 'from-blue-500 to-blue-600',
    textColor: 'text-blue-600',
    description: 'Mathematical and conversion calculators',
    tools: [
      { name: 'Basic Calculator', path: '/calculator', description: 'Simple arithmetic operations' },
      { name: 'Scientific Calculator', path: '/scientific-calculator', description: 'Advanced math functions' },
      { name: 'Unit Converter', path: '/unit-converter', description: 'Convert measurements' },
      { name: 'Currency Converter', path: '/currency-converter', description: 'Real-time exchange rates' },
    ]
  },
  {
    name: 'Text Tools',
    icon: DocumentTextIcon,
    color: 'from-green-500 to-green-600',
    textColor: 'text-green-600',
    description: 'Text processing and formatting tools',
    tools: [
      { name: 'Text Tools', path: '/text-tools', description: 'Case conversion, word count, generators' },
    ]
  },
  {
    name: 'Image Tools',
    icon: PhotoIcon,
    color: 'from-orange-500 to-orange-600',
    textColor: 'text-orange-600',
    description: 'Image conversion and optimization',
    tools: [
      { name: 'Image Converter', path: '/image-converter', description: 'Convert image formats' },
      { name: 'Image Compressor', path: '/image-compressor', description: 'Optimize image size' },
    ]
  },
];

const features = [
  {
    title: 'Free & Secure',
    description: 'All processing happens in your browser. No files uploaded to servers.',
    icon: '🔒'
  },
  {
    title: 'Fast Processing',
    description: 'Lightning-fast tools with real-time progress indicators.',
    icon: '⚡'
  },
  {
    title: 'All Formats',
    description: 'Support for PDF, images, audio, video and document formats.',
    icon: '📁'
  },
  {
    title: 'Mobile Friendly',
    description: 'Works perfectly on desktop, tablet and mobile devices.',
    icon: '📱'
  }
];

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>ToolBox Pro - Free Online Tools for PDF, Media, Calculator & More</title>
        <meta name="description" content="Free online tools for PDF conversion, media processing, calculators, text tools and image optimization. Secure client-side processing with no file uploads." />
        <meta name="keywords" content="PDF tools, merge PDF, compress PDF, calculator, unit converter, image converter, video converter, online tools" />
      </Helmet>

      <div className="space-y-12">
        {/* Hero Section */}
        <section className="text-center py-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            All Your Digital Tools
            <br />
            <span className="text-3xl md:text-5xl">In One Place</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Professional online tools for PDF processing, media conversion, calculations, and more. 
            Free, fast, and secure with client-side processing.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/pdf-merger"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105"
            >
              Try PDF Merger
            </Link>
            <Link
              to="/calculator"
              className="bg-white text-gray-700 border border-gray-300 px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105"
            >
              Use Calculator
            </Link>
          </div>
        </section>

        {/* In-Content Ad */}
        <AdBanner 
          slot="in-content-1"
          size="728x90"
          className="mx-auto"
        />

        {/* Features */}
        <section className="py-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose ToolBox Pro?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tool Categories */}
        <section className="py-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Browse Tools by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {toolCategories.map((category) => (
              <div key={category.name} className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-lg flex items-center justify-center`}>
                    <category.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  {category.tools.slice(0, 3).map((tool) => (
                    <Link
                      key={tool.path}
                      to={tool.path}
                      className="block text-sm text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      • {tool.name}
                    </Link>
                  ))}
                  {category.tools.length > 3 && (
                    <p className="text-sm text-gray-500">+{category.tools.length - 3} more tools</p>
                  )}
                </div>
                
                <Link
                  to={category.tools[0].path}
                  className={`inline-flex items-center text-sm ${category.textColor} hover:underline font-medium`}
                >
                  Explore {category.name}
                  <ArrowRightIcon className="w-4 h-4 ml-1" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* In-Content Ad */}
        <AdBanner 
          slot="in-content-2"
          size="728x90"
          className="mx-auto"
        />

        {/* Stats Section */}
        <section className="py-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white text-center">
          <h2 className="text-3xl font-bold mb-8">Trusted by Millions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold mb-2">2M+</div>
              <div className="text-blue-100">Files Processed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">15+</div>
              <div className="text-blue-100">Professional Tools</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-blue-100">Secure & Private</div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8">Choose your tool and start processing files instantly</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/pdf-merger"
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Merge PDFs
            </Link>
            <Link
              to="/calculator"
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Calculator
            </Link>
            <Link
              to="/unit-converter"
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Unit Converter
            </Link>
            <Link
              to="/image-converter"
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Convert Images
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
