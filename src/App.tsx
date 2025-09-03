import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
// PDF Tools
import PdfMergerPage from './pages/tools/PdfMergerPage';
import PdfSplitterPage from './pages/tools/PdfSplitterPage';
import PdfCompressorPage from './pages/tools/PdfCompressorPage';
import PdfToImagePage from './pages/tools/PdfToImagePage';
// Media Tools
import VideoToAudioPage from './pages/tools/VideoToAudioPage';
import AudioConverterPage from './pages/tools/AudioConverterPage';
import VideoConverterPage from './pages/tools/VideoConverterPage';
import VideoCompressorPage from './pages/tools/VideoCompressorPage';
// Calculator Tools
import BasicCalculatorPage from './pages/tools/BasicCalculatorPage';
import ScientificCalculatorPage from './pages/tools/ScientificCalculatorPage';
import UnitConverterPage from './pages/tools/UnitConverterPage';
import CurrencyConverterPage from './pages/tools/CurrencyConverterPage';
// Text Tools
import TextToolsPage from './pages/tools/TextToolsPage';
// Image Tools
import ImageConverterPage from './pages/tools/ImageConverterPage';
import ImageCompressorPage from './pages/tools/ImageCompressorPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                
                {/* PDF Tools */}
                <Route path="pdf-merger" element={<PdfMergerPage />} />
                <Route path="pdf-splitter" element={<PdfSplitterPage />} />
                <Route path="pdf-compressor" element={<PdfCompressorPage />} />
                <Route path="pdf-to-image" element={<PdfToImagePage />} />
                
                {/* Media Tools */}
                <Route path="video-to-audio" element={<VideoToAudioPage />} />
                <Route path="audio-converter" element={<AudioConverterPage />} />
                <Route path="video-converter" element={<VideoConverterPage />} />
                <Route path="video-compressor" element={<VideoCompressorPage />} />
                
                {/* Calculator Tools */}
                <Route path="calculator" element={<BasicCalculatorPage />} />
                <Route path="scientific-calculator" element={<ScientificCalculatorPage />} />
                <Route path="unit-converter" element={<UnitConverterPage />} />
                <Route path="currency-converter" element={<CurrencyConverterPage />} />
                
                {/* Text Tools */}
                <Route path="text-tools" element={<TextToolsPage />} />
                
                {/* Image Tools */}
                <Route path="image-converter" element={<ImageConverterPage />} />
                <Route path="image-compressor" element={<ImageCompressorPage />} />
                
                <Route path="about" element={<AboutPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="privacy" element={<PrivacyPage />} />
                <Route path="terms" element={<TermsPage />} />
              </Route>
            </Routes>
          </div>
          <Toaster position="top-right" />
        </Router>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
