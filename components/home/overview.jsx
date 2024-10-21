import {
  View,
  Text,
  TextInput,
  Image,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import Colors from "../../constants/Colors";
import Entypo from "@expo/vector-icons/Entypo";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { useNavigation } from "expo-router";

const overview = (Overview) => {
  const familyTree = Overview?.Overview || [];

  const navigation = useNavigation();
const [searchQuery, setsearchQuery] = useState('')

const filteredFamilyTree = familyTree.filter(item =>
  item.treeName.toLowerCase().includes(searchQuery.toLowerCase())
);

  return (
    <View>
      <TextInput
        placeholder="Search"
        value={searchQuery}
        onChangeText={setsearchQuery} 
        style={{
          backgroundColor: Colors.LIGHTGRAY,
          paddingHorizontal: 10,
          paddingVertical: 10,
          fontSize: 16,
          borderRadius: 20,
          textAlign: "center",
          borderColor: Colors.GRAY,
          borderWidth: 1,
          color: Colors.SECONDARY,
          elevation: 4,
        }}
      />
      <Text
        style={{
          marginVertical: 20,
          fontSize: 15,
          fontWeight: "bold",
        }}
      >
        Family tree overview
      </Text>
      {/* OverView */}
      {filteredFamilyTree.length > 0 ? (
        filteredFamilyTree.map((item) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(`familytree/index`, {
                treeId: item._id,
              })
            }
            key={item._id}
            style={{
              marginVertical: 10,
              padding: 15,
              backgroundColor: "#f9f9f9", // Light gray background
              borderRadius: 10,
              elevation: 2, // Shadow effect
            }}
          >
            {/* Render the image if it exists */}
            {item.thumbnail && (
              <Image
                source={{ uri: item.thumbnail }}
                style={{
                  width: "100%", // Full width
                  height: 150, // Fixed height
                  borderRadius: 10, // Rounded corners
                  marginBottom: 10, // Space below image
                }}
              />
            )}
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: "#333", // Dark text color
                marginBottom: 5, // Space below title
              }}
            >
              {item.treeName}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#666", // Lighter text color for description
              }}
            >
              {item.description}
            </Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text>No family trees available.</Text>
      )}
    </View>
  );
};
const RenderFamilyTree = ({ item }) => {
  const [isButtonVisible, setIsButtonVisible] = useState(false);

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: 100,
        padding: "20px",
        elevation: 5,
        marginVertical: 10,
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: Colors.WHITE,
          borderRadius: 10,
          padding: 10,
        }}
      >
        <Image
          source={item.image}
          style={{
            width: 50,
            height: 50,
            borderRadius: 10,
            marginRight: 10,
          }}
        />
        <View>
          <Text
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: "bold",
              color: "#333",
            }}
          >
            {item.title}
          </Text>
          <Text
            style={{
              margin: 5,
              fontSize: 14,
              color: "#666",
            }}
          >
            {item.member}
          </Text>
        </View>
        <Menu style={{ position: "absolute", top: 40, right: 20 }}>
          <MenuTrigger style={{ width: 20 }}>
            <Entypo
              name="dots-three-vertical"
              size={20}
              color={Colors.SECONDARY}
            />
          </MenuTrigger>
          <MenuOptions>
            <MenuOption onSelect={() => alert(`Delete`)}>
              <Text style={{ color: "red", fontWeight: "bold", padding: 10 }}>
                Leave
              </Text>
            </MenuOption>
          </MenuOptions>
        </Menu>
      </View>
      <View></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  treeItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  treeTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  treeDescription: {
    fontSize: 14,
    color: "#555",
  },
});

export default overview;
