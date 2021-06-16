import { isEmpty } from 'lodash';
import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { Input, Icon, Button } from "react-native-elements";
import * as firebase from 'firebase'
import { validateEmail } from "../../utils/validations";
import { useNavigation } from '@react-navigation/native';
import Loading from "../Loading";

export default function LoginForm({ toastRef }) {
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState(defaultFormValue)
    const [loading, setLoading] = useState(false)

    const navigation = useNavigation()

    const onChange = (e, type) => {
        setFormData({ ...formData, [type]: e.nativeEvent.text })
    }

    const onSubmit = () => {
        if (isEmpty(formData.email) || isEmpty(formData.password)) {
            toastRef.current.show('Todos los datos son obligatorios')
        } else if (!validateEmail(formData.email)) {
            toastRef.current.show('El email no es correcto')
        } else {
            setLoading(true)
            firebase.default.auth().signInWithEmailAndPassword(formData.email, formData.password)
            .then(() => {
                setLoading(false)
                navigation.navigate('Account')
            })
            .catch(() => {
                setLoading(false)
                toastRef.current.show('Email o contraseña incorrectos')
            })
        }
    }

    return (
        <View style={styles.formContainer}>
            <Input
                placeholder='Correo electrónico'
                containerStyle={styles.inputForm}
                rightIcon={
                    <Icon
                        type='material-community'
                        name='at'
                        iconStyle={styles.iconRight}
                    />
                }
                onChange={(e) => onChange(e, 'email')}
            />
            <Input
                placeholder='Contraseña'
                containerStyle={styles.inputForm}
                secureTextEntry={!showPassword}
                rightIcon={
                    <Icon
                        type='material-community'
                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                        iconStyle={styles.iconRight}
                        onPress={() => setShowPassword(!showPassword)}
                    />
                }
                onChange={(e) => onChange(e, 'password')}
            />
            <Button
                title="Iniciar sesión"
                containerStyle={styles.btnContainerLogin}
                buttonStyle={styles.btnLogin}
                onPress={onSubmit}
            />
            <Loading isVisible={loading} text='Iniciando sesión' />
        </View>
    )
}

const defaultFormValue = {
    email: '',
    password: ''
}

const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30
    },
    inputForm: {
        width: '100%',
        marginTop: 20
    },
    btnContainerLogin: {
        marginTop: 20,
        width: '95%'
    },
    btnLogin: {
        backgroundColor: '#00a680'
    },
    iconRight: {
        color: '#c1c1c1'
    }
})
