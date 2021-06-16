import * as firebase from 'firebase'

export function reauthenticate(password) {
    const user = firebase.default.auth().currentUser
    const credentials = firebase.default.auth.EmailAuthProvider.credential(user.email, password)

    return user.reauthenticateWithCredential(credentials)
}