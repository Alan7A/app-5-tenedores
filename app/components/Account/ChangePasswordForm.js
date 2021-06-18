import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Input, Button, Icon } from "react-native-elements";
import { reauthenticate } from '../../utils/api';
import * as firebase from 'firebase'

export default function ChangePasswordForm({ setShowModal, toastRef }) {
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState(initialForm)
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    const onChange = (e, type) => {
        setFormData({ ...formData, [type]: e.nativeEvent.text })
    }

    const onSubmit = async () => {
        let isSetErrors = true
        setErrors({})
        let errorsTemp = {}

        if (!formData.password || !formData.newPassword || !formData.repeatPassword) {
            errorsTemp = {
                password: !formData.password ? 'La contraseña no puede estar vacía' : '',
                newPassword: !formData.newPassword ? 'La contraseña no puede estar vacía' : '',
                repeatPassword: !formData.repeatPassword ? 'La contraseña no puede estar vacía' : ''
            }
        } else if (formData.newPassword !== formData.repeatPassword) {
            errorsTemp = {
                newPassword: 'Las contraseñas no son iguales',
                repeatPassword: 'Las contraseñas no son iguales'
            }
        } else if (formData.newPassword.length < 6) {
            errorsTemp = {
                newPassword: 'La contraseña tiene que ser mayor a 5 caracteres',
                repeatPassword: 'La contraseña tiene que ser mayor a 5 caracteres'
            }
        } else {
            setIsLoading(true)
            await reauthenticate(formData.password)
            .then(async () => {
                await firebase.default.auth().currentUser.updatePassword(formData.newPassword)
                .then(() => {
                    isSetErrors = false
                    setIsLoading(false)
                    setShowModal(false)
                    firebase.default.auth().signOut()
                })
                .catch(() => {
                    errorsTemp = {
                        other: 'Error al actualizar la contraseña'
                    }
                    setIsLoading(false)
                })
            })
            .catch((err) => {
                console.log(err);
                errorsTemp = {
                    password: 'La contraseña no es correcta'
                }
                setIsLoading(false)
            })
        }

        isSetErrors && setErrors(errorsTemp)
    }

    return (
        <View style={styles.view}>
            <Input
                placeholder='Contraseña actual'
                containerStyle={styles.input}
                secureTextEntry={!showPassword}
                rightIcon={
                    <Icon
                        type='material-community'
                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                        color='#c2c2c2'
                        onPress={() => setShowPassword(!showPassword)}
                    />
                }
                onChange={e => onChange(e, 'password')}
                errorMessage={errors.password}
            />
            <Input
                placeholder='Nueva contraseña'
                containerStyle={styles.input}
                secureTextEntry={!showPassword}
                rightIcon={
                    <Icon
                        type='material-community'
                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                        color='#c2c2c2'
                        onPress={() => setShowPassword(!showPassword)}
                    />
                }
                onChange={e => onChange(e, 'newPassword')}
                errorMessage={errors.newPassword}
            />
            <Input
                placeholder='Repetir nueva contraseña'
                containerStyle={styles.input}
                secureTextEntry={!showPassword}
                rightIcon={
                    <Icon
                        type='material-community'
                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                        color='#c2c2c2'
                        onPress={() => setShowPassword(!showPassword)}
                    />
                }
                onChange={e => onChange(e, 'repeatPassword')}
                errorMessage={errors.repeatPassword}
            />
            <Button
                title='Cambiar contraseña'
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                loading={isLoading}
                onPress={onSubmit}
            />
            <Text>{errors.other}</Text>
        </View>
    )
}

const initialForm = {
    password: '',
    newPassword: '',
    repeatPassword: ''
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