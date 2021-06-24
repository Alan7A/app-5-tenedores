import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button, Avatar, Rating } from "react-native-elements";
import { firebaseApp } from "../../utils/firebase";
import firebase from 'firebase/app'

const db = firebase.firestore(firebaseApp)

export default function ReviewsList({ navigation, id, setRating }) {
    const [userLogged, setUserLogged] = useState(false)

    firebase.auth().onAuthStateChanged(user => {
        user ? setUserLogged(true) : setUserLogged(false)
    })

    return (
        <View>
            {userLogged ? (
                <Button
                    title='Escribe una opinión'
                    buttonStyle={{ backgroundColor: 'tansparent' }}
                    titleStyle={{ color: '#00a680' }}
                    icon={{
                        type: 'material-community',
                        name: 'square-edit-outline',
                        color: '#00a680'
                    }}
                    onPress={() => navigation.navigate('AddReview', { id: id })}
                />
            ) : (
                <View>
                    <Text
                        style={{ textAlign: 'center', color: '#00a680', padding: 20 }}
                        onPress={() => navigation.navigate('Login')}
                    >
                        Para escribir un comentario es necesario iniciar sesión{" "}
                        <Text style={{ fontWeight: 'bold' }}>
                            Pulsa aquí para iniciar sesión
                        </Text>
                    </Text>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({

})
