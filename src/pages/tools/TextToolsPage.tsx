import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import QRCode from 'qrcode';
import AdBanner from '../../components/AdBanner';

type TextTool = 'case' | 'counter' | 'generator' | 'formatter';

export default function TextToolsPage() {
  const [activeTool, setActiveTool] = useState<TextTool>('case');
  const [inputText, setInputText] = useState('');
  
  // Case converter state
  const [caseResult, setCaseResult] = useState('');
  
  // Text generator state
  const [passwordLength, setPasswordLength] = useState(12);
  const [passwordOptions, setPasswordOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: false,
  });
  const [loremWords, setLoremWords] = useState(50);
  const [qrText, setQrText] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');

  // Text counter results
  const textStats = {
    characters: inputText.length,
    charactersNoSpaces: inputText.replace(/\s/g, '').length,
    words: inputText.trim() ? inputText.trim().split(/\s+/).length : 0,
    sentences: inputText.trim() ? inputText.split(/[.!?]+/).filter(s => s.trim()).length : 0,
    paragraphs: inputText.trim() ? inputText.split(/\n\s*\n/).filter(p => p.trim()).length : 0,
    readingTime: Math.ceil((inputText.trim() ? inputText.trim().split(/\s+/).length : 0) / 200), // 200 words per minute
  };

  // Case conversion functions
  const convertCase = (text: string, type: string): string => {
    switch (type) {
      case 'upper':
        return text.toUpperCase();
      case 'lower':
        return text.toLowerCase();
      case 'title':
        return text.replace(/\w\S*/g, (txt) => 
          txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
      case 'sentence':
        return text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
      case 'camel':
        return text
          .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
            index === 0 ? word.toLowerCase() : word.toUpperCase()
          )
          .replace(/\s+/g, '');
      case 'snake':
        return text.toLowerCase().replace(/\s+/g, '_');
      case 'kebab':
        return text.toLowerCase().replace(/\s+/g, '-');
      case 'alternating':
        return text
          .split('')
          .map((char, index) =>
            index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
          )
          .join('');
      case 'reverse':
        return text.split('').reverse().join('');
      default:
        return text;
    }
  };

  const handleCaseConversion = (type: string) => {
    setCaseResult(convertCase(inputText, type));
  };

  // Password generator
  const generatePassword = () => {
    const chars = {
      uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lowercase: 'abcdefghijklmnopqrstuvwxyz',
      numbers: '0123456789',
      symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    };

    let charset = '';
    if (passwordOptions.uppercase) charset += chars.uppercase;
    if (passwordOptions.lowercase) charset += chars.lowercase;
    if (passwordOptions.numbers) charset += chars.numbers;
    if (passwordOptions.symbols) charset += chars.symbols;

    if (!charset) {
      toast.error('Please select at least one character type');
      return;
    }

    let password = '';
    for (let i = 0; i < passwordLength; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    setCaseResult(password);
  };

  // Lorem ipsum generator
  const loremWords_array = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
    'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
    'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
    'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
    'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
    'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
  ];

  const generateLorem = () => {
    const words = [];
    for (let i = 0; i < loremWords; i++) {
      words.push(loremWords_array[Math.floor(Math.random() * loremWords_array.length)]);
    }
    
    let text = words.join(' ');
    text = text.charAt(0).toUpperCase() + text.slice(1);
    setCaseResult(text + '.');
  };

  // QR Code generator
  const generateQR = async () => {
    if (!qrText.trim()) {
      toast.error('Please enter text to generate QR code');
      return;
    }

    try {
      const dataUrl = await QRCode.toDataURL(qrText, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrDataUrl(dataUrl);
    } catch {
      toast.error('Error generating QR code');
    }
  };

  // Text formatting functions
  const formatText = (type: string) => {
    switch (type) {
      case 'removeSpaces':
        setCaseResult(inputText.replace(/\s+/g, ''));
        break;
      case 'removeExtraSpaces':
        setCaseResult(inputText.replace(/\s+/g, ' ').trim());
        break;
      case 'addLineBreaks':
        setCaseResult(inputText.replace(/\. /g, '.\n'));
        break;
      case 'removeLineBreaks':
        setCaseResult(inputText.replace(/\n/g, ' '));
        break;
      case 'base64Encode':
        setCaseResult(btoa(inputText));
        break;
      case 'base64Decode':
        try {
          setCaseResult(atob(inputText));
        } catch {
          toast.error('Invalid Base64 string');
        }
        break;
      case 'urlEncode':
        setCaseResult(encodeURIComponent(inputText));
        break;
      case 'urlDecode':
        try {
          setCaseResult(decodeURIComponent(inputText));
        } catch {
          toast.error('Invalid URL encoded string');
        }
        break;
      default:
        break;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy to clipboard');
    });
  };

  const toolTabs = [
    { id: 'case', name: 'Case Converter', icon: '🔤' },
    { id: 'counter', name: 'Word Counter', icon: '🔢' },
    { id: 'generator', name: 'Generators', icon: '⚡' },
    { id: 'formatter', name: 'Text Formatter', icon: '🛠️' },
  ];

  return (
    <>
      <Helmet>
        <title>Text Tools - Case Converter, Word Counter, Password Generator & More</title>
        <meta name="description" content="Free online text tools including case converter, word counter, password generator, Lorem ipsum generator, and text formatter." />
        <meta name="keywords" content="text tools, case converter, word counter, password generator, lorem ipsum, text formatter" />
      </Helmet>

      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <DocumentTextIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Text Tools</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Powerful text processing tools for case conversion, word counting, text generation, and formatting.
          </p>
        </div>

        {/* Tool Tabs */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-2 shadow-lg">
          <div className="flex flex-wrap gap-2">
            {toolTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTool(tab.id as TextTool)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTool === tab.id
                    ? 'bg-green-500 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Area */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Input Text</h2>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter your text here..."
              className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            />

            {/* Text Statistics (always visible) */}
            {activeTool === 'counter' && (
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <div className="font-bold text-2xl text-green-600">{textStats.characters}</div>
                  <div className="text-gray-600">Characters</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <div className="font-bold text-2xl text-green-600">{textStats.charactersNoSpaces}</div>
                  <div className="text-gray-600">Chars (no spaces)</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <div className="font-bold text-2xl text-green-600">{textStats.words}</div>
                  <div className="text-gray-600">Words</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <div className="font-bold text-2xl text-green-600">{textStats.sentences}</div>
                  <div className="text-gray-600">Sentences</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <div className="font-bold text-2xl text-green-600">{textStats.paragraphs}</div>
                  <div className="text-gray-600">Paragraphs</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <div className="font-bold text-2xl text-green-600">{textStats.readingTime}</div>
                  <div className="text-gray-600">Min read</div>
                </div>
              </div>
            )}
          </div>

          {/* Tools and Output */}
          <div className="space-y-6">
            {/* Case Converter */}
            {activeTool === 'case' && (
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Case Converter</h2>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <button
                    onClick={() => handleCaseConversion('upper')}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                  >
                    UPPERCASE
                  </button>
                  <button
                    onClick={() => handleCaseConversion('lower')}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                  >
                    lowercase
                  </button>
                  <button
                    onClick={() => handleCaseConversion('title')}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                  >
                    Title Case
                  </button>
                  <button
                    onClick={() => handleCaseConversion('sentence')}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                  >
                    Sentence case
                  </button>
                  <button
                    onClick={() => handleCaseConversion('camel')}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                  >
                    camelCase
                  </button>
                  <button
                    onClick={() => handleCaseConversion('snake')}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                  >
                    snake_case
                  </button>
                  <button
                    onClick={() => handleCaseConversion('kebab')}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                  >
                    kebab-case
                  </button>
                  <button
                    onClick={() => handleCaseConversion('alternating')}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                  >
                    aLtErNaTiNg
                  </button>
                  <button
                    onClick={() => handleCaseConversion('reverse')}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm col-span-2"
                  >
                    Reverse Text
                  </button>
                </div>
              </div>
            )}

            {/* Generators */}
            {activeTool === 'generator' && (
              <div className="space-y-6">
                {/* Password Generator */}
                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Password Generator</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Length: {passwordLength}
                      </label>
                      <input
                        type="range"
                        min="4"
                        max="64"
                        value={passwordLength}
                        onChange={(e) => setPasswordLength(parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(passwordOptions).map(([key, value]) => (
                        <label key={key} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => setPasswordOptions({
                              ...passwordOptions,
                              [key]: e.target.checked
                            })}
                            className="rounded"
                          />
                          <span className="text-sm capitalize">{key}</span>
                        </label>
                      ))}
                    </div>
                    <button
                      onClick={generatePassword}
                      className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Generate Password
                    </button>
                  </div>
                </div>

                {/* Lorem Ipsum Generator */}
                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Lorem Ipsum Generator</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of words: {loremWords}
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="200"
                        value={loremWords}
                        onChange={(e) => setLoremWords(parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <button
                      onClick={generateLorem}
                      className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Generate Lorem Ipsum
                    </button>
                  </div>
                </div>

                {/* QR Code Generator */}
                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">QR Code Generator</h2>
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={qrText}
                      onChange={(e) => setQrText(e.target.value)}
                      placeholder="Enter text or URL"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <button
                      onClick={generateQR}
                      className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Generate QR Code
                    </button>
                    {qrDataUrl && (
                      <div className="text-center">
                        <img src={qrDataUrl} alt="QR Code" className="mx-auto" />
                        <a
                          href={qrDataUrl}
                          download="qrcode.png"
                          className="inline-block mt-2 text-sm text-green-600 hover:text-green-800"
                        >
                          Download QR Code
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Text Formatter */}
            {activeTool === 'formatter' && (
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Text Formatter</h2>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={() => formatText('removeSpaces')}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                  >
                    Remove All Spaces
                  </button>
                  <button
                    onClick={() => formatText('removeExtraSpaces')}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                  >
                    Remove Extra Spaces
                  </button>
                  <button
                    onClick={() => formatText('addLineBreaks')}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                  >
                    Add Line Breaks (Sentences)
                  </button>
                  <button
                    onClick={() => formatText('removeLineBreaks')}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                  >
                    Remove Line Breaks
                  </button>
                  <button
                    onClick={() => formatText('base64Encode')}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                  >
                    Base64 Encode
                  </button>
                  <button
                    onClick={() => formatText('base64Decode')}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                  >
                    Base64 Decode
                  </button>
                  <button
                    onClick={() => formatText('urlEncode')}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                  >
                    URL Encode
                  </button>
                  <button
                    onClick={() => formatText('urlDecode')}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                  >
                    URL Decode
                  </button>
                </div>
              </div>
            )}

            {/* Output Area */}
            {caseResult && (
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Result</h2>
                  <button
                    onClick={() => copyToClipboard(caseResult)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                  >
                    Copy
                  </button>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                    {caseResult}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Ad */}
        <AdBanner 
          slot="text-tools-bottom"
          size="728x90"
          className="mx-auto"
        />

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-green-600 text-xl">🔤</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Case Conversion</h3>
            <p className="text-sm text-gray-600">
              Convert text between different case formats including camelCase, snake_case, and more.
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-green-600 text-xl">🔢</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Word Counter</h3>
            <p className="text-sm text-gray-600">
              Get detailed statistics about your text including word count, reading time, and more.
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-green-600 text-xl">⚡</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Text Generators</h3>
            <p className="text-sm text-gray-600">
              Generate passwords, Lorem ipsum text, and QR codes with customizable options.
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-green-600 text-xl">🛠️</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Text Formatting</h3>
            <p className="text-sm text-gray-600">
              Format and encode text with Base64, URL encoding, and various formatting options.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
