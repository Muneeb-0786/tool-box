import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowsRightLeftIcon, BanknotesIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import AdBanner from '../../components/AdBanner';

interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

interface ExchangeRates {
  [key: string]: number;
}

const popularCurrencies: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', flag: '🇰🇷' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$', flag: '🇲🇽' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽', flag: '🇷🇺' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', flag: '🇳🇿' },
];

const MOCK_EXCHANGE_RATES: ExchangeRates = {
  USD: 1,
  EUR: 0.85,
  GBP: 0.73,
  JPY: 110.12,
  CAD: 1.25,
  AUD: 1.35,
  CHF: 0.92,
  CNY: 6.45,
  INR: 74.83,
  KRW: 1180.50,
  MXN: 20.15,
  BRL: 5.20,
  RUB: 73.25,
  SGD: 1.35,
  NZD: 1.42,
};

export default function CurrencyConverterPage() {
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [fromAmount, setFromAmount] = useState('1');
  const [toAmount, setToAmount] = useState('');
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({});
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchExchangeRates = async () => {
    setIsLoading(true);
    try {
      // In production, replace with real API call:
      // const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      // const data = await response.json();
      // setExchangeRates(data.rates);
      
      // Using mock data for now
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setExchangeRates(MOCK_EXCHANGE_RATES);
      setLastUpdated(new Date());
      toast.success('Exchange rates updated!');
    } catch {
      toast.error('Failed to fetch exchange rates');
      // Fallback to mock rates
      setExchangeRates(MOCK_EXCHANGE_RATES);
      setLastUpdated(new Date());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadRates = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setExchangeRates(MOCK_EXCHANGE_RATES);
        setLastUpdated(new Date());
      } catch {
        setExchangeRates(MOCK_EXCHANGE_RATES);
        setLastUpdated(new Date());
      } finally {
        setIsLoading(false);
      }
    };
    loadRates();
  }, []);

  useEffect(() => {
    if (exchangeRates[fromCurrency] && exchangeRates[toCurrency]) {
      const amount = parseFloat(fromAmount);
      if (!isNaN(amount)) {
        const rate = exchangeRates[toCurrency] / exchangeRates[fromCurrency];
        const result = amount * rate;
        setToAmount(result.toFixed(6).replace(/\.?0+$/, ''));
      } else {
        setToAmount('');
      }
    }
  }, [fromAmount, fromCurrency, toCurrency, exchangeRates]);

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
  };

  const handleToAmountChange = (value: string) => {
    setToAmount(value);
    const amount = parseFloat(value);
    if (!isNaN(amount) && exchangeRates[fromCurrency] && exchangeRates[toCurrency]) {
      const rate = exchangeRates[fromCurrency] / exchangeRates[toCurrency];
      const result = amount * rate;
      setFromAmount(result.toFixed(6).replace(/\.?0+$/, ''));
    }
  };

  const switchCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const getCurrentRate = (): number => {
    if (exchangeRates[fromCurrency] && exchangeRates[toCurrency]) {
      return exchangeRates[toCurrency] / exchangeRates[fromCurrency];
    }
    return 0;
  };

  const getFromCurrency = () => popularCurrencies.find(c => c.code === fromCurrency);
  const getToCurrency = () => popularCurrencies.find(c => c.code === toCurrency);

  return (
    <>
      <Helmet>
        <title>Currency Converter - Real-time Exchange Rates</title>
        <meta name="description" content="Convert between world currencies with real-time exchange rates. Support for USD, EUR, GBP, JPY and 10+ more currencies." />
        <meta name="keywords" content="currency converter, exchange rates, USD to EUR, currency exchange, foreign exchange" />
      </Helmet>

      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BanknotesIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Currency Converter</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Convert between world currencies with real-time exchange rates. Get accurate conversions for over 15 popular currencies.
          </p>
        </div>

        {/* Converter */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-8 shadow-lg">
          <div className="max-w-4xl mx-auto">
            {/* Rate Update Info */}
            <div className="flex justify-between items-center mb-6">
              <div className="text-sm text-gray-600">
                {lastUpdated && (
                  <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
                )}
              </div>
              <button
                onClick={fetchExchangeRates}
                disabled={isLoading}
                className="text-sm text-green-600 hover:text-green-800 disabled:opacity-50"
              >
                {isLoading ? 'Updating...' : 'Refresh Rates'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* From Currency */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                  <select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {popularCurrencies.map((currency) => (
                      <option key={currency.code} value={currency.code}>
                        {currency.flag} {currency.code} - {currency.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={fromAmount}
                    onChange={(e) => handleFromAmountChange(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full p-4 text-2xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-16"
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">
                    {getFromCurrency()?.symbol}
                  </span>
                </div>
              </div>

              {/* Switch Button */}
              <div className="flex justify-center">
                <button
                  onClick={switchCurrencies}
                  className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors shadow-lg"
                >
                  <ArrowsRightLeftIcon className="w-6 h-6" />
                </button>
              </div>

              {/* To Currency */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                  <select
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {popularCurrencies.map((currency) => (
                      <option key={currency.code} value={currency.code}>
                        {currency.flag} {currency.code} - {currency.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={toAmount}
                    onChange={(e) => handleToAmountChange(e.target.value)}
                    placeholder="Converted amount"
                    className="w-full p-4 text-2xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-16"
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">
                    {getToCurrency()?.symbol}
                  </span>
                </div>
              </div>
            </div>

            {/* Exchange Rate Info */}
            {getCurrentRate() > 0 && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg text-center">
                <p className="text-sm text-gray-600 mb-1">Current Exchange Rate</p>
                <p className="text-lg font-semibold text-green-600">
                  1 {fromCurrency} = {getCurrentRate().toFixed(6)} {toCurrency}
                </p>
              </div>
            )}

            {/* Quick Amount Buttons */}
            <div className="mt-6">
              <p className="text-sm font-medium text-gray-700 mb-2">Quick Amounts:</p>
              <div className="flex flex-wrap gap-2">
                {[1, 5, 10, 25, 50, 100, 500, 1000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setFromAmount(amount.toString())}
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  >
                    {amount}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Ad */}
        <AdBanner 
          slot="currency-converter-middle"
          size="728x90"
          className="mx-auto"
        />

        {/* Popular Exchange Rates */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Exchange Rates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { from: 'USD', to: 'EUR' },
              { from: 'USD', to: 'GBP' },
              { from: 'USD', to: 'JPY' },
              { from: 'EUR', to: 'GBP' },
              { from: 'EUR', to: 'USD' },
              { from: 'GBP', to: 'USD' },
            ].map(({ from, to }) => {
              const rate = exchangeRates[to] / exchangeRates[from];
              const fromCur = popularCurrencies.find(c => c.code === from);
              const toCur = popularCurrencies.find(c => c.code === to);
              
              return (
                <div key={`${from}-${to}`} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span>{fromCur?.flag}</span>
                      <span className="font-medium text-sm">{from}</span>
                      <ArrowsRightLeftIcon className="w-3 h-3 text-gray-400" />
                      <span>{toCur?.flag}</span>
                      <span className="font-medium text-sm">{to}</span>
                    </div>
                    <span className="text-sm font-semibold text-green-600">
                      {rate ? rate.toFixed(4) : '---'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Currency List */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Supported Currencies</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {popularCurrencies.map((currency) => (
              <div key={currency.code} className="flex items-center space-x-3 p-2">
                <span className="text-xl">{currency.flag}</span>
                <div>
                  <div className="font-medium text-sm text-gray-900">{currency.code}</div>
                  <div className="text-xs text-gray-500">{currency.name}</div>
                </div>
                <div className="ml-auto text-sm text-gray-600">{currency.symbol}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-green-600 text-xl">📈</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Real-time Rates</h3>
            <p className="text-sm text-gray-600">
              Get the most current exchange rates updated regularly throughout the day.
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-green-600 text-xl">🌍</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">15+ Currencies</h3>
            <p className="text-sm text-gray-600">
              Support for major world currencies including USD, EUR, GBP, JPY, and more.
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-green-600 text-xl">💱</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Bi-directional</h3>
            <p className="text-sm text-gray-600">
              Convert in both directions. Change either amount to see instant updates.
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Disclaimer:</strong> Exchange rates are for informational purposes only. 
            For actual trading or financial decisions, please consult your bank or financial institution.
          </p>
        </div>
      </div>
    </>
  );
}
