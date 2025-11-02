export interface Category {
  id: number;
  name: string;
  icon: string;
  duaCount: number;
}

export interface Subcategory {
  id: number;
  categoryId: number;
  name: string;
  duaCount: number;
}

export interface Dua {
  id: number;
  subcategoryId: number;
  name: string;
  context: string;
  arabic: string;
  transliteration: string;
  translation: string;
  reference: string;
}
