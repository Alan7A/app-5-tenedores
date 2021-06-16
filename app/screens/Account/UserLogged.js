import React, { useEffect, useRef, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Button } from "react-native-elements";
import * as firebase from 'firebase'
import Loading from "../../components/Loading";
import Toast from 'react-native-easy-toast';
import UserInfo from '../../components/Account/UserInfo';

export default function UserLogged() {
    const toastRef = useRef()

    const [loading, setLoading] = useState(false)
    const [loadingText, setLoadingText] = useState('')
    const [userInfo, setUserInfo] = useState(null)

    useEffect(() => {
        (async () => {
            const user = await firebase.default.auth().currentUser
            setUserInfo(user)
        })()
    }, [])

    return (
        <View style={styles.viewUserInfo}>
            {userInfo && <UserInfo
                userInfo={userInfo}
                toastRef={toastRef}
                setLoading={setLoading}
                setLoadingText={setLoadingText}
            />}
            <Text>Account options</Text>

            <Button
                title='Cerrar sesión'
                buttonStyle={styles.btnCloseSession}
                titleStyle={styles.btnCloseSessionText}
                onPress={() => firebase.default.auth().signOut()}
            />
            <Toast ref={toastRef} position='center' opacity={0.9} />
            <Loading isVisible={loading} text={loadingText} />
        </View>
    )
}

const styles = StyleSheet.create({
    viewUserInfo: {
        minHeight: '100%',
        backgroundColor: '#f2f2f2'
    },
    btnCloseSession: {
        marginTop: 30,
        borderRadius: 0,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e3e3e3',
        borderBottomWidth: 1,
        borderBottomColor: '#e3e3e3',
        paddingTop: 10,
        paddingBottom: 10
    },
    btnCloseSessionText: {
        color: '#00a680'
    }
})