import { useState } from "react";
import { Image, Pressable, Text, TextInput, View } from "react-native";

export default function HomeScreen() {
    const [name, setName] = useState("");
    return (
        <View>
            <Text numberOfLines={2}>
                oribus autem officia provident fugit consequuntur. Cum,
                suscipit!
            </Text>
            Remote image from internet
            <Image
                source={{
                    uri: "https://chaicode.com/assets/hitesh-suraj-dark-CKHA9jfT.webp",
                }}
                width={200}
                height={200}
            />
            Local image
            <Image
                source={require("@/assets/images/icon.png")}
                style={{
                    height: 100,
                    width: 100,
                }}
                blurRadius={30}
            />
        </View>
    );
}
