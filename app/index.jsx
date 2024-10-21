import { useUser } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { LogBox, View } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { useEffect } from "react";

export default function Index() {
  const { user } = useUser();
  // LogBox.ignoreAllLogs()

  const saveUser = async () => {
    try {
      const fullName = user.fullName;
      const email = user.primaryEmailAddress?.emailAddress;
      const profileImage = user.imageUrl;

      console.log(fullName, email);

      const responce = await axios.post('http://192.168.80.236:3000/user', {
        name: fullName,
        email: email,
        profile_img: profileImage,
      });

      if (responce.data.success) {
        await AsyncStorage.setItem("IsUserSave", JSON.stringify(true));
        console.log("User saved successfully");
        await AsyncStorage.setItem("UserData", JSON.stringify(responce.data.email));
        console.log("User ID:", responce.data);
      } else {
        console.log("Error saving user: ", responce.data.message);
      }
    } catch (error) {
      console.error("Error saving user data with Axios", error);
    }
  };

  const checkUserDataInStorage = async () => {
    try {
      const fetchingasyncStorage = await AsyncStorage.getItem('IsUserSave')
      if (fetchingasyncStorage) {
        console.log("User is already saved");
      }else{
        console.log("Saving User");
        await saveUser();  
      }  
    } catch (error) {
      console.error('Error reading AsyncStorage', error);
    }
  }
useEffect(() => {
  if (user) {
    checkUserDataInStorage();
  }
}, [user])

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {!user ? (
        <Redirect href={"/login"} />
      ) : (
        <Redirect href={"/(tabs)/home"} />
      )}
    </View>
  );
}
