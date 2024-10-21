import * as SecureStore from "expo-secure-store";
import { Stack } from "expo-router";
import { ClerkProvider, ClerkLoaded } from "@clerk/clerk-expo";
import { TouchableOpacity } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { MenuProvider } from "react-native-popup-menu";
import { UserDetailContext } from "../context/UserDetailContext";
import { useEffect, useState } from "react";
import UserInfo from "../helper/UserInfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View } from "react-native";
import { Text } from "react-native";

export default function RootLayout() {
  const [userData, setuserData] = useState();
  const tokenCache = {
    async getToken(key) {
      try {
        const item = await SecureStore.getItemAsync(key);
        if (item) {
          console.log(`${key} was used 🔐 \n`);
        } else {
          console.log("No values stored under key: " + key);
        }
        return item;
      } catch (error) {
        console.error("SecureStore get item error: ", error);
        await SecureStore.deleteItemAsync(key);
        return null;
      }
    },
    async saveToken(key, value) {
      try {
        return SecureStore.setItemAsync(key, value);
      } catch (err) {
        return;
      }
    },
  };
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    throw new Error(
      "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
    );
  }
    // Define the async function inside useEffect
    const fetchUserData = async () => {
      
      const validEmail = await AsyncStorage.getItem("UserData");

      if (validEmail) {
        try {
          const parsedEmail = JSON.parse(validEmail); // If UserData is stored as JSON string
          const currentEmail = parsedEmail.data.email;

          const data = await UserInfo(currentEmail); // Call UserInfo with validEmail object
          setuserData(data);
        } catch (error) {
          console.error("Error parsing stored user data:", error);
        }
      } else {
        console.log("No UserData found in AsyncStorage.");
      }
    };
    useEffect(() => {
    fetchUserData(); // Call the function to fetch data
  }, []);

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <UserDetailContext.Provider value={userData}>
          <MenuProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="login/index" />
              <Stack.Screen
                name="edit/index"
                options={{
                  headerShown: true,
                  headerTitle: "Edit Profile",
                  headerLargeTitle: true,
                  headerShadowVisible: false,
                  headerBlurEffect: "regular",
                }}
              />
              <Stack.Screen
                name="familytree/index"
                options={{
                  headerShown: true,
                  title: "Family tree",
                  headerTransparent:true
                  // headerRight: () => (
                    // <TouchableOpacity
                    //   onPress={() => console.log("Three-dot button pressed")}
                    // >
                    //   <MaterialIcons
                    //     name="more-vert"
                    //     size={24}
                    //     color="black"
                    //     style={{ marginRight: 15 }}
                    //   />
                   // </TouchableOpacity>
                  //  <View>
                  //   <Text>Hello</Text>
                  //  </View>
                  // ),
                }}
              />
            </Stack>
          </MenuProvider>
        </UserDetailContext.Provider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
