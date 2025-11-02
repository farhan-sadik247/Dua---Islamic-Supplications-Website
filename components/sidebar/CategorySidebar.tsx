'use client';

import React, { useState, useEffect } from 'react';
import { Category, Subcategory, Dua } from '@/types';
import { categoryAPI, duaAPI } from '@/lib/api';
import { useSettings } from '@/contexts/SettingsContext';

export default function CategorySidebar() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [duasBySubcategory, setDuasBySubcategory] = useState<Record<number, Dua[]>>({});
  const [expandedSubcategoryId, setExpandedSubcategoryId] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const { selectedCategory, setSelectedCategory, selectedSubcategory, setSelectedSubcategory } = useSettings();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchSubcategories(selectedCategory);
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const data = await categoryAPI.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubcategories = async (categoryId: number) => {
    try {
      const data = await categoryAPI.getSubcategories(categoryId);
      setSubcategories(data);
      
      // Fetch duas for each subcategory
      const duasData: Record<number, Dua[]> = {};
      for (const subcat of data) {
        try {
          const duas = await duaAPI.getBySubcategory(subcat.id);
          duasData[subcat.id] = duas;
        } catch (error) {
          console.error(`Error fetching duas for subcategory ${subcat.id}:`, error);
          duasData[subcat.id] = [];
        }
      }
      setDuasBySubcategory(duasData);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const scrollToSubcategory = (subcategoryId: number) => {
    const element = document.getElementById(`subcategory-${subcategoryId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setSelectedSubcategory(subcategoryId);
    }
  };

  const scrollToDua = (duaId: number, subcategoryId: number) => {
    const element = document.getElementById(`dua-${duaId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setSelectedSubcategory(subcategoryId);
    }
  };

  const handleSubcategoryClick = (subcategoryId: number) => {
    // Toggle: if clicking the same one, close it; otherwise open the new one
    if (expandedSubcategoryId === subcategoryId) {
      setExpandedSubcategoryId(null);
    } else {
      setExpandedSubcategoryId(subcategoryId);
      scrollToSubcategory(subcategoryId);
    }
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-20 left-4 z-50 bg-primary text-white p-2 rounded-lg shadow-lg"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-[350px] bg-white
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          overflow-y-auto h-screen
        `}
      >
        <div className="p-5">
          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <svg 
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search By Category"
                className="w-full pl-10 pr-4 py-3 bg-[#F7F8FA] border-none rounded-lg text-sm text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <h2 className="text-lg font-bold mb-4 text-gray-800">Categories</h2>
          
          {loading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-1">
              {categories.map((category) => (
                <div key={category.id}>
                  <button
                    onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left
                      transition-all
                      ${selectedCategory === category.id ? 'bg-[#E8F5EE]' : 'hover:bg-gray-50'}
                    `}
                  >
                    <div className={`
                      w-14 h-14 rounded-xl flex items-center justify-center text-3xl shrink-0
                      ${selectedCategory === category.id ? 'bg-white shadow-sm' : 'bg-[#F7F8FA]'}
                    `}>
                      {category.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold text-base mb-0.5 ${selectedCategory === category.id ? 'text-[#1FA45B]' : 'text-gray-800'}`}>
                        {category.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {subcategories.length > 0 && selectedCategory === category.id 
                          ? `${subcategories.length} Subcategories | ${category.duaCount} Duas`
                          : `${category.duaCount} Duas`
                        }
                      </p>
                    </div>
                  </button>

                  {/* Subcategories (Sections) with Duas */}
                  {selectedCategory === category.id && subcategories.length > 0 && (
                    <div className="mt-3 mb-2 space-y-3 pl-[70px] pr-3">
                      {subcategories.map((subcat) => {
                        const duas = duasBySubcategory[subcat.id] || [];
                        const isExpanded = expandedSubcategoryId === subcat.id;
                        
                        return (
                          <div key={subcat.id} className="space-y-1">
                            {/* Subcategory Header (Section Name) - Click to expand/collapse and scroll */}
                            <button
                              onClick={() => handleSubcategoryClick(subcat.id)}
                              className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded transition-colors text-left"
                            >
                              <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                              <span className={`font-medium text-sm ${
                                selectedSubcategory === subcat.id ? 'text-[#1FA45B]' : 'text-gray-700'
                              }`}>{subcat.name}</span>
                            </button>
                            
                            {/* Duas under this subcategory - Click to scroll to specific dua */}
                            {duas.length > 0 && isExpanded && (
                              <div className="pl-3 space-y-0.5 border-l-2 border-dotted border-[#1FA45B] ml-2">
                                {duas.map((dua) => (
                                  <button
                                    key={dua.id}
                                    onClick={() => scrollToDua(dua.id, subcat.id)}
                                    className="w-full text-left px-3 py-2 rounded-lg text-xs transition-colors hover:bg-gray-50"
                                  >
                                    <div className="flex items-start gap-2">
                                      <div className="w-1.5 h-1.5 rounded-full mt-1 shrink-0 bg-gray-400"></div>
                                      <p className="leading-relaxed text-gray-600">
                                        {dua.name}
                                      </p>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
