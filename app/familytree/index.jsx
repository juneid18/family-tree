import React, { useEffect, useState } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Home from "./tabs/home";
import Event from "./tabs/event";
import Member from "./tabs/member";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Colors from "../../constants/Colors"; // Ensure to import your colors
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import { Text, TouchableOpacity } from "react-native";

const Tab = createMaterialTopTabNavigator();

function MyTabs({ treeDetails }) {
  return (
    <Tab.Navigator
      style={{
        paddingVertical: 90,
      }}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.PRIMARY,
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "#fff",
          elevation: 10,
          height: 45,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
          paddingVertical: 5,
        },
        tabBarIndicatorStyle: {
          backgroundColor: Colors.PRIMARY,
          height: 3,
        },
      }}
    >
      <Tab.Screen
        name="familytree"
        options={{
          title: "Family Tree",
          swipeEnabled: false,
          tabBarIcon: ({ color }) => (
            <Entypo name="flow-tree" size={20} color={color} />
          ),
        }}
      >
        {() => <Home treeDetails={treeDetails} />}
      </Tab.Screen>

      <Tab.Screen
        name="member"
        options={{
          title: "Members",
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="users" size={20} color={color} />
          ),
        }}
      >
        {() => <Member treeDetails={treeDetails} />}
      </Tab.Screen>

      <Tab.Screen
        name="event"
        options={{
          title: "Events",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="event" size={20} color={color} />
          ),
        }}
      >
        {() => <Event treeDetails={treeDetails} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

const FamilyTreeTabs = () => {
  const route = useRoute();
  const { treeId } = route.params;
  const [treeDetails, setTreeDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTreeDetails = async () => {
    try {
      const response = await axios.post(
        "http://192.168.80.236:3000/fetchtreebyid",
        { treeId }
      );
      if (response.status === 200) {
        setTreeDetails(response.data.UserTree);
      } else {
        console.log("Response was not successful.");
        setError("Failed to fetch tree details.");
      }
    } catch (error) {
      console.log("Error occurred:", error);
      setError("An error occurred while fetching tree details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch data on component mount
    fetchTreeDetails();

    // Set an interval to fetch data every 5 seconds
    const intervalId = setInterval(() => {
      fetchTreeDetails();
    }, 5000); // 5000ms = 5 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <TouchableOpacity
        onPress={() => console.log("Clieked")}
        style={{
          zIndex: 99,
        }}
      >
        <Text
          style={{
            position: "absolute",
            top: 50,
            right: 20,
            backgroundColor: Colors.PRIMARY,
            color: Colors.WHITE,
            paddingVertical: 6,
            paddingHorizontal: 10,
            borderRadius: 20,
            fontWeight: "500",
          }}
        >
          {treeDetails?.joinCode}
        </Text>
      </TouchableOpacity>

      <MyTabs treeDetails={treeDetails || {}} />
    </>
  );
};

export default FamilyTreeTabs;
