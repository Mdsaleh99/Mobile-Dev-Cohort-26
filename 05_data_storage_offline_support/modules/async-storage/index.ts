import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';


// https://react-native-async-storage.github.io/2.0/Usage/
// https://docs.expo.dev/versions/latest/sdk/async-storage/
// https://www.notion.so/Data-Storage-Offline-Support-44ee3be953e982c196ee017d1f7abbfa


// https://gregarious-gray-075.notion.site/Data-Storage-Offline-Support-369c3158e38d80528978f188265c9ff2

export default function Index() {
  const [data , setData] = useState("");


  const myObj = {
    name:"Suraj",
    age:22,
    isDeveloper:true
  }

  // SetItem
  const saveData = async()=>{
    await AsyncStorage.setItem("user" , JSON.stringify(myObj))
  }

  // getItem
  const getData = async()=>{
    const value = await AsyncStorage.getItem("user")
    setData(value!)
  }

  // removeItem 
  const removeData = async()=>{
    await AsyncStorage.removeItem("user")
  }

  const clearStorage = async () => {
    await AsyncStorage.clear();

    setData("");
  };

  const getKeys = async () => {
    const keys = await AsyncStorage.getAllKeys();

    console.log(keys);
  };

  const saveMultiple = async () => {
    await AsyncStorage.multiSet([
      ["name", "Code Snippet"],
      ["role", "Developer"],
    ]);
  };

  const getMultiple = async () => {
    const values = await AsyncStorage.multiGet(["name", "role"]);

    console.log(values);
  };


  return (
    <SafeAreaView
    style={{
      flex: 1,
      justifyContent: "center",
      padding: 20,
      gap: 12,
    }}
  >
    <Button title="Save Data" onPress={saveData} />

    <Button title="Get Data" onPress={getData} />

    <Button title="Remove Data" onPress={removeData} />

    <Button title="Clear Storage" onPress={clearStorage} />

    <Button title="Get All Keys" onPress={getKeys} />

    <Button title="Multi Set" onPress={saveMultiple} />

    <Button title="Multi Get" onPress={getMultiple} />

    <View
      style={{
        marginTop: 20,
      }}
    >
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
        }}
      >
        Output:
      </Text>

      <Text>{data}</Text>
    </View>
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});