import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../../screens/HomeScreen';
import DetailScreen from '../../screens/DetailScreen';
import ProfileScreen from '../../screens/ProfileScreen';


const Stack = createNativeStackNavigator();


function MyStack(){
    return (
        <Stack.Navigator 
        screenOptions={{
            headerStyle: {
                backgroundColor: '#111827',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
        }}
        >
            <Stack.Screen name='Home' component={HomeScreen}  
            options={{
                title:"Dashboard",
                headerStyle:{
                    backgroundColor:"red"
                },
           
                headerTintColor:"#fff",
                headerTitleStyle:{
                 fontWeight:"bold" ,
                 fontSize: 22,  
                },
                animation:"flip"
                
            }} />
            <Stack.Screen name='Details' component={DetailScreen}/>
            <Stack.Screen name='Profile' component={ProfileScreen}/>
        </Stack.Navigator>
    )
}


export default function  DynamicStackNavigator(){
    return (
        <NavigationContainer>
            <MyStack/>
        </NavigationContainer>
    )
}

// Animations