import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import RestaurantsStack from './RestaurantsStack';
import FavoritesStack from './FavoritesStack';
import TopRestaurantsStack from './TopRestaurantsStack';
import SearchStack from './SearchStack';
import AccountStack from './AccountStack';

const Tab = createBottomTabNavigator();

export default function BottomNavigation() {
    return (
        <NavigationContainer>
            <Tab.Navigator>
                <Tab.Screen name='Restaurants' component={RestaurantsStack} options={{title:'Restaurantes'}}/>
                <Tab.Screen name='Favorites' component={FavoritesStack} options={{title:'Favoritos'}}/>
                <Tab.Screen name='TopRestaurants' component={TopRestaurantsStack} options={{title:'Top 5'}}/>
                <Tab.Screen name='Search' component={SearchStack} options={{title:'Buscar'}}/>
                <Tab.Screen name='Account' component={AccountStack} options={{title:'Cuenta'}}/>
            </Tab.Navigator>
        </NavigationContainer>
    )
}
