import React from 'react'
import { createStackNavigator } from "@react-navigation/stack";
import Account from '../screens/Account/Account';
import Login from '../screens/Account/Login';
import Register from '../screens/Account/Register';

const Stack = createStackNavigator();

export default function AccountStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name='Account'
                component={Account}
                options={{ title: 'Mi cuenta' }}
            />
            <Stack.Screen
                name='Login'
                component={Login}
                options={{ title: 'Iniciar sesión' }}
            />
            <Stack.Screen
                name='Register'
                component={Register}
                options={{ title: 'Registro' }}
            />
        </Stack.Navigator>
    )
}
