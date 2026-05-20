import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { Button } from '@react-navigation/elements'

const ProfileScreen = () => {
    const navigation = useNavigation<any>()
  return (
    <View>
      <Text>ProfileScreen</Text>
      <Button onPress={()=>navigation.replace()}>Go to Home </Button>
    </View>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({})

// 1. navigate("") Go to a screen by name.
// 2. goBack() Go to prev screen
// 3. push("")  Alaways adds a new instance  
// 4. replace("") - Replace current screen -->  Splash  Home  , login -->App
// 5. popToTop() - go back to first screen
// 6. popTo("")