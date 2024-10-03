import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState} from 'react';
import { favorite } from '@/hooks/FavoritesContext';

const loadFavorites = async () => {
    const favorites = await AsyncStorage.getItem('favorites');
    return favorites ? JSON.parse(favorites) : [];
};

export function useFavorites() : [favorite[], boolean, string, (favorite: favorite) => void, (zip: string) => void] {
    const [favorites, setFavorites] = useState<favorite[]>([]);
    const [favoritesLoading, setFavoritesLoading] = useState(true);
    const [favoriteErrorMessage, setFavoriteErrorMessage] = useState('');

    useEffect(() => {
        const load = async() => {
            try {
                const favorites = await loadFavorites();
                console.log(favorites);
                setFavorites(favorites);
            } catch (e: any) {
                setFavoriteErrorMessage('Error loading favorites: ' + e.message);
            } finally {
                setFavoritesLoading(false);
            }
        };
        load();
    }, []);

    const addToFavorites = async (favorite: favorite) => {
        const newFavorites = [...favorites, favorite];
        setFavorites(newFavorites);
        await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
    };

    const removeFromFavorites = async (zip: string) => {
        const newFavorites = favorites.filter((favorite) => favorite.zip !== zip);
        setFavorites(newFavorites);
        await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
    };

    return [favorites, favoritesLoading, favoriteErrorMessage, addToFavorites, removeFromFavorites];
}