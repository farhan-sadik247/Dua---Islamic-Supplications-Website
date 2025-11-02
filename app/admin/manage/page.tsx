'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';

interface Category {
  id: number;
  name: string;
  icon: string;
}

interface Subcategory {
  id: number;
  categoryId: number;
  name: string;
}

interface Dua {
  id: number;
  subcategoryId: number;
  name: string;
  context: string;
  arabic: string;
  transliteration: string;
  translation: string;
  reference: string;
}

export default function ManageDuasPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [duas, setDuas] = useState<Dua[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<number | null>(null);
  const [editingDua, setEditingDua] = useState<Dua | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    context: '',
    arabic: '',
    transliteration: '',
    translation: '',
    reference: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategoryId) {
      fetchSubcategories(selectedCategoryId);
    }
  }, [selectedCategoryId]);

  useEffect(() => {
    if (selectedSubcategoryId) {
      fetchDuas(selectedSubcategoryId);
    }
  }, [selectedSubcategoryId]);

  const fetchCategories = async () => {
    try {
      const response = await apiClient.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchSubcategories = async (categoryId: number) => {
    try {
      const response = await apiClient.get(`/categories/${categoryId}/subcategories`);
      setSubcategories(response.data);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const fetchDuas = async (subcategoryId: number) => {
    try {
      const response = await apiClient.get(`/subcategories/${subcategoryId}/duas`);
      setDuas(response.data);
    } catch (error) {
      console.error('Error fetching duas:', error);
    }
  };

  const handleEdit = (dua: Dua) => {
    setEditingDua(dua);
    setFormData({
      name: dua.name,
      context: dua.context || '',
      arabic: dua.arabic || '',
      transliteration: dua.transliteration || '',
      translation: dua.translation || '',
      reference: dua.reference || ''
    });
    setShowEditModal(true);
  };

  const handleDelete = async (duaId: number, duaName: string) => {
    if (!confirm(`Are you sure you want to delete "${duaName}"?`)) {
      return;
    }

    try {
      await apiClient.delete(`/admin/duas/${duaId}`);
      alert('Dua deleted successfully!');
      
      // Refresh the list
      if (selectedSubcategoryId) {
        fetchDuas(selectedSubcategoryId);
      }
    } catch (error) {
      console.error('Error deleting dua:', error);
      alert('Error deleting dua. Check console for details.');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingDua) return;

    try {
      await apiClient.put(`/admin/duas/${editingDua.id}`, formData);
      
      alert('Dua updated successfully!');
      setShowEditModal(false);
      setEditingDua(null);
      
      // Refresh the list
      if (selectedSubcategoryId) {
        fetchDuas(selectedSubcategoryId);
      }
    } catch (error) {
      console.error('Error updating dua:', error);
      alert('Error updating dua. Check console for details.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Manage Duas - Edit & Delete</h1>
          <a
            href="/admin"
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            + Add New Dua
          </a>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Select Category & Subcategory</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategoryId || ''}
                onChange={(e) => {
                  setSelectedCategoryId(Number(e.target.value));
                  setSelectedSubcategoryId(null);
                  setDuas([]);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subcategory
              </label>
              <select
                value={selectedSubcategoryId || ''}
                onChange={(e) => setSelectedSubcategoryId(Number(e.target.value))}
                disabled={!selectedCategoryId}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
              >
                <option value="">Select Subcategory</option>
                {subcategories.map((subcat) => (
                  <option key={subcat.id} value={subcat.id}>
                    {subcat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {duas.length > 0 ? (
          <div className="space-y-4">
            {duas.map((dua, index) => (
              <div key={dua.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary text-white rounded-lg flex items-center justify-center font-bold text-lg shrink-0">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{dua.name}</h3>
                      {dua.reference && (
                        <p className="text-sm text-gray-500 mt-1">Reference: {dua.reference}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(dua)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(dua.id, dua.name)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {dua.context && (
                  <div className="mb-3 p-3 bg-gray-50 rounded">
                    <p className="text-sm text-gray-700">{dua.context}</p>
                  </div>
                )}

                {dua.arabic && (
                  <div className="mb-3 p-4 bg-white border-l-4 border-primary">
                    <p className="text-right text-xl leading-loose" dir="rtl">{dua.arabic}</p>
                  </div>
                )}

                {dua.transliteration && (
                  <div className="mb-3">
                    <p className="text-sm font-semibold text-gray-600 mb-1">Transliteration:</p>
                    <p className="text-gray-700 italic">{dua.transliteration}</p>
                  </div>
                )}

                {dua.translation && (
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-1">Translation:</p>
                    <p className="text-gray-700">{dua.translation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : selectedSubcategoryId ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500">No duas found in this subcategory.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500">Please select a category and subcategory to view duas.</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && editingDua && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Edit Dua</h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingDua(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dua Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Context / Background
                  </label>
                  <textarea
                    name="context"
                    value={formData.context}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Arabic Text
                  </label>
                  <textarea
                    name="arabic"
                    value={formData.arabic}
                    onChange={handleInputChange}
                    rows={3}
                    dir="rtl"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transliteration
                  </label>
                  <textarea
                    name="transliteration"
                    value={formData.transliteration}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Translation
                  </label>
                  <textarea
                    name="translation"
                    value={formData.translation}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reference
                  </label>
                  <input
                    type="text"
                    name="reference"
                    value={formData.reference}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    Update Dua
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingDua(null);
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
