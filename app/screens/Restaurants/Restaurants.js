import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Icon } from "react-native-elements";
import { useFocusEffect } from '@react-navigation/native';
import firebase from 'firebase/app'
import 'firebase/firestore'
import { firebaseApp } from "../../utils/firebase";
import RestaurantsList from '../../components/Restaurants/RestaurantsList';

const db = firebase.firestore(firebaseApp)

export default function Restaurants({ navigation }) {
    const [user, setUser] = useState(null)
    const [restaurants, setRestaurants] = useState([])
    const [restaurantsCount, setRestaurantsCount] = useState(0)
    const [startRestaurants, setStartRestaurants] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const restaurantsToLoad = 8

    useEffect(() => {
        firebase.auth().onAuthStateChanged(userInfo => {
            setUser(userInfo)
        })
    }, [])

    useFocusEffect(
        useCallback(() => {
            db.collection('restaurants').get()
                .then((snap) => {
                    setRestaurantsCount(snap.size)
                })

            const resultRestaurants = []

            db.collection('restaurants').orderBy('createdAt', 'desc').limit(restaurantsToLoad).get()
                .then(result => {
                    // Guardar el útlimo restaurant cargado para cuando se carguen más empezar desde ahí
                    setStartRestaurants(result.docs[result.docs.length - 1]);

                    result.forEach((doc) => {
                        const restaurant = doc.data()
                        restaurant.id = doc.id
                        resultRestaurants.push(restaurant)
                    })
                    setRestaurants(resultRestaurants)
                })
        }, [])
    )

    const handleLoadMore = () => {
        const resultRestaurants = []
        restaurants.length < restaurantsCount && setIsLoading(true)

        db.collection('restaurants')
            .orderBy('createdAt', 'desc')
            .startAfter(startRestaurants.data().createdAt)
            .limit(restaurantsToLoad).get()
            .then((result) => {
                if (result.docs.length > 0) {
                    setStartRestaurants(result.docs[result.docs.length - 1])
                } else {
                    setIsLoading(false)
                }

                result.forEach((doc) => {
                    const restaurant = doc.data()
                    restaurant.id = doc.id
                    resultRestaurants.push(restaurant)
                })
                setRestaurants([...restaurants, ...resultRestaurants])
            })
    }

    return (
        <View style={styles.viewBody}>
            <RestaurantsList restaurants={restaurants} handleLoadMore={handleLoadMore} isLoading={isLoading} />

            {user && (
                <Icon
                    type='material-community'
                    name='plus'
                    color='#00a680'
                    reverse
                    containerStyle={styles.btnContainer}
                    onPress={() => navigation.navigate('AddRestaurant')}
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: '#fff'
    },
    btnContainer: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        shadowColor: 'black',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.5
    }
})
