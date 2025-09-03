import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { CalculatorIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import AdBanner from '../../components/AdBanner';

type CalculatorMode = 'DEG' | 'RAD' | 'GRAD';

export default function ScientificCalculatorPage() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [memory, setMemory] = useState(0);
  const [mode, setMode] = useState<CalculatorMode>('DEG');
  const [history, setHistory] = useState<string[]>([]);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const clearEntry = () => {
    setDisplay('0');
  };

  const deleteLast = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const performBasicOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);
      
      setDisplay(String(newValue));
      addToHistory(`${currentValue} ${operation} ${inputValue} = ${newValue}`);
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
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
        return secondValue !== 0 ? firstValue / secondValue : 0;
      case '^':
        return Math.pow(firstValue, secondValue);
      case 'mod':
        return firstValue % secondValue;
      default:
        return secondValue;
    }
  };

  const performScientificFunction = (func: string) => {
    const inputValue = parseFloat(display);
    let result: number;

    try {
      switch (func) {
        case 'sin':
          result = Math.sin(convertToRadians(inputValue));
          break;
        case 'cos':
          result = Math.cos(convertToRadians(inputValue));
          break;
        case 'tan':
          result = Math.tan(convertToRadians(inputValue));
          break;
        case 'asin':
          result = convertFromRadians(Math.asin(inputValue));
          break;
        case 'acos':
          result = convertFromRadians(Math.acos(inputValue));
          break;
        case 'atan':
          result = convertFromRadians(Math.atan(inputValue));
          break;
        case 'log':
          result = Math.log10(inputValue);
          break;
        case 'ln':
          result = Math.log(inputValue);
          break;
        case 'exp':
          result = Math.exp(inputValue);
          break;
        case 'sqrt':
          result = Math.sqrt(inputValue);
          break;
        case 'cbrt':
          result = Math.cbrt(inputValue);
          break;
        case 'square':
          result = inputValue * inputValue;
          break;
        case 'cube':
          result = inputValue * inputValue * inputValue;
          break;
        case 'reciprocal':
          result = inputValue !== 0 ? 1 / inputValue : 0;
          break;
        case 'factorial':
          result = factorial(inputValue);
          break;
        case 'abs':
          result = Math.abs(inputValue);
          break;
        case 'floor':
          result = Math.floor(inputValue);
          break;
        case 'ceil':
          result = Math.ceil(inputValue);
          break;
        case 'round':
          result = Math.round(inputValue);
          break;
        case 'negate':
          result = -inputValue;
          break;
        default:
          result = inputValue;
      }

      if (isNaN(result) || !isFinite(result)) {
        toast.error('Invalid calculation');
        result = 0;
      }

      setDisplay(String(result));
      addToHistory(`${func}(${inputValue}) = ${result}`);
      setWaitingForOperand(true);
    } catch {
      toast.error('Calculation error');
      setDisplay('0');
    }
  };

  const convertToRadians = (value: number): number => {
    switch (mode) {
      case 'RAD':
        return value;
      case 'DEG':
        return (value * Math.PI) / 180;
      case 'GRAD':
        return (value * Math.PI) / 200;
      default:
        return value;
    }
  };

  const convertFromRadians = (value: number): number => {
    switch (mode) {
      case 'RAD':
        return value;
      case 'DEG':
        return (value * 180) / Math.PI;
      case 'GRAD':
        return (value * 200) / Math.PI;
      default:
        return value;
    }
  };

  const factorial = (n: number): number => {
    if (n < 0 || !Number.isInteger(n)) return NaN;
    if (n === 0 || n === 1) return 1;
    if (n > 170) return Infinity; // Prevent overflow
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  };

  const addToHistory = (calculation: string) => {
    setHistory(prev => [calculation, ...prev].slice(0, 10));
  };

  const insertConstant = (constant: string) => {
    let value: number;
    switch (constant) {
      case 'π':
        value = Math.PI;
        break;
      case 'e':
        value = Math.E;
        break;
      default:
        return;
    }
    setDisplay(String(value));
    setWaitingForOperand(true);
  };

  // Memory functions
  const memoryStore = () => {
    setMemory(parseFloat(display));
    toast.success('Value stored in memory');
  };

  const memoryRecall = () => {
    setDisplay(String(memory));
    setWaitingForOperand(true);
  };

  const memoryClear = () => {
    setMemory(0);
    toast.success('Memory cleared');
  };

  const memoryAdd = () => {
    setMemory(memory + parseFloat(display));
    toast.success('Added to memory');
  };

  const memorySubtract = () => {
    setMemory(memory - parseFloat(display));
    toast.success('Subtracted from memory');
  };

  const Button = ({ 
    onClick, 
    className = '', 
    children, 
    title 
  }: { 
    onClick: () => void; 
    className?: string; 
    children: React.ReactNode; 
    title?: string;
  }) => (
    <button
      onClick={onClick}
      title={title}
      className={`p-3 rounded-lg font-medium transition-all hover:scale-105 ${className}`}
    >
      {children}
    </button>
  );

  return (
    <>
      <Helmet>
        <title>Scientific Calculator - Advanced Math Functions</title>
        <meta name="description" content="Advanced scientific calculator with trigonometric functions, logarithms, exponentials, and more mathematical operations." />
        <meta name="keywords" content="scientific calculator, trigonometry, logarithm, advanced math, calculator online" />
      </Helmet>

      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CalculatorIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Scientific Calculator</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Advanced mathematical calculator with trigonometric functions, logarithms, exponentials, and scientific operations.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calculator */}
          <div className="lg:col-span-3">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              {/* Display */}
              <div className="mb-6">
                <div className="bg-gray-900 text-white p-4 rounded-lg text-right text-3xl font-mono min-h-[80px] flex items-center justify-end">
                  {display}
                </div>
                {operation && previousValue !== null && (
                  <div className="text-right text-sm text-gray-500 mt-1">
                    {previousValue} {operation}
                  </div>
                )}
              </div>

              {/* Mode and Memory Info */}
              <div className="flex justify-between items-center mb-4 text-sm">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setMode('DEG')}
                    className={`px-3 py-1 rounded ${mode === 'DEG' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  >
                    DEG
                  </button>
                  <button
                    onClick={() => setMode('RAD')}
                    className={`px-3 py-1 rounded ${mode === 'RAD' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  >
                    RAD
                  </button>
                  <button
                    onClick={() => setMode('GRAD')}
                    className={`px-3 py-1 rounded ${mode === 'GRAD' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  >
                    GRAD
                  </button>
                </div>
                <div className="text-gray-600">
                  Memory: {memory !== 0 ? memory : '0'}
                </div>
              </div>

              {/* Scientific Functions Row */}
              <div className="grid grid-cols-6 gap-2 mb-4">
                <Button onClick={() => performScientificFunction('sin')} className="bg-purple-100 hover:bg-purple-200 text-purple-700" title="Sine">
                  sin
                </Button>
                <Button onClick={() => performScientificFunction('cos')} className="bg-purple-100 hover:bg-purple-200 text-purple-700" title="Cosine">
                  cos
                </Button>
                <Button onClick={() => performScientificFunction('tan')} className="bg-purple-100 hover:bg-purple-200 text-purple-700" title="Tangent">
                  tan
                </Button>
                <Button onClick={() => performScientificFunction('log')} className="bg-purple-100 hover:bg-purple-200 text-purple-700" title="Log base 10">
                  log
                </Button>
                <Button onClick={() => performScientificFunction('ln')} className="bg-purple-100 hover:bg-purple-200 text-purple-700" title="Natural log">
                  ln
                </Button>
                <Button onClick={() => performScientificFunction('exp')} className="bg-purple-100 hover:bg-purple-200 text-purple-700" title="e^x">
                  exp
                </Button>
              </div>

              {/* Inverse Functions Row */}
              <div className="grid grid-cols-6 gap-2 mb-4">
                <Button onClick={() => performScientificFunction('asin')} className="bg-purple-100 hover:bg-purple-200 text-purple-700" title="Arc sine">
                  asin
                </Button>
                <Button onClick={() => performScientificFunction('acos')} className="bg-purple-100 hover:bg-purple-200 text-purple-700" title="Arc cosine">
                  acos
                </Button>
                <Button onClick={() => performScientificFunction('atan')} className="bg-purple-100 hover:bg-purple-200 text-purple-700" title="Arc tangent">
                  atan
                </Button>
                <Button onClick={() => performScientificFunction('sqrt')} className="bg-purple-100 hover:bg-purple-200 text-purple-700" title="Square root">
                  √
                </Button>
                <Button onClick={() => performScientificFunction('cbrt')} className="bg-purple-100 hover:bg-purple-200 text-purple-700" title="Cube root">
                  ∛
                </Button>
                <Button onClick={() => performScientificFunction('factorial')} className="bg-purple-100 hover:bg-purple-200 text-purple-700" title="Factorial">
                  n!
                </Button>
              </div>

              {/* Power and Root Functions */}
              <div className="grid grid-cols-6 gap-2 mb-4">
                <Button onClick={() => performScientificFunction('square')} className="bg-green-100 hover:bg-green-200 text-green-700" title="Square">
                  x²
                </Button>
                <Button onClick={() => performScientificFunction('cube')} className="bg-green-100 hover:bg-green-200 text-green-700" title="Cube">
                  x³
                </Button>
                <Button onClick={() => performBasicOperation('^')} className="bg-green-100 hover:bg-green-200 text-green-700" title="Power">
                  x^y
                </Button>
                <Button onClick={() => performScientificFunction('reciprocal')} className="bg-green-100 hover:bg-green-200 text-green-700" title="Reciprocal">
                  1/x
                </Button>
                <Button onClick={() => insertConstant('π')} className="bg-green-100 hover:bg-green-200 text-green-700" title="Pi">
                  π
                </Button>
                <Button onClick={() => insertConstant('e')} className="bg-green-100 hover:bg-green-200 text-green-700" title="Euler's number">
                  e
                </Button>
              </div>

              {/* Memory Functions */}
              <div className="grid grid-cols-6 gap-2 mb-4">
                <Button onClick={memoryClear} className="bg-orange-100 hover:bg-orange-200 text-orange-700" title="Memory Clear">
                  MC
                </Button>
                <Button onClick={memoryRecall} className="bg-orange-100 hover:bg-orange-200 text-orange-700" title="Memory Recall">
                  MR
                </Button>
                <Button onClick={memoryStore} className="bg-orange-100 hover:bg-orange-200 text-orange-700" title="Memory Store">
                  MS
                </Button>
                <Button onClick={memoryAdd} className="bg-orange-100 hover:bg-orange-200 text-orange-700" title="Memory Add">
                  M+
                </Button>
                <Button onClick={memorySubtract} className="bg-orange-100 hover:bg-orange-200 text-orange-700" title="Memory Subtract">
                  M-
                </Button>
                <Button onClick={() => performScientificFunction('abs')} className="bg-orange-100 hover:bg-orange-200 text-orange-700" title="Absolute value">
                  |x|
                </Button>
              </div>

              {/* Basic Calculator */}
              <div className="grid grid-cols-4 gap-3">
                {/* Row 1 */}
                <Button onClick={clear} className="bg-red-100 hover:bg-red-200 text-red-700" title="Clear All">
                  C
                </Button>
                <Button onClick={clearEntry} className="bg-red-100 hover:bg-red-200 text-red-700" title="Clear Entry">
                  CE
                </Button>
                <Button onClick={deleteLast} className="bg-red-100 hover:bg-red-200 text-red-700" title="Delete">
                  ⌫
                </Button>
                <Button onClick={() => performBasicOperation('÷')} className="bg-blue-100 hover:bg-blue-200 text-blue-700" title="Divide">
                  ÷
                </Button>

                {/* Row 2 */}
                <Button onClick={() => inputNumber('7')} className="bg-gray-100 hover:bg-gray-200 text-gray-700">
                  7
                </Button>
                <Button onClick={() => inputNumber('8')} className="bg-gray-100 hover:bg-gray-200 text-gray-700">
                  8
                </Button>
                <Button onClick={() => inputNumber('9')} className="bg-gray-100 hover:bg-gray-200 text-gray-700">
                  9
                </Button>
                <Button onClick={() => performBasicOperation('×')} className="bg-blue-100 hover:bg-blue-200 text-blue-700" title="Multiply">
                  ×
                </Button>

                {/* Row 3 */}
                <Button onClick={() => inputNumber('4')} className="bg-gray-100 hover:bg-gray-200 text-gray-700">
                  4
                </Button>
                <Button onClick={() => inputNumber('5')} className="bg-gray-100 hover:bg-gray-200 text-gray-700">
                  5
                </Button>
                <Button onClick={() => inputNumber('6')} className="bg-gray-100 hover:bg-gray-200 text-gray-700">
                  6
                </Button>
                <Button onClick={() => performBasicOperation('-')} className="bg-blue-100 hover:bg-blue-200 text-blue-700" title="Subtract">
                  -
                </Button>

                {/* Row 4 */}
                <Button onClick={() => inputNumber('1')} className="bg-gray-100 hover:bg-gray-200 text-gray-700">
                  1
                </Button>
                <Button onClick={() => inputNumber('2')} className="bg-gray-100 hover:bg-gray-200 text-gray-700">
                  2
                </Button>
                <Button onClick={() => inputNumber('3')} className="bg-gray-100 hover:bg-gray-200 text-gray-700">
                  3
                </Button>
                <Button onClick={() => performBasicOperation('+')} className="bg-blue-100 hover:bg-blue-200 text-blue-700" title="Add">
                  +
                </Button>

                {/* Row 5 */}
                <Button onClick={() => performScientificFunction('negate')} className="bg-gray-100 hover:bg-gray-200 text-gray-700" title="Negate">
                  ±
                </Button>
                <Button onClick={() => inputNumber('0')} className="bg-gray-100 hover:bg-gray-200 text-gray-700">
                  0
                </Button>
                <Button onClick={inputDecimal} className="bg-gray-100 hover:bg-gray-200 text-gray-700" title="Decimal point">
                  .
                </Button>
                <Button onClick={() => performBasicOperation('=')} className="bg-green-500 hover:bg-green-600 text-white" title="Equals">
                  =
                </Button>
              </div>
            </div>
          </div>

          {/* History Panel */}
          <div className="space-y-6">
            {/* Ad */}
            <AdBanner 
              slot="scientific-calculator-sidebar"
              size="300x250"
            />

            {/* History */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-lg">
              <h3 className="font-semibold text-gray-900 mb-3">History</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {history.length === 0 ? (
                  <p className="text-sm text-gray-500">No calculations yet</p>
                ) : (
                  history.map((calc, index) => (
                    <div key={index} className="text-sm text-gray-700 p-2 bg-gray-50 rounded">
                      {calc}
                    </div>
                  ))
                )}
              </div>
              {history.length > 0 && (
                <button
                  onClick={() => setHistory([])}
                  className="w-full mt-3 text-sm text-red-600 hover:text-red-800"
                >
                  Clear History
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Function Reference */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Function Reference</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Trigonometric</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <div>sin, cos, tan - Basic trig functions</div>
                <div>asin, acos, atan - Inverse trig</div>
                <div>Mode: DEG, RAD, GRAD</div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Logarithmic</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <div>log - Base 10 logarithm</div>
                <div>ln - Natural logarithm</div>
                <div>exp - e^x exponential</div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Power & Root</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <div>x² - Square</div>
                <div>x³ - Cube</div>
                <div>x^y - Power</div>
                <div>√ - Square root</div>
                <div>∛ - Cube root</div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Constants</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <div>π - Pi (3.14159...)</div>
                <div>e - Euler's number (2.71828...)</div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Memory</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <div>MS - Memory Store</div>
                <div>MR - Memory Recall</div>
                <div>MC - Memory Clear</div>
                <div>M+ - Memory Add</div>
                <div>M- - Memory Subtract</div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Other</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <div>n! - Factorial</div>
                <div>|x| - Absolute value</div>
                <div>1/x - Reciprocal</div>
                <div>± - Change sign</div>
              </div>
            </div>
          </div>
        </div>

        {/* Keyboard Shortcuts */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Keyboard Shortcuts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Numbers:</strong> 0-9 for digit input<br/>
              <strong>Operations:</strong> +, -, *, / for basic math<br/>
              <strong>Decimal:</strong> . for decimal point
            </div>
            <div>
              <strong>Enter/=:</strong> Calculate result<br/>
              <strong>Escape:</strong> Clear all<br/>
              <strong>Backspace:</strong> Delete last digit
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
