import * as SQLite from "expo-sqlite";
import React, { useEffect, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeAreaView } from "react-native-safe-area-context";

// https://docs.expo.dev/versions/latest/sdk/sqlite/

const db = SQLite.openDatabaseSync("demo.db");

const index = () => {
  const [output, setOutput] = useState("");

  const createTable = () => {
    db.execSync(`
        CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        age INTEGER
      );
      
      `);
    setOutput("Table created")
  }

  const insertUser = () => {
    db.runSync(
      "INSERT INTO users (name , age) VALUES (? , ?)",
      "Suraj",
      22
    )
  }


  const getUsers = () => {
    const users = db.getAllSync(
      "SELECT * FROM users"
    );

  const getFirstUser = () => {
    const user = db.getFirstSync(
      "SELECT * FROM users"
    );
  };


    
  const updateUser = () => {
    db.runSync(
      "UPDATE users SET age = ? WHERE id = ?",
      25,
      1
    );

    setOutput("User Updated");
  };

  const deleteUser = () => {
    db.runSync(
      "DELETE FROM users WHERE id = ?",
      1
    );

    setOutput("User Deleted");
  };

  };
  const dropTable = () => {
    db.execSync(`
      DROP TABLE IF EXISTS users;
    `);

    setOutput("Table Dropped");
  };

  useEffect(()=>{
    createTable()
  },[])

  return (
    <SafeAreaView
    style={{
      flex: 1,
    }}
  >
    <ScrollView
      contentContainerStyle={{
        padding: 20,
        gap: 12,
      }}
    >
      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          marginBottom: 10,
        }}
      >
        SQLite Demo
      </Text>

      <Button
        
        title="Create Table"
        onPress={createTable}
      />

      <Button
        title="Insert User"
        onPress={insertUser}
      />

      <Button
        
        title="Get All Users"
        onPress={getUsers}
      />

      <Button
        
        title="Get First User"
        onPress={getFirstUser}
      />

      <Button
        
        title="Update User"
        onPress={updateUser}
      />

      <Button
        title="Delete User"
        onPress={deleteUser}
      />

 
      <Button
        title="Drop Table"
        onPress={dropTable}
      />

      <View
        style={{
         
          marginTop: 20,
          padding: 16,
          borderWidth: 1,
          borderRadius: 10,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            marginBottom: 10,
          }}
        >
          Output
        </Text>

        <Text
          selectable
          style={{
            fontSize: 16,
            fontSize: 14,
          }}
        >
          {output}
        </Text>
      </View>
    </ScrollView>
  </SafeAreaView>
  )
}

export default index