import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Alert, Dimensions } from 'react-native'
import { Input, Button, Icon, Avatar, Image } from "react-native-elements";
import * as MediaLibrary from 'expo-media-library'
import * as ImagePicker from 'expo-image-picker'

export default function AddRestaurantForm({ toastRef, setIsLoading, navigation }) {
    const [restaurantName, setRestaurantName] = useState('')
    const [restaurantAddress, setRestaurantAddress] = useState('')
    const [restaurantDescription, setRestaurantDescription] = useState('')
    const [imagesSelected, setImagesSelected] = useState([])

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
        </ScrollView>
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
    }
})
