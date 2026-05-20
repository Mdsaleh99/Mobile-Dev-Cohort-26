import { StyleSheet, Text, View } from 'react-native'
import React from 'react';
import { Button } from '@react-navigation/elements';
import { Link, useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
const navigation = useNavigation<any>()

  return (
    <View>
      <Text>HomeScreen</Text>
      <Button onPress={()=>navigation.navigate("Details" ,{} )}>Go to Details</Button>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})