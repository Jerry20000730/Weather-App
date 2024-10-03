import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from '@react-navigation/native';
import { Slot } from "expo-router"
import "react-native-reanimated"
import { FavoritesContext } from '@/hooks/FavoritesContext';
import { useFavorites } from '@/hooks/useFavorites';
import { useColorScheme } from "@/components/useColorScheme"

const CustomDarkTheme = {
    ...DarkTheme,
    colors: {
        ...DarkTheme.colors,
        primary: "#FFFFFF",
    },
};

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [favorites, favoritesLoading, favoriteErrorMessage, addToFavorites, removeFromFavorites] = useFavorites();

    return (
        <FavoritesContext.Provider value={{ favorites, favoritesLoading, favoriteErrorMessage, addToFavorites, removeFromFavorites }}>
            <ThemeProvider value={colorScheme === "dark" ? CustomDarkTheme : DefaultTheme}>
                <Slot />
            </ThemeProvider>
        </FavoritesContext.Provider>
    );
}