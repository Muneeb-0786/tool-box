import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import AdBanner from '../../components/AdBanner';

type ConversionType = 'length' | 'weight' | 'temperature' | 'area' | 'volume' | 'speed';

interface ConversionCategory {
  name: string;
  type: ConversionType;
  units: {
    [key: string]: {
      name: string;
      toBase: (value: number) => number;
      fromBase: (value: number) => number;
    };
  };
  baseUnit: string;
}

const conversions: ConversionCategory[] = [
  {
    name: 'Length',
    type: 'length',
    baseUnit: 'm',
    units: {
      mm: {
        name: 'Millimeters',
        toBase: (v) => v / 1000,
        fromBase: (v) => v * 1000,
      },
      cm: {
        name: 'Centimeters',
        toBase: (v) => v / 100,
        fromBase: (v) => v * 100,
      },
      m: {
        name: 'Meters',
        toBase: (v) => v,
        fromBase: (v) => v,
      },
      km: {
        name: 'Kilometers',
        toBase: (v) => v * 1000,
        fromBase: (v) => v / 1000,
      },
      in: {
        name: 'Inches',
        toBase: (v) => v * 0.0254,
        fromBase: (v) => v / 0.0254,
      },
      ft: {
        name: 'Feet',
        toBase: (v) => v * 0.3048,
        fromBase: (v) => v / 0.3048,
      },
      yd: {
        name: 'Yards',
        toBase: (v) => v * 0.9144,
        fromBase: (v) => v / 0.9144,
      },
      mi: {
        name: 'Miles',
        toBase: (v) => v * 1609.344,
        fromBase: (v) => v / 1609.344,
      },
    },
  },
  {
    name: 'Weight',
    type: 'weight',
    baseUnit: 'kg',
    units: {
      mg: {
        name: 'Milligrams',
        toBase: (v) => v / 1000000,
        fromBase: (v) => v * 1000000,
      },
      g: {
        name: 'Grams',
        toBase: (v) => v / 1000,
        fromBase: (v) => v * 1000,
      },
      kg: {
        name: 'Kilograms',
        toBase: (v) => v,
        fromBase: (v) => v,
      },
      oz: {
        name: 'Ounces',
        toBase: (v) => v * 0.0283495,
        fromBase: (v) => v / 0.0283495,
      },
      lb: {
        name: 'Pounds',
        toBase: (v) => v * 0.453592,
        fromBase: (v) => v / 0.453592,
      },
      ton: {
        name: 'Tons',
        toBase: (v) => v * 1000,
        fromBase: (v) => v / 1000,
      },
    },
  },
  {
    name: 'Temperature',
    type: 'temperature',
    baseUnit: 'C',
    units: {
      C: {
        name: 'Celsius',
        toBase: (v) => v,
        fromBase: (v) => v,
      },
      F: {
        name: 'Fahrenheit',
        toBase: (v) => (v - 32) * 5/9,
        fromBase: (v) => v * 9/5 + 32,
      },
      K: {
        name: 'Kelvin',
        toBase: (v) => v - 273.15,
        fromBase: (v) => v + 273.15,
      },
    },
  },
  {
    name: 'Area',
    type: 'area',
    baseUnit: 'm2',
    units: {
      mm2: {
        name: 'Square Millimeters',
        toBase: (v) => v / 1000000,
        fromBase: (v) => v * 1000000,
      },
      cm2: {
        name: 'Square Centimeters',
        toBase: (v) => v / 10000,
        fromBase: (v) => v * 10000,
      },
      m2: {
        name: 'Square Meters',
        toBase: (v) => v,
        fromBase: (v) => v,
      },
      ha: {
        name: 'Hectares',
        toBase: (v) => v * 10000,
        fromBase: (v) => v / 10000,
      },
      km2: {
        name: 'Square Kilometers',
        toBase: (v) => v * 1000000,
        fromBase: (v) => v / 1000000,
      },
      in2: {
        name: 'Square Inches',
        toBase: (v) => v * 0.00064516,
        fromBase: (v) => v / 0.00064516,
      },
      ft2: {
        name: 'Square Feet',
        toBase: (v) => v * 0.092903,
        fromBase: (v) => v / 0.092903,
      },
      acre: {
        name: 'Acres',
        toBase: (v) => v * 4046.86,
        fromBase: (v) => v / 4046.86,
      },
    },
  },
  {
    name: 'Volume',
    type: 'volume',
    baseUnit: 'l',
    units: {
      ml: {
        name: 'Milliliters',
        toBase: (v) => v / 1000,
        fromBase: (v) => v * 1000,
      },
      l: {
        name: 'Liters',
        toBase: (v) => v,
        fromBase: (v) => v,
      },
      gal: {
        name: 'Gallons (US)',
        toBase: (v) => v * 3.78541,
        fromBase: (v) => v / 3.78541,
      },
      qt: {
        name: 'Quarts',
        toBase: (v) => v * 0.946353,
        fromBase: (v) => v / 0.946353,
      },
      pt: {
        name: 'Pints',
        toBase: (v) => v * 0.473176,
        fromBase: (v) => v / 0.473176,
      },
      cup: {
        name: 'Cups',
        toBase: (v) => v * 0.236588,
        fromBase: (v) => v / 0.236588,
      },
      floz: {
        name: 'Fluid Ounces',
        toBase: (v) => v * 0.0295735,
        fromBase: (v) => v / 0.0295735,
      },
    },
  },
  {
    name: 'Speed',
    type: 'speed',
    baseUnit: 'ms',
    units: {
      ms: {
        name: 'Meters per Second',
        toBase: (v) => v,
        fromBase: (v) => v,
      },
      kmh: {
        name: 'Kilometers per Hour',
        toBase: (v) => v / 3.6,
        fromBase: (v) => v * 3.6,
      },
      mph: {
        name: 'Miles per Hour',
        toBase: (v) => v * 0.44704,
        fromBase: (v) => v / 0.44704,
      },
      kn: {
        name: 'Knots',
        toBase: (v) => v * 0.514444,
        fromBase: (v) => v / 0.514444,
      },
      fps: {
        name: 'Feet per Second',
        toBase: (v) => v * 0.3048,
        fromBase: (v) => v / 0.3048,
      },
    },
  },
];

