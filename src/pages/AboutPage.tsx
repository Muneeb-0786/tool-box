import { Helmet } from 'react-helmet-async';

export default function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About ToolBox Pro - Professional Online Tools</title>
        <meta name="description" content="Learn about ToolBox Pro, your one-stop solution for PDF tools, calculators, converters, and more. Free, secure, and fast online tools." />
      </Helmet>

      <div className="space-y-12">
        {/* Hero Section */}
        <div className="text-center py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">About ToolBox Pro</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your trusted partner for professional online tools. We provide fast, secure, and free digital solutions 
            for PDF processing, calculations, conversions, and more.
          </p>
        </div>

        {/* Mission */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-4">
            At ToolBox Pro, we believe that powerful digital tools should be accessible to everyone. Our mission is to provide 
            professional-grade online tools that are completely free, secure, and easy to use.
          </p>
          <p className="text-gray-600">
            We process everything client-side in your browser, ensuring your files never leave your computer and your privacy 
            is always protected.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">100% Secure</h3>
            <p className="text-gray-600">
              All processing happens in your browser. Your files never get uploaded to our servers.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Lightning Fast</h3>
            <p className="text-gray-600">
              Optimized algorithms ensure your files are processed quickly and efficiently.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💎</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Always Free</h3>
            <p className="text-gray-600">
              All our tools are completely free to use with no hidden fees or premium subscriptions.
            </p>
          </div>
        </div>

        {/* Tools Overview */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">PDF Tools</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Merge multiple PDF files</li>
                <li>• Split PDF into separate pages</li>
                <li>• Compress PDF file size</li>
                <li>• Convert PDF to images</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Calculators & Converters</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Basic and scientific calculators</li>
                <li>• Unit converter for all measurements</li>
                <li>• Currency converter with live rates</li>
                <li>• Text processing tools</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-8">Trusted Worldwide</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-3xl font-bold mb-2">2M+</div>
              <div className="text-blue-100">Files Processed</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">150+</div>
              <div className="text-blue-100">Countries</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">15+</div>
              <div className="text-blue-100">Tools Available</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">99.9%</div>
              <div className="text-blue-100">Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
