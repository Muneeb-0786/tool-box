import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="text-xl font-bold">ToolBox Pro</span>
            </div>
            <p className="text-gray-400 text-sm">
              Your one-stop solution for all digital tools. Convert, compress, calculate, and process files with ease.
            </p>
          </div>

          {/* PDF Tools */}
          <div>
            <h3 className="font-semibold mb-4">PDF Tools</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/pdf-merger" className="text-gray-400 hover:text-white transition-colors">Merge PDF</Link></li>
              <li><Link to="/pdf-splitter" className="text-gray-400 hover:text-white transition-colors">Split PDF</Link></li>
              <li><Link to="/pdf-compressor" className="text-gray-400 hover:text-white transition-colors">Compress PDF</Link></li>
              <li><Link to="/pdf-to-image" className="text-gray-400 hover:text-white transition-colors">PDF to Image</Link></li>
            </ul>
          </div>

          {/* Other Tools */}
          <div>
            <h3 className="font-semibold mb-4">Other Tools</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/calculator" className="text-gray-400 hover:text-white transition-colors">Calculator</Link></li>
              <li><Link to="/unit-converter" className="text-gray-400 hover:text-white transition-colors">Unit Converter</Link></li>
              <li><Link to="/text-tools" className="text-gray-400 hover:text-white transition-colors">Text Tools</Link></li>
              <li><Link to="/image-converter" className="text-gray-400 hover:text-white transition-colors">Image Converter</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} ToolBox Pro. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm mt-2 md:mt-0">
            Made with ❤️ for productivity
          </p>
        </div>
      </div>
    </footer>
  );
}
