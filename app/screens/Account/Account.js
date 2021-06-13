import React, { useEffect, useState } from 'react'
import Loading from '../../components/Loading'
import UserGuest from './UserGuest'
import UserLogged from './UserLogged'
import * as firebase from 'firebase'

export default function Account() {
    const [login, setLogin] = useState(null)

    useEffect(() => {
        firebase.default.auth().onAuthStateChanged((user) => {
            !user ? setLogin(false) : setLogin(true)
        })
    }, [])

    if(login === null) return <Loading isVisible={true} text="Cargando..." />

    return (
        login ? <UserLogged /> : <UserGuest />
    )
}
