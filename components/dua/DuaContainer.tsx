'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Dua, Subcategory } from '@/types';
import { duaAPI, categoryAPI } from '@/lib/api';
import { useSettings } from '@/contexts/SettingsContext';
import DuaCard from './DuaCard';

export default function DuaContainer() {
  const [duasBySubcategory, setDuasBySubcategory] = useState<{ subcategory: Subcategory; duas: Dua[] }[]>([]);
  const [loading, setLoading] = useState(true);
  const { selectedCategory } = useSettings();

  const fetchAllDuasGrouped = useCallback(async () => {
    setLoading(true);
    try {
      if (!selectedCategory) return;
      
      // Fetch all subcategories for the selected category
      const subcategories = await categoryAPI.getSubcategories(selectedCategory);
      
      // Fetch duas for each subcategory
      const groupedData = [];
      for (const subcat of subcategories) {
        const duas = await duaAPI.getBySubcategory(subcat.id);
        if (duas.length > 0) {
          groupedData.push({ subcategory: subcat, duas });
        }
      }
      
      setDuasBySubcategory(groupedData);
    } catch (error) {
      console.error('Error fetching duas:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedCategory) {
      fetchAllDuasGrouped();
    } else {
      setDuasBySubcategory([]);
      setLoading(false);
    }
  }, [selectedCategory, fetchAllDuasGrouped]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
              <div className="h-20 bg-gray-200 rounded mb-4" />
              <div className="h-16 bg-gray-200 rounded mb-4" />
              <div className="h-12 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      ) : duasBySubcategory.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-gray-500">Please select a category to view duas.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {(() => {
            let globalDuaIndex = 0;
            
            return duasBySubcategory.map((group) => (
              <div key={group.subcategory.id} id={`subcategory-${group.subcategory.id}`} className="scroll-mt-6">
                {/* Subcategory Header */}
                <div className="mb-4 pb-3 border-b-2 border-gray-200">
                  <h2 className="text-xl font-bold text-gray-800">{group.subcategory.name}</h2>
                  <p className="text-sm text-gray-500 mt-1">{group.duas.length} Duas</p>
                </div>
                
                {/* Duas in this subcategory */}
                <div className="space-y-4">
                  {group.duas.map((dua) => {
                    globalDuaIndex++;
                    return (
                      <div key={dua.id} id={`dua-${dua.id}`} className="scroll-mt-6">
                        <DuaCard dua={dua} index={globalDuaIndex} />
                      </div>
                    );
                  })}
                </div>
              </div>
            ));
          })()}
        </div>
      )}
    </div>
  );
}
