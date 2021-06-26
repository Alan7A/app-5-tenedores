import React, { useState, useCallback, useLayoutEffect, useEffect } from 'react'
import { StyleSheet, ScrollView, Dimensions, View, Text } from 'react-native'
import { Rating, ListItem, Icon } from "react-native-elements";
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-easy-toast';
import { firebaseApp } from "../../utils/firebase";
import firebase from 'firebase/app'
import 'firebase/firestore'
import Loading from "../../components/Loading";
import CarouselComponent from "../../components/CarouselComponent";
import Map from '../../components/Map';
import ReviewsList from '../../components/Restaurants/ReviewsList';
import { useRef } from 'react';

const db = firebase.firestore(firebaseApp)
const screenWidth = Dimensions.get('window').width

export default function Restaurant({ navigation, route }) {
    const { id, name } = route.params
    const [restaurant, setRestaurant] = useState(null)
    const [rating, setRating] = useState(0)
    const [isFavorite, setIsFavorite] = useState(false)
    const [userLogged, setUserLogged] = useState(false)

    toastRef = useRef()

    firebase.auth().onAuthStateChanged((user) => {
        user ? setUserLogged(true) : setUserLogged(false)
    })

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

    useEffect(() => {
        if (userLogged && restaurant) {
          db.collection("favorites")
            .where("idRestaurant", "==", restaurant.id)
            .where("idUser", "==", firebase.auth().currentUser.uid)
            .get()
            .then((response) => {
              if (response.docs.length === 1) {
                setIsFavorite(true);
              }
            });
        }
      }, [userLogged, restaurant]);

    const listInfo = [
        {
            text: restaurant?.address,
            iconType: 'material-community',
            iconName: 'map-marker',
            action: null
        }
    ]

    const addFavorite = () => {
        if (!userLogged) {
          toastRef.current.show(
            "Para usar el sistema de favoritos tienes que iniciar sesión"
          );
        } else {
          const payload = {
            idUser: firebase.auth().currentUser.uid,
            idRestaurant: restaurant.id,
          };
          db.collection("favorites")
            .add(payload)
            .then(() => {
              setIsFavorite(true);
              toastRef.current.show("Restaurante añadido a favoritos");
            })
            .catch(() => {
              toastRef.current.show("Error al añadir el restaurnate a favoritos");
            });
        }
      };
    
      const removeFavorite = () => {
        db.collection("favorites")
          .where("idRestaurant", "==", restaurant.id)
          .where("idUser", "==", firebase.auth().currentUser.uid)
          .get()
          .then((response) => {
            response.forEach((doc) => {
              const idFavorite = doc.id;
              db.collection("favorites")
                .doc(idFavorite)
                .delete()
                .then(() => {
                  setIsFavorite(false);
                  toastRef.current.show("Restaurante eliminado de favoritos");
                })
                .catch(() => {
                  toastRef.current.show(
                    "Error al eliminar el restaurante de favoritos"
                  );
                });
            });
          });
      };

    if (!restaurant) return (<Loading isVisible={true} text='Cargando...' />)

    return (
        <ScrollView styles={styles.viewBody}>
            <View style={styles.favorite}>
                <Icon
                    type='material-community'
                    name={isFavorite ? 'heart' : 'heart-outline'}
                    color={isFavorite ? '#f00' : '#000'}
                    onPress={isFavorite ? removeFavorite : addFavorite}
                    size={35}
                    underlayColor='transparent'
                />
            </View>

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
            <Toast ref={toastRef} position='center' opacity={0.9} />
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
    },
    favorite: {
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 2,
        backgroundColor: '#fff',
        borderBottomLeftRadius: 100,
        padding: 5,
        paddingLeft: 15
    }
})
