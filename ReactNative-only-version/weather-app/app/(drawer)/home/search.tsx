import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  ActivityIndicator,
  FlatList,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { search, WeatherContext } from "@/hooks/WeatherContext";
import { FavoritesContext } from "@/hooks/FavoritesContext";
import { favorite } from "@/hooks/FavoritesContext";
import { useColorScheme } from "@/components/useColorScheme";

function validateZipCode(zipCode: string): boolean {
  const zipCodePattern = /^\d{5}(-\d{4})?$/;
  return zipCode ? zipCodePattern.test(zipCode) : false;
}

function extractSearchResult(zipCode: string, data: any): search[] {
  return [
    {
      zip: zipCode,
      city: data.location.name,
      state: data.location.region,
    },
  ];
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function SearchScreen() {
  // get the current color scheme mode
  const colorScheme = useColorScheme();

  const [searchResultsloading, setSearchResultsLoading] =
    useState<boolean>(false);
  const [searchErrorMessage, setSearchErrorMessage] = useState<string>("");
  const [searchResults, setSearchResults] = useState<search[]>([]);
  const [zipCode, setZipCode] = useState<string>("");

  const router = useRouter();

  const { favorites, favoritesLoading, favoriteErrorMessage, removeFromFavorites } = useContext(FavoritesContext);
  const { loadWeatherDataByZip, syncWeatherData } = useContext(WeatherContext);

  const handleSearchResultPressed = async (item: search) => {
    await syncWeatherData(item);
    router.back();
  };

  const handleFavoritePressed = async (item: favorite) => {
    await syncWeatherData(item);
    router.back();
  };

  const renderResult = ({ item }: { item: search }) => (
    <Pressable
      style={styles.searchResultTouchableContainer}
      onPress={() => handleSearchResultPressed(item)}
    >
      <View style={styles.searchResultText}>
        <Text style={styles.searchResultCity}>{item.city}</Text>
        <Text style={styles.searchResultState}>
          {item.state} ({item.zip})
        </Text>
      </View>
    </Pressable>
  );

  const renderFavorite = ({ item }: { item: favorite }) => (
    <View style={styles.favoriteItem}>
      <View style={styles.favoriteItemTouchableContainer}>
        <Pressable onPress={() => handleFavoritePressed(item)}>
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

  const handleZipCodeChange = (text: string) => {
    setZipCode(text);
    if (validateZipCode(text)) {
      setSearchResultsLoading(true);
      setSearchErrorMessage("");
      setSearchResults([]);
      fetchWeather(text);
    } else if (!text) {
      setSearchResults([]);
      setSearchErrorMessage("");
    }
  };

  // Function to fetch weather data from API
  const fetchWeather = async (zip: string) => {
    setSearchResultsLoading(true);
    setSearchErrorMessage("");
    try {
      const data = await loadWeatherDataByZip(zip);
      await delay(2000);
      setSearchResults(extractSearchResult(zip, data));
    } catch (error: any) {
      await delay(2000);
      setSearchErrorMessage("An error occurred: " + error.message);
    } finally {
      setSearchResultsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "flex-start",
      backgroundColor: colorScheme === "dark" ? "#000" : "#fff",
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "flex-start",
      marginLeft: 30,
      width: "100%",
    },
    searchBarContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colorScheme === "dark" ? "#fff" : "#f0f0f0",
      borderRadius: 4,
      padding: 5,
      width: "70%",
      marginTop: 20,
      gap: 10,
    },
    zipCodeInput: {
      width: "60%",
      backgroundColor: colorScheme === "dark" ? "#fff" : "#eee",
      borderRadius: 4,
    },
    searchText: {
      color: colorScheme === "dark" ? "#fcfcfc" : "rgba(85, 85, 85, 0.33)",
      fontSize: 14,
      fontStyle: "normal",
      fontWeight: "400",
      marginLeft: 15,
    },
    cancelText: {
      color: colorScheme === "dark" ? "#66ffff" : "#0a84ff",
      fontSize: 16,
      fontStyle: "normal",
      fontWeight: "400",
      marginLeft: 100,
    },
    errorMessage: {
      color: colorScheme === "dark" ? "#ffffff" : "#gray",
      fontSize: 14,
      fontStyle: "normal",
      fontWeight: "400",
    },
    searchResultContainer: {
      marginTop: 20,
      alignItems: "flex-start",
      justifyContent: "flex-start",
      width: "100%",
      paddingHorizontal: 20,
      gap: 10,
    },
    searchResultText: {
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "flex-start",
      width: "100%",
    },
    searchResultTitle: {
      color: colorScheme === "dark" ? "#ffffff" : "#0C0C0C",
      fontSize: 20,
      fontStyle: "normal",
      fontWeight: "400",
    },
    searchResultTouchableContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      padding: 5,
      paddingLeft: 10,
    },
    searchResultCity: {
      color: colorScheme === "dark" ? "#ffffff" : "#0C0C0C",
      fontSize: 16,
      fontStyle: "normal",
      fontWeight: "700",
      width: "100%",
    },
    searchResultState: {
      color: colorScheme === "dark" ? "#DDD" : "#AAA",
      fontSize: 16,
      fontStyle: "normal",
      fontWeight: "400",
      width: "100%",
    },
    favoriteContainer: { 
      marginTop: 60,
      width: '100%',
      alignItems: 'flex-start',
      paddingHorizontal: 20,
      gap: 10,
    },
    initialSeparator: {
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      gap: 53,
    },
    separator: {
      height: 1,
      backgroundColor: "#ccc",
      width: "100%",
    },
    favoriteTitle: {
      color: colorScheme === "dark" ? "#ffffff" : "#0C0C0C",
      fontSize: 20,
      fontStyle: 'normal',
      fontWeight: '400',
    },
    favoriteResultText: {
      flex: 1,
    },
    favoriteResultCity: {
      color: colorScheme === "dark" ? "#ffffff" : "#0C0C0C",
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
  });  

  return (
    <View style={styles.modalContainer}>
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBarContainer}>
          <FontAwesome name="search" size={16} color={ colorScheme === "dark" ? "rgba(170, 170, 170, 0.67)" : "rgba(85, 85, 85, 0.33)"} />
          <TextInput
            style={styles.zipCodeInput}
            placeholder="Enter a Zip Code"
            placeholderTextColor={colorScheme === "dark" ? "#999" : "rgba(85, 85, 85, 0.33)"}
            value={zipCode}
            onChangeText={handleZipCodeChange}
            keyboardType="default"
          />
          <Pressable onPress={handleCancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
      {/* Search Results */}
      <View style={styles.searchResultContainer}>
        <Text style={styles.searchResultTitle}>Search Results: </Text>
        {searchResultsloading ? (
          <ActivityIndicator size="large" color={colorScheme === "dark" ? "#fff" : "#eee"} />
        ) : searchErrorMessage ? (
          <Text style={styles.errorMessage}>{searchErrorMessage}</Text>
        ) : searchResults.length > 0 ? (
          <FlatList
            data={searchResults}
            renderItem={renderResult}
            keyExtractor={(item) => item.zip}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListHeaderComponent={() => <View style={styles.separator} />}
            ListFooterComponent={() => <View style={styles.separator} />}
          />
        ) : (
          <>
            <View style={styles.initialSeparator}>
              <View style={styles.separator} />
              <View style={styles.separator} />
            </View>
          </>
        )}
      </View>
      {/* Favorites List */}
      <View style={styles.favoriteContainer}>
        <Text style={styles.favoriteTitle}>Favorites: </Text>
        {favoritesLoading ? (
          <ActivityIndicator size="large" color={colorScheme === "dark" ? "#fff" : "#eee"} />
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
    </View>
  );
}