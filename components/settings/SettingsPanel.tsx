'use client';

import React, { useState } from 'react';
import { useSettings } from '@/contexts/SettingsContext';

export default function SettingsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  
  const {
    showArabic,
    setShowArabic,
    showTransliteration,
    setShowTransliteration,
    showTranslation,
    setShowTranslation,
    arabicFontSize,
    setArabicFontSize,
    translationFontSize,
    setTranslationFontSize
  } = useSettings();

  return (
    <>
      {/* Settings Toggle Button - Mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-20 right-4 z-50 lg:hidden bg-white p-2 rounded-lg shadow-lg border border-gray-200"
      >
        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Settings Panel */}
      <aside
        className={`
          fixed lg:static right-0 top-0 bottom-0 z-40
          w-[330px] bg-white border-l border-gray-100
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
          overflow-y-auto h-screen
        `}
      >
        <div className="p-5">
          <h2 className="text-lg font-bold mb-6 text-gray-800">Settings</h2>

          {/* Font Settings */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Font Settings</h3>
            <div className="space-y-4">
              {/* Arabic Font Size */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs text-gray-600">Arabic Font Size</label>
                  <span className="text-xs text-primary font-medium">{arabicFontSize}</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="40"
                  value={arabicFontSize}
                  onChange={(e) => setArabicFontSize(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  style={{
                    background: `linear-gradient(to right, #1FA45B 0%, #1FA45B ${((arabicFontSize - 20) / 20) * 100}%, #e5e7eb ${((arabicFontSize - 20) / 20) * 100}%, #e5e7eb 100%)`
                  }}
                />
              </div>

              {/* Translation Font Size */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs text-gray-600">Translation Font Size</label>
                  <span className="text-xs text-primary font-medium">{translationFontSize}</span>
                </div>
                <input
                  type="range"
                  min="14"
                  max="24"
                  value={translationFontSize}
                  onChange={(e) => setTranslationFontSize(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  style={{
                    background: `linear-gradient(to right, #1FA45B 0%, #1FA45B ${((translationFontSize - 14) / 10) * 100}%, #e5e7eb ${((translationFontSize - 14) / 10) * 100}%, #e5e7eb 100%)`
                  }}
                />
              </div>
            </div>
          </div>

          {/* Arabic Script Font */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Arabic Script & Font Size</h3>
            <select 
              defaultValue="Uthmani"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
            >
              <option>Uthmani</option>
              <option>IndoPak</option>
              <option>KFGQ</option>
            </select>
          </div>

          {/* View Settings */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">View Settings</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <span className="text-sm text-gray-700">Arabic</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={showArabic}
                    onChange={(e) => setShowArabic(e.target.checked)}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <span className="text-sm text-gray-700">Transliteration</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={showTransliteration}
                    onChange={(e) => setShowTransliteration(e.target.checked)}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <span className="text-sm text-gray-700">Translation</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={showTranslation}
                    onChange={(e) => setShowTranslation(e.target.checked)}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="mb-6">
            <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <span className="text-sm font-medium text-gray-700">Advanced Settings</span>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
