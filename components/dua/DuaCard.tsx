'use client';

import React, { useState } from 'react';
import { Dua } from '@/types';
import { useSettings } from '@/contexts/SettingsContext';

interface DuaCardProps {
  dua: Dua;
  index: number;
}

export default function DuaCard({ dua, index }: DuaCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const { 
    showArabic, 
    showTransliteration, 
    showTranslation, 
    arabicFontSize, 
    translationFontSize 
  } = useSettings();

  const handleCopy = () => {
    const text = `${dua.arabic}\n\n${dua.transliteration}\n\n${dua.translation}\n\nReference: ${dua.reference}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAudioToggle = () => {
    setIsPlaying(!isPlaying);
    // Audio functionality would be implemented here
  };

  return (
    <div className="card p-6 hover:shadow-md transition-shadow border border-gray-100">
      {/* Header with Section Number */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-primary text-white rounded-lg flex items-center justify-center font-bold text-lg shrink-0">
            {index}
          </div>
          <div>
            <h3 className="text-base font-semibold text-primary mb-1">{dua.name}</h3>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={handleAudioToggle}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Play Audio"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isPlaying ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              )}
            </svg>
          </button>
          <button
            onClick={handleCopy}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Copy"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {copied ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              )}
            </svg>
          </button>
          <button
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Bookmark"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
          <button
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Share"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Context/Background */}
      {dua.context && (
        <div className="mb-6 py-4 px-4 bg-gray-50 rounded-lg border border-gray-200">
          <p 
            className="text-gray-800 leading-relaxed whitespace-pre-line"
            style={{ fontSize: `${translationFontSize}px` }}
          >
            {dua.context}
          </p>
        </div>
      )}

      {/* Arabic Text */}
      {showArabic && dua.arabic && (
        <div className="mb-6 py-6 px-4 bg-white border-l-4 border-primary">
          <p 
            className="text-right leading-loose" 
            dir="rtl" 
            style={{ 
              fontFamily: 'Traditional Arabic, Arial',
              fontSize: `${arabicFontSize}px`
            }}
          >
            {dua.arabic}
          </p>
        </div>
      )}

      {/* Transliteration */}
      {showTransliteration && dua.transliteration && (
        <div className="mb-4 pb-4 border-b border-gray-200">
          <p className="text-sm font-semibold text-gray-700 mb-2"><span className="italic">Transliteration:</span></p>
          <p 
            className="text-gray-700 leading-relaxed italic"
            style={{ fontSize: `${translationFontSize}px` }}
          >
            {dua.transliteration}
          </p>
        </div>
      )}

      {/* Translation */}
      {showTranslation && dua.translation && (
        <div className="mb-4 pb-4 border-b border-gray-200">
          <p className="text-sm font-semibold text-gray-700 mb-2"><span className="italic">Translation:</span></p>
          <p 
            className="text-gray-800 leading-relaxed whitespace-pre-line"
            style={{ fontSize: `${translationFontSize}px` }}
          >
            {dua.translation}
          </p>
        </div>
      )}

      {/* Reference */}
      {dua.reference && (
        <div className="pt-2">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-primary">Reference:</span>
          </p>
          <p className="text-sm text-gray-700 mt-1">{dua.reference}</p>
        </div>
      )}
    </div>
  );
}
