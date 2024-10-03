import { ForecastContext } from "@/hooks/ForecastContext";
import { useRouter } from "expo-router";
import { useContext } from "react";
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    Image,
  } from "react-native";
import { forecast } from "@/hooks/ForecastContext";
import { useColorScheme } from "@/components/useColorScheme";

function formatDate(date: string) {
    const dateString = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
        month: "short",
        day: "numeric",
    };
    return dateString.toLocaleDateString("en-US", options);
}

export default function HourlyForecastScreen() {
    // get current color scheme
    const colorScheme = useColorScheme();

    const { date, hourlyForecasts, loadForecast } = useContext(ForecastContext);

    const styles = StyleSheet.create({
        hourlyForecastContainer: {
            flex: 1,
            backgroundColor: colorScheme === "dark" ? "#000" : "#fff",
            alignItems: "center",
            justifyContent: "flex-start",
            width: "100%",
        },
        dateTitle: {
            color: colorScheme === "dark" ? "#F3F3F3" : "#0C0C0C",
            fontSize: 20,
            fontStyle: "normal",
            fontWeight: "700",
            marginTop: 10,
        },
        hourlyForecastItemContainer: {
            width: "90%",
            borderRadius: 10,
            backgroundColor: colorScheme === "dark" ? "#3cff00" : "#A7D3ff",
            alignSelf: "center",
            gap: 10,
        },
        hourlyForecastItem: {
            flexDirection: "row",
            padding: 10,
            justifyContent: "space-between",
            gap: 10,
        },
        hourTitle: {
            color: "#0C0C0C",
            fontSize: 20,
            fontFamily: "Inter",
            fontWeight: "400",
            fontStyle: "normal",
        },
        hourlyConditionIcon: {
            width: 32,
            height: 32,
        },
        hourlyTemp: {
            color: "#0C0C0C",
            fontFamily: "Inter",
            fontSize: 20,
            fontWeight: "400",
            fontStyle: "normal",
        },
        hourlyHumidity: {
            color: "#0C0C0C",
            fontFamily: "Inter",
            fontSize: 20,
            fontWeight: "400",
            fontStyle: "normal",
        }
    });

    const renderHourlyForecast = ({ item }: { item: forecast }) => (
        <View style={styles.hourlyForecastItemContainer}>
            <View style={styles.hourlyForecastItem}>
                <Text style={styles.hourTitle}>{item.hour}</Text>
                <Image style={styles.hourlyConditionIcon} source={{ uri: item.icon }}/>
                <Text style={styles.hourlyTemp}>{item.temp_f}°F</Text>
                <Text style={styles.hourlyHumidity}>{item.humidity}%</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.hourlyForecastContainer}>
            <Text style={styles.dateTitle}>{formatDate(date)}</Text>
            <FlatList
                data={hourlyForecasts}
                renderItem={renderHourlyForecast}
                keyExtractor={(item) => item.hour}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                style={{ flex: 1, width: "100%", marginTop: 10, marginBottom: 10 }}
            />
        </View>
    );
}