export default function UnitConverterPage() {
  const [activeCategory, setActiveCategory] = useState<ConversionType>('length');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('ft');
  const [fromValue, setFromValue] = useState('1');
  const [toValue, setToValue] = useState('3.28084');

  const currentCategory = conversions.find(c => c.type === activeCategory)!;

  const convert = (value: string, from: string, to: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return '';

    const baseValue = currentCategory.units[from].toBase(numValue);
    const result = currentCategory.units[to].fromBase(baseValue);
    
    // Round to 8 significant digits
    return parseFloat(result.toPrecision(8)).toString();
  };

  const handleFromValueChange = (value: string) => {
    setFromValue(value);
    const converted = convert(value, fromUnit, toUnit);
    setToValue(converted);
  };

  const handleToValueChange = (value: string) => {
    setToValue(value);
    const converted = convert(value, toUnit, fromUnit);
    setFromValue(converted);
  };

  const switchUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setFromValue(toValue);
    setToValue(fromValue);
  };

  const handleCategoryChange = (category: ConversionType) => {
    setActiveCategory(category);
    const newCategory = conversions.find(c => c.type === category)!;
    const unitKeys = Object.keys(newCategory.units);
    setFromUnit(unitKeys[0]);
    setToUnit(unitKeys[1] || unitKeys[0]);
    setFromValue('1');
    const converted = convert('1', unitKeys[0], unitKeys[1] || unitKeys[0]);
    setToValue(converted);
  };

  return (
    <>
      <Helmet>
        <title>Unit Converter - Convert Length, Weight, Temperature & More</title>
        <meta name="description" content="Convert between different units of measurement. Length, weight, temperature, area, volume, and speed converter with instant results." />
        <meta name="keywords" content="unit converter, measurement converter, length converter, weight converter, temperature converter" />
      </Helmet>

      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ArrowsRightLeftIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Unit Converter</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Convert between different units of measurement instantly. Choose from length, weight, temperature, area, volume, and speed.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-2 shadow-lg">
          <div className="flex flex-wrap gap-2">
            {conversions.map((category) => (
              <button
                key={category.type}
                onClick={() => handleCategoryChange(category.type)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeCategory === category.type
                    ? 'bg-green-500 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Converter */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-8 shadow-lg">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* From */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                  <select
                    value={fromUnit}
                    onChange={(e) => {
                      setFromUnit(e.target.value);
                      const converted = convert(fromValue, e.target.value, toUnit);
                      setToValue(converted);
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {Object.entries(currentCategory.units).map(([key, unit]) => (
                      <option key={key} value={key}>
                        {unit.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <input
                    type="number"
                    value={fromValue}
                    onChange={(e) => handleFromValueChange(e.target.value)}
                    placeholder="Enter value"
                    className="w-full p-4 text-2xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Switch Button */}
              <div className="flex justify-center">
                <button
                  onClick={switchUnits}
                  className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors shadow-lg"
                >
                  <ArrowsRightLeftIcon className="w-6 h-6" />
                </button>
              </div>

              {/* To */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                  <select
                    value={toUnit}
                    onChange={(e) => {
                      setToUnit(e.target.value);
                      const converted = convert(fromValue, fromUnit, e.target.value);
                      setToValue(converted);
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {Object.entries(currentCategory.units).map(([key, unit]) => (
                      <option key={key} value={key}>
                        {unit.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <input
                    type="number"
                    value={toValue}
                    onChange={(e) => handleToValueChange(e.target.value)}
                    placeholder="Result"
                    className="w-full p-4 text-2xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Quick Conversions */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Conversions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                {[1, 5, 10, 100].map((value) => {
                  const converted = convert(value.toString(), fromUnit, toUnit);
                  return (
                    <div key={value} className="bg-gray-50 p-3 rounded-lg text-center">
                      <div className="font-medium text-gray-900">
                        {value} {currentCategory.units[fromUnit].name.split(' ').pop()}
                      </div>
                      <div className="text-green-600">
                        = {converted} {currentCategory.units[toUnit].name.split(' ').pop()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Ad */}
        <AdBanner 
          slot="unit-converter-bottom"
          size="728x90"
          className="mx-auto"
        />

        {/* Reference Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Common Conversions */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Common {currentCategory.name} Conversions</h3>
            <div className="space-y-2 text-sm">
              {Object.entries(currentCategory.units).slice(0, 6).map(([key, unit]) => {
                const converted = convert('1', currentCategory.baseUnit, key);
                return (
                  <div key={key} className="flex justify-between">
                    <span>1 {currentCategory.units[currentCategory.baseUnit].name.split(' ').pop()}</span>
                    <span>= {converted} {unit.name.split(' ').pop()}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Tips</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Use the switch button to quickly swap units</li>
              <li>• Results are automatically calculated as you type</li>
              <li>• All calculations are performed instantly in your browser</li>
              <li>• Precision is maintained up to 8 significant digits</li>
              <li>• Switch between different measurement categories using the tabs</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
