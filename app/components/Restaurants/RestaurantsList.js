import React from 'react'
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native'
import { Image } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'

export default function RestaurantsList({ restaurants, handleLoadMore, isLoading }) {
    const navigation = useNavigation()

    return (
        <View>
            {restaurants.length > 0 ? (
                <FlatList
                    data={restaurants}
                    renderItem={(restaurant) => <RestaurantItem restaurant={restaurant} navigation={navigation} />}
                    keyExtractor={(item, i) => i.toString()}
                    ListFooterComponent={<ListFooter isLoading={isLoading} />}
                    onEndReachedThreshold={0.5}
                    onEndReached={handleLoadMore}
                />
            ) : (
                <View style={styles.loader}>
                    <ActivityIndicator size='large' color='#00a680' />
                    <Text>Cargando restaurantes</Text>
                </View>
            )}
        </View>
    )
}

function RestaurantItem({ restaurant, navigation }) {
    const { images, id, name, address, description } = restaurant.item

    const openRestaurant = () => {
        navigation.navigate('Restaurant', {
            id,
            name
        })
    }

    return (
        <TouchableOpacity onPress={openRestaurant}>
            <View style={styles.viewRestaurant}>
                <View style={styles.restaurantImage}>
                    <Image 
                        resizeMode='cover'
                        PlaceholderContent={<ActivityIndicator size='large' color='#00a680' />}
                        source={ images[0] ?  { uri: images[0] } : require('../../../assets/img/no-image.png')}
                        style={styles.image}
                    />
                </View>
                <View>
                    <Text style={styles.restaurantName}>{name}</Text>
                    <Text style={styles.restaurantAddress}>{address}</Text>
                    <Text style={styles.restaurantDescription}>{description.substr(0, 60)}...</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

function ListFooter({ isLoading }) {
    if(isLoading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size='large' color='#00a680' />
            </View>
        )
    } else {
        return (
            <View style={{marginTop: 10, marginBottom: 20, alignItems:'center'}}>
                <Text>No quedan más restaurantes por cargar</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    loader: {
        marginTop: 10,
        marginBottom: 10,
        alignItems: 'center'
    },
    viewRestaurant: {
        flexDirection: 'row',
        margin: 10
    },
    restaurantImage: {
        marginRight: 15
    },
    image: {
        width: 80,
        height: 80
    },
    restaurantName: {
        fontWeight: 'bold'
    },
    restaurantAddress: {
        paddingTop: 2,
        color: 'grey'
    },
    restaurantDescription: {
        paddingTop: 2,
        color: 'grey',
        width: 300
    }
})
