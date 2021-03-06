import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { ListItem, Icon } from 'react-native-elements'
import Modal from '../Modal';
import ChangeDisplayNameForm from './ChangeDisplayNameForm';
import ChangeEmailForm from './ChangeEmailForm';
import ChangePasswordForm from './ChangePasswordForm';

export default function AccountOptions({ userInfo, toastRef, setReloadUserInfo }) {
    const [showModal, setShowModal] = useState(false)
    const [renderComponent, setRenderComponent] = useState(null)

    const selectedComponent = (key) => {
        switch (key) {
            case 'displayName':
                setRenderComponent(
                    <ChangeDisplayNameForm
                        displayName={userInfo.displayName}
                        setShowModal={setShowModal}
                        toastRef={toastRef}
                        setReloadUserInfo={setReloadUserInfo}
                    />
                )
                setShowModal(true)
                break;

            case 'email':
                setRenderComponent(
                    <ChangeEmailForm
                        email={userInfo.email}
                        setShowModal={setShowModal}
                        toastRef={toastRef}
                        setReloadUserInfo={setReloadUserInfo}
                    />
                )
                setShowModal(true)
                break;

            case 'password':
                setRenderComponent(
                    <ChangePasswordForm
                        email={userInfo.email}
                        setShowModal={setShowModal}
                        toastRef={toastRef}
                    />
                )
                setShowModal(true)
                break;

            default:
                setRenderComponent(null)
                setShowModal(false)
                break;
        }
    }

    const menuOptions = options(selectedComponent)

    return (
        <View>
            {menuOptions.map((option, index) => (
                <ListItem key={index} bottomDivider onPress={option.onPress}>
                    <Icon
                        type={option.iconType}
                        name={option.iconNameLeft}
                        color={option.iconColor}
                    />
                    <ListItem.Content>
                        <ListItem.Title>{option.title}</ListItem.Title>
                    </ListItem.Content>
                    <ListItem.Chevron />
                </ListItem>
            ))}
            {renderComponent && (
                <Modal isVisible={showModal} setIsVisible={setShowModal}>
                    {renderComponent}
                </Modal>
            )}
        </View>
    )
}

function options(selectedComponent) {
    return [
        {
            title: 'Cambiar Nombre y Apellidos',
            iconType: 'material-community',
            iconNameLeft: 'account-circle',
            iconColor: '#ccc',
            onPress: () => selectedComponent('displayName')
        },
        {
            title: 'Cambiar Email',
            iconType: 'material-community',
            iconNameLeft: 'at',
            iconColor: '#ccc',
            onPress: () => selectedComponent('email')
        },
        {
            title: 'Cambiar Contrase??a',
            iconType: 'material-community',
            iconNameLeft: 'lock-reset',
            iconColor: '#ccc',
            onPress: () => selectedComponent('password')
        }
    ]
}

const styles = StyleSheet.create({

})
