import { isEmpty, size } from 'lodash';
import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { Input, Icon, Button } from "react-native-elements";
import { validateEmail } from "../../utils/validations";

export default function RegisterForm({ toastRef }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showRepearPassword, setShowRepeatPassword] = useState(false);
    const [formData, setFormData] = useState(defaultFormValue())

    const onSubmit = () => {
        if (isEmpty(formData.email) || isEmpty(formData.password) || isEmpty(formData.repeatPassword)) {
            toastRef.current.show('Todos los campos son obligatorios')
        } else if (!validateEmail(formData.email)) {
            toastRef.current.show('El correo electrónico es incorrecto')
        } else if (formData.password !== formData.repeatPassword) {
            toastRef.current.show('Las contraseñas tienen que ser iguales')
        } else if (size(formData.password) < 6) {
            toastRef.current.show('La contraseña tiene que tener al menos 6 carácteres')
        } else {
            // Todo bien
        }
    }


    const onChange = (e, type) => {
        setFormData({ ...formData, [type]: e.nativeEvent.text })
    }

    return (
        <View style={styles.formContainer}>
            <Input
                placeholder="Correo electrónico"
                containerStyle={styles.inputForm}
                onChange={e => onChange(e, "email")}
                rightIcon={
                    <Icon
                        type='material-community'
                        name='at'
                        iconStyle={styles.iconRight}
                    />
                }
            />
            <Input
                placeholder="Contraseña"
                containerStyle={styles.inputForm}
                onChange={e => onChange(e, "password")}
                secureTextEntry={!showPassword}
                rightIcon={
                    <Icon
                        type='material-community'
                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                        iconStyle={styles.iconRight}
                        onPress={() => setShowPassword(!showPassword)}
                    />
                }
            />
            <Input
                placeholder="Repetir contraseña"
                containerStyle={styles.inputForm}
                onChange={e => onChange(e, "repeatPassword")}
                secureTextEntry={!showRepearPassword}
                rightIcon={
                    <Icon
                        type='material-community'
                        name={showRepearPassword ? 'eye-off-outline' : 'eye-outline'}
                        iconStyle={styles.iconRight}
                        onPress={() => setShowRepeatPassword(!showRepearPassword)}
                    />
                }
            />
            <Button
                title='Unirse'
                containerStyle={styles.btnContainerRegister}
                buttonStyle={styles.btnRegister}
                onPress={onSubmit}
            />
        </View>
    )
}


function defaultFormValue() {
    return {
        email: "",
        password: "",
        repeatPassword: ""
    }
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
    btnContainerRegister: {
        marginTop: 20,
        width: '95%'
    },
    btnRegister: {
        backgroundColor: '#00a680',
    },
    iconRight: {
        color: '#c1c1c1'
    }
})