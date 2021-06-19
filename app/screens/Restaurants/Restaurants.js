import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Icon } from "react-native-elements";
import firebase from 'firebase/app'

export default function Restaurants({ navigation }) {
    const [user, setUser] = useState(null)

    useEffect(() => {
        firebase.auth().onAuthStateChanged(userInfo => {
            setUser(userInfo)
        })
    }, [])

    return (
        <View style={styles.viewBody}>
            <Text>Restaurants</Text>

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
