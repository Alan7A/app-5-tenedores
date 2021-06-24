import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { AirbnbRating, Button, Input } from "react-native-elements";
import Toast from 'react-native-easy-toast';
import Loading from '../../components/Loading';
import { firebaseApp } from "../../utils/firebase";
import firebase from 'firebase/app'
import 'firebase/firestore'

const db = firebase.firestore(firebaseApp)

export default function AddReview({ navigation, route }) {
    const [rating, setRating] = useState(null)
    const [title, setTitle] = useState('')
    const [review, setReview] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const toastRef = useRef()

    const submitReview = () => {
        if (!rating) {
            toastRef.current.show('No has dado ninguna puntuación')
        } else if (!title) {
            toastRef.current.show('El título es obligatorio')
        } else if (!review) {
            toastRef.current.show('El comentario es obligatorio')
        } else {
            setIsLoading(true)
            const user = firebase.auth().currentUser
            const payload = {
                idUser: user.uid,
                avatarUser: user.photoURL,
                idRestaurant: route.params.id,
                title: title,
                review: review,
                rating: rating,
                createdAt: new Date()
            }

            db.collection('reviews').add(payload)
                .then(() => {
                    updateRestaurant()
                })
                .catch((err) => {
                    setIsLoading(false)
                    toastRef.current.show('Ha ocurrido un error al enviar el comentario')
                    console.log(err);
                })
        }
    }

    const updateRestaurant = () => {
        const restaurantRef = db.collection('restaurants').doc(route.params.id)

        restaurantRef.get().then((response) => {
            const restaurantData = response.data()
            console.log('RESTAURANT DATA >>>> ', restaurantData);
            const ratingTotal = restaurantData.ratingTotal + rating
            const ratingCount = restaurantData.ratingCount + 1
            ratingResult = ratingTotal / ratingCount

            restaurantRef.update({
                rating: ratingResult,
                ratingTotal,
                ratingCount
            })
            .then(() => {
                setIsLoading(false)
                navigation.goBack()
            })
        })
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={{ height: 110, backgroundColor: '#f2f2f2' }}>
                <AirbnbRating
                    count={5}
                    reviews={['Pésimo', 'Deficiente', 'Normal', 'Muy bueno', 'Excelente']}
                    defaultRating={0}
                    size={35}
                    onFinishRating={(value) => setRating(value)}
                />
            </View>
            <View style={{ flex: 1, alignItems: 'center', margin: 10, marginTop: 30 }}>
                <Input
                    placeholder='Título'
                    containerStyle={{ marginBottom: 10 }}
                    onChange={e => setTitle(e.nativeEvent.text)}
                />
                <Input
                    placeholder='Comentario'
                    multiline
                    inputContainerStyle={styles.inputComentario}
                    onChange={e => setReview(e.nativeEvent.text)}
                />
                <Button
                    title='Enviar comentario'
                    containerStyle={styles.btnEnviar}
                    buttonStyle={{ backgroundColor: '#00a680' }}
                    onPress={submitReview}
                />
            </View>
            <Toast ref={toastRef} position='center' opacity={0.9} />
            <Loading isVisible={isLoading} text='Enviando comentario' />
        </View>
    )
}

const styles = StyleSheet.create({
    inputComentario: {
        height: 100,
        width: '100%',
        padding: 0,
        margin: 0
    },
    btnEnviar: {
        flex: 1,
        justifyContent: 'flex-end',
        marginTop: 20,
        marginBottom: 10,
        width: '95%'
    }
})
