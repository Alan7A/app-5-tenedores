import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import RestaurantsStack from './RestaurantsStack';
import FavoritesStack from './FavoritesStack';
import TopRestaurantsStack from './TopRestaurantsStack';
import SearchStack from './SearchStack';
import AccountStack from './AccountStack';
import { Icon } from 'react-native-elements';

const Tab = createBottomTabNavigator();

export default function BottomNavigation() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                initialRouteName='Restaurants'
                tabBarOptions={{
                    inactiveTintColor: '#646464',
                    activeTintColor: '#00a680'
                }}
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ color }) => screenOptions(route, color)
                })}
            >
                <Tab.Screen name='Restaurants' component={RestaurantsStack} options={{ title: 'Restaurantes' }} />
                <Tab.Screen name='Favorites' component={FavoritesStack} options={{ title: 'Favoritos' }} />
                <Tab.Screen name='TopRestaurants' component={TopRestaurantsStack} options={{ title: 'Top 5' }} />
                <Tab.Screen name='Search' component={SearchStack} options={{ title: 'Buscar' }} />
                <Tab.Screen name='Account' component={AccountStack} options={{ title: 'Cuenta' }} />
            </Tab.Navigator>
        </NavigationContainer>
    )
}

function screenOptions(route, color) {
    let iconName;

    switch (route.name) {
        case 'Restaurants':
            iconName = 'compass-outline'
            break;

        case 'Favorites':
            iconName = 'heart-outline'
            break;

        case 'TopRestaurants':
            iconName = 'star-outline'
            break;

        case 'Search':
            iconName = 'magnify'
            break;

        case 'Account':
            iconName = 'home-outline'
            break;

        default:
            break;
    }

    return <Icon type='material-community' name={iconName} size={22} color={color} />
}
