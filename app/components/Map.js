import React from 'react'
import MapView, { Marker } from "react-native-maps";
import openMap from 'react-native-open-maps';

export default function Map({ location, name, height }) {
    const goToLocation = () => {
        openMap({
            latitude: location.latitude,
            longitude: location.longitude,
            zoom: 19,
            query: name,
            provider: 'google'
        })
    }

    return (
        <MapView
            style={{ height, width: '100%' }}
            initialRegion={location}
            onPress={goToLocation}
        >
            <Marker 
                coordinate={{
                    latitude: location.latitude,
                    longitude: location.longitude
                }}
            />
        </MapView>
    )
}
