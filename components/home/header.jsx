import { View, Text, Image } from "react-native";
import React from "react";
import { useUser } from "@clerk/clerk-expo";
import Colors from "../../constants/Colors";
import { useNavigation } from "expo-router";
import { TouchableOpacity } from "react-native";

const header = () => {
  const { user } = useUser();
  const navigation = useNavigation();
  return (
    <View>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
        }}
      >
        Welcome to
      </Text>
      <Text
        style={{
          fontSize: 12,
          fontWeight: "bold",
          color: Colors.GRAY,
        }}
      >
        Create and explore family trees
      </Text>
      <TouchableOpacity
        style={{
          position: "absolute",
          right: 0,
          marginHorizontal: 10,
        }}
        onPress={() => navigation.navigate(`profile`)}
      >
        <Image
          source={{ uri: user?.imageUrl }}
          style={{
            width: 45,
            height: 45,
            borderRadius: 50,
            borderWidth: 1,
            borderColor: Colors.PRIMARY,
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default header;
