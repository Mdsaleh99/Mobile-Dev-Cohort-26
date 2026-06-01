import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { StatusBar } from "expo-status-bar";
import { GyroscopeCard } from '@/components/gyroscope-card';

const index = () => {
  return (
    <View style={styles.container}>
       <StatusBar style="light" />
       <GyroscopeCard/>
    </View>
  )
}

export default index

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#09090f",
  },
});