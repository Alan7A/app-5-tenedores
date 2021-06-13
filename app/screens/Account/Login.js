import React from 'react'
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native'
import { Divider } from "react-native-elements";

export default function Login() {
    return (
        <ScrollView>
            <Image
                source={require('../../../assets/img/5-tenedores-letras-icono-logo.png')}
                resizeMode="contain"
                style={styles.logo}
            />
            <View style={styles.viewContainer}>
                <Text>
                    Login FORM
                </Text>
                <CreateAccount />
            </View>
            <Divider style={styles.divider} color='#00a680' />
            <Text>Social login</Text>
        </ScrollView>
    )
}

function CreateAccount() {
    return (
        <Text style={styles.textRegister}>
            ¿Aún no tienes una cuenta?{" "}
            <Text style={styles.btnRegister} onPress={() => console.log('registrarse')} >
                Regístrate
            </Text>
        </Text>
    )
}

const styles = StyleSheet.create({
    logo: {
        width: '100%',
        height: 150,
        marginTop: 20
    },
    viewContainer: {
        marginRight: 40,
        marginLeft: 40
    },
    textRegister: {
        marginTop: 15,
        marginLeft: 10,
        marginRight: 10
    },
    btnRegister: {
        color: '#00a680',
        fontWeight: 'bold'
    },
    divider: {
        margin: 40
    }
})
