import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { Input, Button, Icon } from "react-native-elements";
import * as firebase from 'firebase'
import { validateEmail } from "../../utils/validations";
import { reauthenticate } from "../../utils/api";

export default function ChangeEmailForm({ email, setShowModal, toastRef, setReloadUserInfo }) {
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState(defaultFormValue)
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    const onChange = (e, type) => {
        setFormData({ ...formData, [type]: e.nativeEvent.text })
    }

    const onSubmit = () => {
        setErrors({})
        if (!formData.email || email === formData.email) {
            setErrors({
                email: 'El email no ha cambiado'
            })
        } else if (!validateEmail(formData.email)) {
            setErrors({
                email: 'Email incorrecto'
            })
        } else if (!formData.password) {
            setErrors({
                password: 'La contraseña no puede estar vacía'
            })
        } else {
            setIsLoading(true)
            reauthenticate(formData.password)
                .then(response => {
                    firebase.default.auth().currentUser.updateEmail(formData.email)
                        .then(() => {
                            setIsLoading(false)
                            setReloadUserInfo(true)
                            toastRef.current.show('Email actualizado correctamente')
                            setShowModal(false)
                        })
                        .catch(() => {
                            setIsLoading(false)
                            setErrors({
                                email: 'Error al actualizar el email'
                            })
                        })
                })
                .catch(() => {
                    setIsLoading(false)
                    setErrors({
                        password: 'La contraseña es incorrecta'
                    })
                })
        }
    }

    return (
        <View>
            <Input
                placeholder='Correo electrónico'
                containerStyle={styles.input}
                rightIcon={{
                    type: 'material-community',
                    name: 'account-circle-outline',
                    color: '#c2c2c2'
                }}
                defaultValue={email}
                onChange={e => onChange(e, 'email')}
                errorMessage={errors.email}
            />
            <Input
                placeholder='Contraseña'
                containerStyle={styles.input}
                secureTextEntry={!showPassword}
                rightIcon={
                    <Icon
                        type='material-community'
                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                        iconStyle={styles.iconRight}
                        onPress={() => setShowPassword(!showPassword)}
                    />
                }
                errorMessage={errors.password}
                onChange={e => onChange(e, 'password')}
            />
            <Button
                title='Cambiar email'
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                loading={isLoading}
                onPress={onSubmit}
            />
        </View>
    )
}

const defaultFormValue = {
    email: '',
    password: ''
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