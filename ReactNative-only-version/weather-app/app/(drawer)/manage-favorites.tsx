import { StyleSheet, Text, View, Pressable, Modal, TextInput, ActivityIndicator, FlatList, Image, Alert } from 'react-native';
import { FavoritesContext, favorite } from '@/hooks/FavoritesContext';
import { useContext } from 'react';
import { WeatherContext } from '@/hooks/WeatherContext';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/components/useColorScheme';

export default function Favorites() {
    // get current color scheme
    const colorScheme = useColorScheme();

    const { favorites, favoritesLoading, favoriteErrorMessage, removeFromFavorites } = useContext(FavoritesContext);
    const { syncWeatherData } = useContext(WeatherContext);

    const router = useRouter();

    const handleFavoritePressed = async (item: favorite) => {
        await syncWeatherData(item);
        router.push("home/weather");
    };

    const styles = StyleSheet.create({
        favoriteContainer: {
            flex: 1,
            width: '100%',
            alignItems: 'flex-start',
            paddingHorizontal: 10,
            gap: 10,
            backgroundColor: colorScheme === "dark" ? "#000" : "#fff",
        },
        errorMessage: {
            color: 'gray',
            fontSize: 14,
            fontStyle: 'normal',
            fontWeight: '400',
        },
        separator: {
            height: 1,
            backgroundColor: '#ccc',
            width: "100%",
        },
        favoriteItem: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            width: '100%',
        },
        favoriteItemTouchableContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 10,
        },
        favoriteResultText: {
            flex: 1,
        },
        favoriteResultCity: {
            color: colorScheme === "dark" ? "#F3F3F3" : "#0C0C0C",
            fontSize: 16,
            fontStyle: 'normal',
            fontWeight: '700',
        },
        favoriteResultState: {
            color: colorScheme === "dark" ? "#DDD" : "#AAA",
            fontSize: 16,
            fontStyle: 'normal',
            fontWeight: '400',
        },
        removeButtonContainer: {
            justifyContent: 'center',
            alignItems: 'center',
            padding: 10,
        },
        removeButtonText: {
            color: colorScheme === "dark" ? "#66ffff" : "#0a84ff",
            fontSize: 16,
            fontStyle: 'normal',
            fontWeight: '400',
        },
    });

    const renderFavorite = ({ item }: { item: favorite }) => (
        <View style={styles.favoriteItem}>
            <View style={styles.favoriteItemTouchableContainer}>
            <Pressable onPress={ () => handleFavoritePressed(item) }>
                <View style={styles.favoriteResultText}>
                <Text style={styles.favoriteResultCity}>{item.city}</Text>
                <Text style={styles.favoriteResultState}>{item.state} ({item.zip})</Text>
                </View>
            </Pressable>
            </View>
            <View style={styles.removeButtonContainer}>
            <Pressable onPress={() => removeFromFavorites(item.zip)}>
                <Text style={styles.removeButtonText}>Remove</Text>
            </Pressable>
            </View>
        </View>
    );

    return (
        <View style={styles.favoriteContainer}>
            {favoritesLoading ? (
                <ActivityIndicator size="large" color="#eee" />
            ) : favoriteErrorMessage ? (
                <Text style={styles.errorMessage}>{favoriteErrorMessage}</Text>
            ) : favorites ? (
                <FlatList
                data={favorites}
                renderItem={renderFavorite}
                keyExtractor={(item) => item.zip}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                ListFooterComponent={() => <View style={styles.separator} />}
                />
            ) : null}
        </View>
    );
}