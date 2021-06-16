import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Avatar } from "react-native-elements";
import * as firebase from "firebase"
import * as MediaLibrary from 'expo-media-library'
import * as ImagePicker from 'expo-image-picker'

export default function UserInfo({ userInfo, toastRef, setLoading, setLoadingText }) {
    const { photoURL, displayName, email } = userInfo

    const changeAvatar = async () => {
        const resultPermission = await MediaLibrary.requestPermissionsAsync()
        console.log(resultPermission);

        if(resultPermission.status === 'denied') {
            toastRef.current.show('Es necesario aceptar los permisos de la galería')
        } else {
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3]
            })

            if(result.cancelled) {
                toastRef.current.show('Has cerrado la selección de imagen')
            } else {
                uploadImage(result.uri)
                .then(() => {
                    updatePhotoURL()
                })
                .catch(() => {
                    toastRef.current.show('Ocurrió un error al actualizar el avatar')
                })
            }
        }
    }

    const uploadImage = async (uri) => {
        setLoadingText('Actualizando imagen')
        setLoading(true)

        // Convertir la imagen a tipo blob por medio de la uri, asi lo require firebase
        const response = await fetch(uri)
        const blob = await response.blob()

        const ref = firebase.default.storage().ref().child('avatar/' + userInfo.uid)
        return ref.put(blob)
    }

    const updatePhotoURL = () => {
        firebase.default.storage().ref('avatar/' + userInfo.uid).getDownloadURL()
        .then( async response => {
            const update = {
                photoURL: response
            }
            await firebase.default.auth().currentUser.updateProfile(update)
            setLoading(false)
        })
        .catch(() => {
            setLoading(false)
            toastRef.current.show('Ocurrió un error al actualizar el avatar')
        })
    }

    return (
        <View style={styles.viewUserInfo}>
            <Avatar
                rounded
                size='large'
                containerStyle={styles.userInfoAvatar}
                source={photoURL ? { uri: photoURL } : require("../../../assets/img/avatar-default.jpg")}
            >
                <Avatar.Accessory size={26} onPress={changeAvatar} />
            </Avatar>
            <View>
                <Text style={styles.displayName}>
                    {displayName ? displayName : "Anónimo"}
                </Text>
                <Text>
                    {email ? email : 'Social Login'}
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    viewUserInfo: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        paddingTop: 30,
        paddingBottom: 30
    },
    userInfoAvatar: {
        backgroundColor: '#c3c3c3',
        marginRight: 20
    },
    displayName: {
        fontWeight: 'bold',
        paddingBottom: 5
    }
})