import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import {
  DocumentIcon,
  VideoCameraIcon,
  CalculatorIcon,
  DocumentTextIcon,
  PhotoIcon,
} from '@heroicons/react/24/solid';

const toolCategories = [
  {
    name: 'PDF Tools',
    icon: DocumentIcon,
    color: 'text-red-600',
    tools: [
      { name: 'Merge PDF', path: '/pdf-merger', description: 'Combine multiple PDFs' },
      { name: 'Split PDF', path: '/pdf-splitter', description: 'Extract pages from PDF' },
      { name: 'Compress PDF', path: '/pdf-compressor', description: 'Reduce PDF file size' },
      { name: 'PDF to Image', path: '/pdf-to-image', description: 'Convert PDF to JPG/PNG' },
    ]
  },
  {
    name: 'Media Tools',
    icon: VideoCameraIcon,
    color: 'text-purple-600',
    tools: [
      { name: 'Video to Audio', path: '/video-to-audio', description: 'Extract audio from video' },
      { name: 'Audio Converter', path: '/audio-converter', description: 'Convert audio formats' },
      { name: 'Video Converter', path: '/video-converter', description: 'Convert video formats' },
      { name: 'Video Compressor', path: '/video-compressor', description: 'Reduce video size' },
    ]
  },
  {
    name: 'Calculators',
    icon: CalculatorIcon,
    color: 'text-blue-600',
    tools: [
      { name: 'Basic Calculator', path: '/calculator', description: 'Simple arithmetic' },
      { name: 'Scientific Calculator', path: '/scientific-calculator', description: 'Advanced math functions' },
      { name: 'Unit Converter', path: '/unit-converter', description: 'Convert measurements' },
      { name: 'Currency Converter', path: '/currency-converter', description: 'Exchange rates' },
    ]
  },
  {
    name: 'Text Tools',
    icon: DocumentTextIcon,
    color: 'text-green-600',
    tools: [
      { name: 'Text Tools', path: '/text-tools', description: 'Case conversion, word count, etc.' },
    ]
  },
  {
    name: 'Image Tools',
    icon: PhotoIcon,
    color: 'text-orange-600',
    tools: [
      { name: 'Image Converter', path: '/image-converter', description: 'Convert image formats' },
      { name: 'Image Compressor', path: '/image-compressor', description: 'Reduce image size' },
    ]
  },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ToolBox Pro
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {toolCategories.map((category) => (
              <div
                key={category.name}
                className="relative group"
                onMouseEnter={() => setActiveDropdown(category.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center space-x-1 px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">
                  <category.icon className={`w-5 h-5 ${category.color}`} />
                  <span>{category.name}</span>
                </button>
                
                {/* Dropdown Menu */}
                {activeDropdown === category.name && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                    <div className="p-2">
                      {category.tools.map((tool) => (
                        <Link
                          key={tool.path}
                          to={tool.path}
                          className="block px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors"
                        >
                          <div className="font-medium">{tool.name}</div>
                          <div className="text-xs text-gray-500">{tool.description}</div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            <Link
              to="/about"
              className="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-gray-700 hover:text-blue-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-16 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
            <div className="container mx-auto px-4 py-4">
              {toolCategories.map((category) => (
                <div key={category.name} className="mb-4">
                  <div className="flex items-center space-x-2 font-medium text-gray-900 mb-2">
                    <category.icon className={`w-5 h-5 ${category.color}`} />
                    <span>{category.name}</span>
                  </div>
                  <div className="ml-7 space-y-1">
                    {category.tools.map((tool) => (
                      <Link
                        key={tool.path}
                        to={tool.path}
                        className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {tool.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                <Link
                  to="/about"
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
