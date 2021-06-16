import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { Input, Button, } from "react-native-elements";
import * as firebase from 'firebase'

export default function ChangeDisplayNameForm({ displayName, setShowModal, toastRef, setReloadUserInfo }) {
    const [newDisplayName, setNewDisplayName] = useState('')
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const onSubmit = () => {
        setError(null)
        if (!newDisplayName) {
            setError('El nombre no puede estar vacío')
        } else if (displayName === newDisplayName) {
            setError('El nombre no puede ser igual al actual')
        } else {
            setIsLoading(true)
            firebase.default.auth().currentUser.updateProfile({ displayName: newDisplayName })
            .then(() => {
                setIsLoading(false)
                setReloadUserInfo(true)
                setShowModal(false)
            })
            .catch(() => {
                setError('Error al actualizar el nombre')
                setIsLoading(false)
            })
        }
    }

    return (
        <View style={styles.view}>
            <Input
                placeholder='Nombre y apellidos'
                containerStyle={styles.input}
                rightIcon={{
                    type: 'material-community',
                    name: 'account-circle-outline',
                    color: '#c2c2c2'
                }}
                defaultValue={displayName || ""}
                onChange={e => setNewDisplayName(e.nativeEvent.text)}
                errorMessage={error}
            />
            <Button
                title='Cambiar nombre'
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                loading={isLoading}
                onPress={onSubmit}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    view: {
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 10
    },
    input: {
        marginBottom: 10,
    },
    btnContainer: {
        width: '95%'
    },
    btn: {
        backgroundColor: '#00a680'
    }
})