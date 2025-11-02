import axios from 'axios';
import { Category, Subcategory, Dua } from '@/types';

// Use relative URLs for Vercel deployment (works for both local and production)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const categoryAPI = {
  getAll: async (): Promise<Category[]> => {
    const response = await apiClient.get('/categories');
    return response.data;
  },
  getSubcategories: async (categoryId: number): Promise<Subcategory[]> => {
    const response = await apiClient.get(`/categories/${categoryId}/subcategories`);
    return response.data;
  },
};

export const duaAPI = {
  getAll: async (): Promise<Dua[]> => {
    const response = await apiClient.get('/duas');
    return response.data;
  },
  getById: async (id: number): Promise<Dua> => {
    const response = await apiClient.get(`/duas/${id}`);
    return response.data;
  },
  getBySubcategory: async (subcategoryId: number): Promise<Dua[]> => {
    const response = await apiClient.get(`/subcategories/${subcategoryId}/duas`);
    return response.data;
  },
};
