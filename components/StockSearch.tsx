'use client';

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useCalculatorStore } from '@/store/calculatorStore';
import { searchStocks, Stock } from '@/lib/api';
import { cn } from '@/lib/utils';

export default function StockSearch() {
  const { selectedStock, actions } = useCalculatorStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Stock[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchStocks = async () => {
      if (query.length < 1) {
        setResults([]);
        return;
      }
      const data = await searchStocks(query);
      setResults(data);
    };

    const debounce = setTimeout(fetchStocks, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSelect = (stock: Stock) => {
    actions.setStock(stock);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className="relative w-full z-20">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        어떤 종목을 살껄?
      </label>
      <div className="relative">
        <input
          type="text"
          className="w-full p-4 pl-12 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          placeholder="삼성전자, NVDA..."
          value={selectedStock ? selectedStock.name : query}
          onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
              if (selectedStock) actions.setStock(null); // Clear selection on edit
          }}
          onFocus={() => setIsOpen(true)}
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        
        {selectedStock && (
             <button 
                onClick={() => { actions.setStock(null); setQuery(''); }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500"
            >
                ✕
            </button>
        )}
      </div>

      {isOpen && results.length > 0 && !selectedStock && (
        <ul className="absolute w-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden max-h-60 overflow-y-auto">
          {results.map((stock) => (
            <li
              key={stock.code}
              className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex justify-between items-center"
              onClick={() => handleSelect(stock)}
            >
              <span className="font-bold">{stock.name}</span>
              <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">{stock.code}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
