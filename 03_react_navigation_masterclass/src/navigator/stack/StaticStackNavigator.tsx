import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../../screens/HomeScreen";
import DetailScreen from "../../screens/DetailScreen";
import ProfileScreen from "../../screens/ProfileScreen";
import { createStaticNavigation } from "@react-navigation/native";

// Assignment
const Stack = createNativeStackNavigator({
    screens: {
        Home: {
            screen:HomeScreen,
            options:{
                
            }
        },
        Details: DetailScreen,
        Profile: ProfileScreen
    }
});

const Navigation = createStaticNavigation(Stack);

export default function StaticStackNavigator() {
    return <Navigation />
}
