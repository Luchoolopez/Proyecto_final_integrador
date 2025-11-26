import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
interface ISearchContext {
    isSearchOpen: boolean;
    openSearch: () => void;
    closeSearch: () => void;
}

const SearchContext = createContext<ISearchContext | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const openSearch = () => setIsSearchOpen(true);
    const closeSearch = () => setIsSearchOpen(false);

    return (
        <SearchContext.Provider value={{ isSearchOpen, openSearch, closeSearch }}>
            {children}
        </SearchContext.Provider>
    );
};

export const useSearch = () => {
    const context = useContext(SearchContext);
    if (context === undefined) {
        throw new Error('useSearch tiene que ser usado dentro de un SearchProvider');
    }
    return context;
};