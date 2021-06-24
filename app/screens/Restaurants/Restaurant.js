import React, { useState, useCallback, useLayoutEffect } from 'react'
import { StyleSheet, ScrollView, Dimensions, View, Text } from 'react-native'
import { Rating, ListItem, Icon } from "react-native-elements";
import { useFocusEffect } from '@react-navigation/native';
import { firebaseApp } from "../../utils/firebase";
import firebase from 'firebase/app'
import 'firebase/firestore'
import Loading from "../../components/Loading";
import CarouselComponent from "../../components/CarouselComponent";
import Map from '../../components/Map';
import ReviewsList from '../../components/Restaurants/ReviewsList';

const db = firebase.firestore(firebaseApp)
const screenWidth = Dimensions.get('window').width

export default function Restaurant({ navigation, route }) {
    const { id, name } = route.params
    const [restaurant, setRestaurant] = useState(null)
    const [rating, setRating] = useState(0)

    useLayoutEffect(() => {
        navigation.setOptions({ title: name })
    })

    useFocusEffect(
        useCallback(() => {
            db.collection('restaurants').doc(id).get()
                .then((response) => {
                    const data = response.data()
                    data.id = id
                    setRestaurant(data)
                    setRating(data.rating)
                })
        }, [])
    );

    const listInfo = [
        {
            text: restaurant?.address,
            iconType: 'material-community',
            iconName: 'map-marker',
            action: null
        }
    ]

    if (!restaurant) return (<Loading isVisible={true} text='Cargando...' />)

    return (
        <ScrollView styles={styles.viewBody}>
            <CarouselComponent images={restaurant.images} height={250} width={screenWidth} />

            {/* Title, description and rating */}
            <View style={{ padding: 15 }}>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                        {restaurant.name}
                    </Text>
                    <Rating
                        style={styles.rating}
                        imageSize={20}
                        readonly
                        startingValue={parseFloat(restaurant.rating)}
                        type='custom'
                        tintColor='#f2f2f2'
                    />
                </View>
                <Text style={{ marginTop: 5, color: 'gray' }}>
                    {restaurant.description}
                </Text>
            </View>

            {/* Map */}
            <View style={{ margin: 15, marginTop: 25 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
                    Información sobre el restaurante
                </Text>
                <Map
                    location={restaurant.location}
                    name={restaurant.name}
                    height={130}
                />
            </View>

            <View>
                {listInfo.map((item, i) => (
                    <ListItem key={i} bottomDivider>
                        <Icon
                            type={item.iconType}
                            name={item.iconName}
                            color='#00a680'
                        />
                        <ListItem.Title>{item.text}</ListItem.Title>
                    </ListItem>
                ))}
            </View>

            <ReviewsList
                navigation={navigation}
                id={restaurant.id}
                setRating={setRating}
            />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: '#fff'
    },
    rating: {
        position: 'absolute',
        right: 0,
    }
})
