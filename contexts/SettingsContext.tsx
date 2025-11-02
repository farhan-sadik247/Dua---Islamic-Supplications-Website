'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SettingsContextType {
  showArabic: boolean;
  showTransliteration: boolean;
  showTranslation: boolean;
  arabicFontSize: number;
  translationFontSize: number;
  selectedCategory: number | null;
  selectedSubcategory: number | null;
  setShowArabic: (value: boolean) => void;
  setShowTransliteration: (value: boolean) => void;
  setShowTranslation: (value: boolean) => void;
  setArabicFontSize: (value: number) => void;
  setTranslationFontSize: (value: number) => void;
  setSelectedCategory: (value: number | null) => void;
  setSelectedSubcategory: (value: number | null) => void;
  resetToDefaultCategory: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [showArabic, setShowArabic] = useState(true);
  const [showTransliteration, setShowTransliteration] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);
  const [arabicFontSize, setArabicFontSize] = useState(25);
  const [translationFontSize, setTranslationFontSize] = useState(18);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(null);
  const [duasImportanceCategoryId, setDuasImportanceCategoryId] = useState<number | null>(null);

  // Fetch the ID of "Dua's Importance" category on mount
  useEffect(() => {
    const fetchDuasImportanceId = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/categories');
        const categories = await response.json();
        const duasImportance = categories.find((cat: any) => cat.name === "Dua's Importance");
        if (duasImportance) {
          setDuasImportanceCategoryId(duasImportance.id);
          // Set it as the default selected category
          if (selectedCategory === null) {
            setSelectedCategory(duasImportance.id);
          }
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchDuasImportanceId();
  }, []);

  const resetToDefaultCategory = () => {
    if (duasImportanceCategoryId) {
      setSelectedCategory(duasImportanceCategoryId);
      setSelectedSubcategory(null);
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        showArabic,
        showTransliteration,
        showTranslation,
        arabicFontSize,
        translationFontSize,
        selectedCategory,
        selectedSubcategory,
        setShowArabic,
        setShowTransliteration,
        setShowTranslation,
        setArabicFontSize,
        setTranslationFontSize,
        setSelectedCategory,
        setSelectedSubcategory,
        resetToDefaultCategory,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
