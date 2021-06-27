import React, { useState, useEffect } from "react";
import { StyleSheet, View, FlatList, Image } from "react-native";
import { SearchBar, ListItem, Icon, Avatar } from "react-native-elements";
import { FireSQL } from "firesql";
import firebase from "firebase/app";

const fireSQL = new FireSQL(firebase.firestore(), { includeId: "id" });

export default function Search({ navigation }) {
    const [search, setSearch] = useState("");
    const [restaurants, setRestaurants] = useState([]);

    useEffect(() => {
        if (search) {
            fireSQL
                .query(`SELECT * FROM restaurants WHERE name LIKE '${search}%'`)
                .then((response) => {
                    setRestaurants(response);
                });
        }
    }, [search]);

    return (
        <View>
            <SearchBar
                placeholder="Busca tu restaurante..."
                value={search}
                onChangeText={(e) => setSearch(e)}
                lightTheme
                round
            />
            {restaurants.length === 0 ? (
                <NoFoundRestaurants />
            ) : (
                <FlatList
                    keyExtractor={(item, index) => index.toString()}
                    data={restaurants}
                    renderItem={(restaurant) => (
                        <Restaurant restaurant={restaurant} navigation={navigation} />
                    )}
                />
            )}
        </View>
    );
}

function NoFoundRestaurants() {
    return (
        <View style={{ flex: 1, alignItems: "center" }}>
            <Image
                source={require("../../assets/img/no-result-found.png")}
                resizeMode="cover"
                style={{ width: 200, height: 200 }}
            />
        </View>
    );
}

function Restaurant(props) {
    const { restaurant, navigation } = props;
    const { id, name, images } = restaurant.item;

    return (
        <ListItem
            bottomDivider
            onPress={() =>
                navigation.navigate("Restaurants", {
                    screen: "Restaurant",
                    params: { id, name },
                })
            }
        >
            <Avatar
                rounded
                source={images[0] ? { uri: images[0] } : require("../../assets/img/no-image.png")}
            />
            <ListItem.Content>
                <ListItem.Title>{name}</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
        </ListItem>
    );
}

const styles = StyleSheet.create({
    searchBar: {
        marginBottom: 20,
    },
});