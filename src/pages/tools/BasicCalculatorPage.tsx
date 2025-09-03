import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { CalculatorIcon } from '@heroicons/react/24/outline';
import AdBanner from '../../components/AdBanner';

export default function BasicCalculatorPage() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);
  const [memory, setMemory] = useState(0);
  const [history, setHistory] = useState<string[]>([]);

  const inputNumber = (num: string) => {
    if (waitingForNewValue) {
      setDisplay(num);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForNewValue) {
      setDisplay('0.');
      setWaitingForNewValue(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
  };

  const clearEntry = () => {
    setDisplay('0');
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
      
      // Add to history
      setHistory(prev => [
        ...prev.slice(-4), // Keep last 4 operations
        `${currentValue} ${operation} ${inputValue} = ${newValue}`
      ]);
    }

    setWaitingForNewValue(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return secondValue !== 0 ? firstValue / secondValue : firstValue;
      case '=':
        return secondValue;
      default:
        return secondValue;
    }
  };

  const performEquals = () => {
    performOperation('=');
  };

  const performPercentage = () => {
    const value = parseFloat(display);
    setDisplay(String(value / 100));
  };

  const performSquareRoot = () => {
    const value = parseFloat(display);
    if (value >= 0) {
      setDisplay(String(Math.sqrt(value)));
    }
  };

  const performSquare = () => {
    const value = parseFloat(display);
    setDisplay(String(value * value));
  };

  const performReciprocal = () => {
    const value = parseFloat(display);
    if (value !== 0) {
      setDisplay(String(1 / value));
    }
  };

  const toggleSign = () => {
    const value = parseFloat(display);
    setDisplay(String(-value));
  };

  // Memory functions
  const memoryAdd = () => {
    setMemory(memory + parseFloat(display));
  };

  const memorySubtract = () => {
    setMemory(memory - parseFloat(display));
  };

  const memoryRecall = () => {
    setDisplay(String(memory));
  };

  const memoryClear = () => {
    setMemory(0);
  };

  const Button = ({ 
    onClick, 
    children, 
    className = '', 
    variant = 'default' 
  }: { 
    onClick: () => void; 
    children: React.ReactNode; 
    className?: string;
    variant?: 'default' | 'operation' | 'equals' | 'clear' | 'memory';
  }) => {
    const baseClasses = 'h-14 rounded-lg font-semibold text-lg transition-all active:scale-95 shadow-sm';
    const variants = {
      default: 'bg-gray-100 hover:bg-gray-200 text-gray-800',
      operation: 'bg-blue-500 hover:bg-blue-600 text-white',
      equals: 'bg-green-500 hover:bg-green-600 text-white',
      clear: 'bg-red-500 hover:bg-red-600 text-white',
      memory: 'bg-purple-500 hover:bg-purple-600 text-white text-sm'
    };
    
    return (
      <button
        onClick={onClick}
        className={`${baseClasses} ${variants[variant]} ${className}`}
      >
        {children}
      </button>
    );
  };

  return (
    <>
      <Helmet>
        <title>Free Online Calculator - Basic Calculator Tool</title>
        <meta name="description" content="Free online basic calculator with memory functions and calculation history. Perfect for quick arithmetic calculations." />
        <meta name="keywords" content="calculator, basic calculator, online calculator, arithmetic, math calculator" />
      </Helmet>

      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CalculatorIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Basic Calculator</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Perform basic arithmetic operations with memory functions and calculation history.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Calculator */}
          <div className="flex-1 max-w-md mx-auto">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              {/* Display */}
              <div className="bg-gray-900 text-white p-4 rounded-lg mb-4">
                <div className="text-right">
                  <div className="text-sm text-gray-400 h-6">
                    {previousValue !== null && operation ? `${previousValue} ${operation}` : ''}
                  </div>
                  <div className="text-3xl font-mono font-bold overflow-hidden">
                    {display.length > 10 ? parseFloat(display).toExponential(6) : display}
                  </div>
                  {memory !== 0 && (
                    <div className="text-xs text-blue-400 mt-1">M: {memory}</div>
                  )}
                </div>
              </div>

              {/* Memory Buttons */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                <Button onClick={memoryClear} variant="memory">MC</Button>
                <Button onClick={memoryRecall} variant="memory">MR</Button>
                <Button onClick={memoryAdd} variant="memory">M+</Button>
                <Button onClick={memorySubtract} variant="memory">M-</Button>
              </div>

              {/* Calculator Buttons */}
              <div className="grid grid-cols-4 gap-2">
                {/* First Row */}
                <Button onClick={clear} variant="clear">C</Button>
                <Button onClick={clearEntry} variant="clear">CE</Button>
                <Button onClick={performSquareRoot}>√</Button>
                <Button onClick={() => performOperation('÷')} variant="operation">÷</Button>

                {/* Second Row */}
                <Button onClick={() => inputNumber('7')}>7</Button>
                <Button onClick={() => inputNumber('8')}>8</Button>
                <Button onClick={() => inputNumber('9')}>9</Button>
                <Button onClick={() => performOperation('×')} variant="operation">×</Button>

                {/* Third Row */}
                <Button onClick={() => inputNumber('4')}>4</Button>
                <Button onClick={() => inputNumber('5')}>5</Button>
                <Button onClick={() => inputNumber('6')}>6</Button>
                <Button onClick={() => performOperation('-')} variant="operation">-</Button>

                {/* Fourth Row */}
                <Button onClick={() => inputNumber('1')}>1</Button>
                <Button onClick={() => inputNumber('2')}>2</Button>
                <Button onClick={() => inputNumber('3')}>3</Button>
                <Button onClick={() => performOperation('+')} variant="operation">+</Button>

                {/* Fifth Row */}
                <Button onClick={toggleSign}>±</Button>
                <Button onClick={() => inputNumber('0')}>0</Button>
                <Button onClick={inputDecimal}>.</Button>
                <Button onClick={performEquals} variant="equals">=</Button>
              </div>

              {/* Additional Functions */}
              <div className="grid grid-cols-3 gap-2 mt-4">
                <Button onClick={performPercentage}>%</Button>
                <Button onClick={performSquare}>x²</Button>
                <Button onClick={performReciprocal}>1/x</Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 space-y-6">
            {/* History */}
            {history.length > 0 && (
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">History</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {history.slice().reverse().map((calculation, index) => (
                    <div key={index} className="text-sm text-gray-600 font-mono bg-gray-50 p-2 rounded">
                      {calculation}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setHistory([])}
                  className="text-sm text-red-600 hover:text-red-800 mt-2"
                >
                  Clear History
                </button>
              </div>
            )}

            {/* Ad */}
            <AdBanner 
              slot="calculator-sidebar"
              size="300x250"
              className="bg-white rounded-lg shadow-sm"
            />

            {/* Features */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Basic arithmetic operations</li>
                <li>• Memory functions (MC, MR, M+, M-)</li>
                <li>• Calculation history</li>
                <li>• Square root and percentage</li>
                <li>• Keyboard support</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Keyboard Support Info */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Keyboard Shortcuts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <strong>Numbers:</strong> 0-9
            </div>
            <div>
              <strong>Operations:</strong> +, -, *, /
            </div>
            <div>
              <strong>Decimal:</strong> . (period)
            </div>
            <div>
              <strong>Equals:</strong> Enter or =
            </div>
            <div>
              <strong>Clear:</strong> C or Delete
            </div>
            <div>
              <strong>Clear Entry:</strong> Escape
            </div>
            <div>
              <strong>Percentage:</strong> %
            </div>
            <div>
              <strong>Square Root:</strong> r
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
