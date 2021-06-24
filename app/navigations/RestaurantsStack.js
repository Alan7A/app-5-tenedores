import React from 'react'
import { createStackNavigator } from "@react-navigation/stack";
import Restaurants from "../screens/Restaurants/Restaurants";
import AddRestaurant from '../screens/Restaurants/AddRestaurant';
import Restaurant from '../screens/Restaurants/Restaurant';
import AddReview from '../screens/Restaurants/AddReview';

const Stack = createStackNavigator();

export default function RestaurantsStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name='Restaurants'
                component={Restaurants}
                options={{ title: 'Restaurantes' }}
            />
            <Stack.Screen
                name='AddRestaurant'
                component={AddRestaurant}
                options={{ title: 'Añadir nuevo restaurante' }}
            />
            <Stack.Screen
                name='Restaurant'
                component={Restaurant}
            />
            <Stack.Screen
                name='AddReview'
                component={AddReview}
                options={{ title: 'Nuevo comentario' }}
            />
        </Stack.Navigator>
    )
}
