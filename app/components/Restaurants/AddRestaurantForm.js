import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Alert, Dimensions } from 'react-native'
import { Input, Button, Icon, Avatar, Image } from "react-native-elements";
import * as MediaLibrary from 'expo-media-library'
import * as ImagePicker from 'expo-image-picker'
import * as Location from 'expo-location'
import MapView, { Marker } from 'react-native-maps'
import Modal from '../Modal'

const screenWidth = Dimensions.get('window').width

export default function AddRestaurantForm({ toastRef, setIsLoading, navigation }) {
    const [restaurantName, setRestaurantName] = useState('')
    const [restaurantAddress, setRestaurantAddress] = useState('')
    const [restaurantDescription, setRestaurantDescription] = useState('')
    const [imagesSelected, setImagesSelected] = useState([])
    const [isMapVisible, setIsMapVisible] = useState(false)
    const [restaurantLocation, setRestaurantLocation] = useState(null)

    const addRestaurant = () => {
        console.log(imagesSelected);
    }

    const selectImage = async () => {
        const resultPermission = await MediaLibrary.requestPermissionsAsync()
        console.log(resultPermission);

        if (resultPermission.status === 'denied') {
            toastRef.current.show('Es necesario aceptar los permisos de la galería', 3000)
        } else {
            const result = await ImagePicker.launchImageLibraryAsync()

            if (result.cancelled) {
                toastRef.current.show('Has cerrado la selección de imagen')
            } else {
                setImagesSelected([...imagesSelected, result.uri])
            }
        }
    }

    const removeImage = (image) => {
        Alert.alert(
            'Eliminar imagen',
            '¿Estás seguro que quieres eliminar la imagen?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Eliminar',
                    onPress: () => {
                        setImagesSelected(imagesSelected.filter((imageUrl) => imageUrl !== image))
                    }
                }
            ],
            { cancelable: false }
        )
    }

    return (
        <ScrollView style={styles.scrollView}>
            <View style={styles.viewPhoto}>
                <Image
                    source={imagesSelected[0] ? { uri: imagesSelected[0] } : require('../../../assets/img/no-image.png')}
                    style={{ width: screenWidth, height: 200 }}
                />
            </View>

            <View style={styles.viewForm}>
                <Input
                    placeholder='Nombre del restaurante'
                    containerStyle={styles.input}
                    onChange={e => setRestaurantName(e.nativeEvent.text)}
                />
                <Input
                    placeholder='Dirección'
                    containerStyle={styles.input}
                    onChange={e => setRestaurantAddress(e.nativeEvent.text)}
                    rightIcon={{
                        type: 'material-community',
                        name: 'google-maps',
                        color: '#c2c2c2',
                        onPress: () => setIsMapVisible(true)
                    }}
                />
                <Input
                    placeholder='Descripción del restaurante'
                    multiline
                    inputContainerStyle={styles.textArea}
                    containerStyle={styles.input}
                    onChange={e => setRestaurantDescription(e.nativeEvent.text)}
                />
            </View>

            <View style={styles.viewAddImages} >
                {imagesSelected.length < 4 && (
                    <Icon
                        type='material-community'
                        name='image-search-outline'
                        color='#7a7a7a'
                        size={36}
                        containerStyle={styles.containerIcon}
                        onPress={selectImage}
                    />
                )}

                {imagesSelected.map((image, i) => (
                    <Avatar
                        key={i}
                        style={styles.thumbnail}
                        source={{ uri: image }}
                        onPress={() => removeImage(image)}
                    />
                ))}
            </View>

            <Button
                title='Crear Restaurante'
                onPress={addRestaurant}
                buttonStyle={styles.btnAddRestaurant}
            />
            <Map
                isMapVisible={isMapVisible}
                setIsMapVisible={setIsMapVisible}
                setRestaurantLocation={setRestaurantLocation}
                toastRef={toastRef}
            />
        </ScrollView>
    )
}

function Map({ isMapVisible, setIsMapVisible, setRestaurantLocation, toastRef }) {
    const [location, setLocation] = useState(null)

    useEffect(() => {
        (async () => {
            const permission = await Location.requestForegroundPermissionsAsync()
            if (permission.status !== 'granted') {
                toastRef.current.show('Tienes que aceptar los permisos de geolocalización para seleccionar la dirección', 4000)
            } else {
                const loc = await Location.getCurrentPositionAsync({})
                setLocation({
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude,
                    latitudeDelta: 0.001,
                    longitudeDelta: 0.001
                })
            }
        })()
    }, [])

    const saveLocation = () => {
        setRestaurantLocation(location)
        toastRef.current.show('Ubicación guardada correctamente')
        setIsMapVisible(false)
    }

    return (
        <Modal isVisible={isMapVisible} setIsVisible={setIsMapVisible}>
            <View>
                {location && (
                    <MapView
                        style={styles.mapStyle}
                        initialRegion={location}
                        showsUserLocation
                        onRegionChange={(region) => setLocation(region)}
                    >
                        <Marker

                            coordinate={{
                                latitude: location.latitude,
                                longitude: location.longitude
                            }}
                            draggable
                        />
                    </MapView>
                )}
                <View style={styles.viewMapBtn}>
                    <Button
                        title='Guardar Ubicación'
                        containerStyle={styles.btnGuardarUbiContainer}
                        buttonStyle={styles.btnAceptarUbi}
                        onPress={saveLocation}
                    />
                    <Button
                        title='Cancelar Ubicación'
                        containerStyle={styles.btnCancelarUbiContainer}
                        buttonStyle={styles.btnCancelarUbi}
                        onPress={() => setIsMapVisible(false)}
                    />
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        height: '100%'
    },
    viewForm: {
        marginLeft: 10,
        marginRight: 10
    },
    input: {
        marginBottom: 10,
    },
    textArea: {
        height: 100,
        width: '100%',
        padding: 0,
        margin: 0
    },
    btnAddRestaurant: {
        backgroundColor: '#00a680',
        marginLeft: 20,
        marginRight: 20
    },
    viewAddImages: {
        flexDirection: 'row',
        marginLeft: 20,
        marginRight: 20,
        marginTop: 30
    },
    containerIcon: {
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        height: 70,
        width: 70,
        backgroundColor: '#e3e3e3',
        marginBottom: 20
    },
    thumbnail: {
        width: 70,
        height: 70,
        marginRight: 10
    },
    viewPhoto: {
        alignItems: 'center',
        height: 200,
        marginBottom: 20
    },
    mapStyle: {
        width: '100%',
        height: 550
    },
    viewMapBtn: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10
    },
    btnCancelarUbiContainer: {
        paddingLeft: 5
    },
    btnCancelarUbi: {
        backgroundColor: '#a60d0d'
    },
    btnGuardarUbiContainer: {
        paddingRight: 5
    },
    btnGuardarUbi: {
        backgroundColor: '#00a680'
    }
})
