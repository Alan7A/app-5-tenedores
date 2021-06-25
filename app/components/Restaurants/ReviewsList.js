import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button, Avatar, Rating } from "react-native-elements";
import { firebaseApp } from "../../utils/firebase";
import firebase from 'firebase/app'
import 'firebase/firestore'

const db = firebase.firestore(firebaseApp)

export default function ReviewsList({ navigation, id }) {
    const [userLogged, setUserLogged] = useState(false)
    const [reviews, setReviews] = useState([])

    firebase.auth().onAuthStateChanged(user => {
        user ? setUserLogged(true) : setUserLogged(false)
    })

    useEffect(() => {
        db.collection('reviews')
            .where('idRestaurant', '==', id).get()
            .then((response) => {
                const resultReviews = []
                response.forEach((doc) => {
                    const data = doc.data()
                    data.id = doc.id
                    resultReviews.push(data)
                })
                setReviews(resultReviews)
            })
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

            {reviews.map((review, i) => (
                <ListItem key={i} review={review} />
            ))}
        </View>
    )
}

function ListItem(props) {
    const { title, review, rating, createdAt, avatarUser } = props.review
    const reviewDate = new Date(createdAt.seconds * 1000)

    return (
        <View style={styles.listItem}>
            <View style={{ marginRight: 15 }}>
                <Avatar
                    size='large'
                    rounded
                    containerStyle={{ width: 50, height: 50 }}
                    source={avatarUser ? { uri: avatarUser } : require('../../../assets/img/avatar-default.jpg')}
                />
            </View>
            <View style={{ flex: 1, alignItems: 'flex-start' }}>
                <Text style={{ fontWeight: 'bold' }}>{title}</Text>
                <Text style={styles.review}>{review}</Text>
                <Rating
                    imageSize={15}
                    startingValue={rating}
                    readonly
                    type='custom'
                    tintColor='#f2f2f2'
                />
                <Text style={styles.date}>
                    {reviewDate.getDate()}/{reviewDate.getMonth() + 1}/{reviewDate.getFullYear()}
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    listItem: {
        flexDirection: 'row',
        padding: 10,
        paddingBottom: 20,
        borderBottomColor: '#e3e3e3',
        borderBottomWidth: 1
    },
    review: {
        paddingTop: 2,
        color: 'grey',
        marginBottom: 5
    },
    date: {
        marginTop: 5,
        color: 'grey',
        fontSize: 12,
        position: 'absolute',
        right: 0,
        bottom: 0
    }
})
