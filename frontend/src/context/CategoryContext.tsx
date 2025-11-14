import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { categoryService, type Category } from '../api/categoryService';

interface CategoryContextType {
    categories: Category[];
    loading: boolean;
    error: string | null;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider = ({ children }: { children: ReactNode }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                setError(null);
                const items = await categoryService.getCategories();
                setCategories(items);
            } catch (err) {
                setError('Error al cargar las categorías');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const value = {
        categories,
        loading,
        error,
    };

    return <CategoryContext.Provider value={value}>{children}</CategoryContext.Provider>;
};

export const useCategoryContext = () => {
    const context = useContext(CategoryContext);
    if (context === undefined) {
        throw new Error('useCategoryContext debe ser usado dentro de un CategoryProvider');
    }
    return context;
};