import React from 'react'
import { Image } from 'react-native-elements'
import Carousel from "react-native-snap-carousel";

export default function CarouselComponent({ images, height, width }) {
    const renderItem = ({ item }) => {
        return (
            <Image
                style={{ width, height }}
                source={{ uri: item }}
            />)
    }

    return (
        <Carousel
            layout='default'
            data={images}
            sliderWidth={width}
            itemWidth={width}
            renderItem={renderItem}
        />
    )
}
