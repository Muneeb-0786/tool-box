import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import AdBanner from './AdBanner';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Ad Banner */}
      <AdBanner 
        slot="header-banner"
        size="728x90"
        className="hidden md:block bg-white shadow-sm"
      />
      
      <Header />
      
      <main className="flex-1 relative">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-1">
              <Outlet />
            </div>
            
            {/* Sidebar with Ads */}
            <aside className="lg:w-80">
              <div className="sticky top-4 space-y-6">
                {/* Sidebar Ad */}
                <AdBanner 
                  slot="sidebar-1"
                  size="300x250"
                  className="bg-white rounded-lg shadow-sm"
                />
                
                {/* Quick Tools */}
                <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-4">Popular Tools</h3>
                  <div className="space-y-2">
                    <a href="/pdf-merger" className="block text-sm text-blue-600 hover:text-blue-800">
                      Merge PDF Files
                    </a>
                    <a href="/pdf-compressor" className="block text-sm text-blue-600 hover:text-blue-800">
                      Compress PDF
                    </a>
                    <a href="/calculator" className="block text-sm text-blue-600 hover:text-blue-800">
                      Calculator
                    </a>
                    <a href="/unit-converter" className="block text-sm text-blue-600 hover:text-blue-800">
                      Unit Converter
                    </a>
                    <a href="/image-converter" className="block text-sm text-blue-600 hover:text-blue-800">
                      Image Converter
                    </a>
                  </div>
                </div>
                
                {/* Another Sidebar Ad */}
                <AdBanner 
                  slot="sidebar-2"
                  size="300x250"
                  className="bg-white rounded-lg shadow-sm"
                />
              </div>
            </aside>
          </div>
        </div>
      </main>
      
      <Footer />
      
      {/* Bottom Ad Banner */}
      <AdBanner 
        slot="footer-banner"
        size="728x90"
        className="hidden md:block bg-white shadow-sm"
      />
    </div>
  );
}
