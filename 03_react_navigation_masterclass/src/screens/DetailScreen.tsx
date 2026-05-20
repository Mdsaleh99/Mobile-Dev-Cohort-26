import { Button, StyleSheet, Text, View } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { useNavigation } from '@react-navigation/native'

const DetailScreen = ({ route }: any) => {


    const navigation = useNavigation<any>();
    const { username } = route.params;

 
    return (
        <View>
            <Text>{username}</Text>
            <Button title='Go Profile' onPress={() => navigation.replace("Profile")} />
        </View>
    )
}

export default DetailScreen

const styles = StyleSheet.create({})