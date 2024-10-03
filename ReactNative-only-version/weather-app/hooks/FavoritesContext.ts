import { createContext } from "react";

export interface favorite {
    zip: string;
    city: string;
    state: string;
}

interface FavoritesContext {
    favorites: favorite[];
    favoritesLoading: boolean;
    favoriteErrorMessage: string;
    addToFavorites: (favorite: favorite) => void;
    removeFromFavorites: (zip: string) => void;
}

export const FavoritesContext = createContext<FavoritesContext>({
    favorites: [],
    favoritesLoading: true,
    favoriteErrorMessage: '',
    addToFavorites: () => {},
    removeFromFavorites: () => {},
});