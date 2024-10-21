import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Platform,
  Alert,
  ActivityIndicator, // Import ActivityIndicator
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import Colors from "../../constants/Colors";
import DateTimePicker from "@react-native-community/datetimepicker";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useUser } from "@clerk/clerk-expo";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import cloudinaryImageUri from "../../lib/cloudinary";
import { useNavigation } from "expo-router";

const EditProfile = () => {
  const { user } = useUser();
  const navigation = useNavigation()

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState(new Date());
  const [gender, setGender] = useState("");
  const [relationshipStatus, setRelationshipStatus] = useState("");
  const [address, setAddress] = useState("");
  const [bio, setBio] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state

  // Function to pick an image from the library
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dob;
    setShowDatePicker(Platform.OS === "ios");
    setDob(currentDate);
    if (Platform.OS === "android") {
      setShowDatePicker(false); // Dismiss the date picker on Android
    }
  };

  // Function to upload the selected image to Cloudinary
  const UpdateUser = async () => {
    try {
      if (!name || !phone || !gender || !relationshipStatus || !address || !bio) {
        Alert.alert("Error", "Please fill in all fields.");
        return;
      }

      setLoading(true); // Set loading to true
      const currentEmail = await getUserData();
      const profileUri = await cloudinaryImageUri(image);

      const response = await axios.post(
        "http://192.168.80.236:3000/updateuser",
        {
          uniqe: currentEmail,
          name: name,
          phone: phone,
          DOB: dob,
          gender: gender,
          relationshipStatus: relationshipStatus,
          address: address,
          bio: bio,
          profile_img: profileUri || "invalid",
        }
      );

      if (response.status === 200) {
        Alert.alert("Success", "Profile updated successfully!");
        navigation.navigate('profile')
      } else {
        Alert.alert("Error", "Error updating profile.");
      }
    } catch (error) {
      console.log("Error updating profile: " + error);
      Alert.alert("Error", "Error updating profile: " + error.message);
    } finally {
      setLoading(false); // Set loading to false when done
    }
  };

  const getUserData = async () => {
    try {
      const info = await AsyncStorage.getItem("UserData");
      if (info !== null) {
        const parsedInfo = JSON.parse(info);
        return parsedInfo.data.email;
      } else {
        console.log("No user data found in AsyncStorage");
      }
    } catch (error) {
      console.error("Error retrieving user data:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileImageContainer}>
        <TouchableOpacity onPress={pickImage}>
          {image ? (
            <Image
              source={{ uri: image }}
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                borderWidth: 2,
                borderColor: Colors.PRIMARY,
                elevation: 5,
              }}
            />
          ) : (
            <View style={styles.defaultImage}>
              <Text style={styles.defaultImageText}>
                <Ionicons
                  name="cloud-upload"
                  size={40}
                  style={{ elevation: 7 }}
                  color={Colors.LIGHTGRAY}
                />
              </Text>
            </View>
          )}
        </TouchableOpacity>
        {image && <Text style={styles.imageSelectedText}>Image Selected</Text>}
      </View>

      <View style={styles.formContainer}>
        {/* Name */}
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
        />

        {/* Phone Number */}
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        {/* Date of Birth */}
        <Text style={styles.label}>Date of Birth</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <TextInput
            style={styles.input}
            placeholder="Date of Birth"
            value={dob.toDateString()}
            editable={false}
          />
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={dob}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

        {/* Gender Picker */}
        <Text style={styles.label}>Gender</Text>
        <Picker
          selectedValue={gender}
          onValueChange={(itemValue) => setGender(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Gender" value="" />
          <Picker.Item label="Male" value="male" />
          <Picker.Item label="Female" value="female" />
          <Picker.Item label="Other" value="other" />
        </Picker>

        {/* Relationship Status */}
        <Text style={styles.label}>Relationship Status</Text>
        <Picker
          selectedValue={relationshipStatus}
          onValueChange={(itemValue) => setRelationshipStatus(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Relation" value="" />
          <Picker.Item label="Single" value="Single" />
          <Picker.Item label="Married" value="Married" />
          <Picker.Item label="Divorced" value="Divorced" />
        </Picker>

        {/* Address */}
        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
        />

        {/* Bio */}
        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="Biography"
          value={bio}
          onChangeText={setBio}
          multiline={true}
          numberOfLines={4}
          textAlignVertical="top"
        />

        {/* Save Button */}
        {loading ? ( // Conditional rendering for loading indicator
          <TouchableOpacity style={styles.saveButton} disabled={true}>
          <ActivityIndicator size="small" color={Colors.PRIMARY} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.saveButton} onPress={UpdateUser}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  profileImageContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    objectFit: "cover",
    borderColor: Colors.PRIMARY,
    position: "absolute",
  },
  defaultImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#B3B3B3",
    borderWidth: 2,
    borderColor: Colors.PRIMARY,
    zIndex: 1,
  },
  defaultImageText: {
    color: Colors.PRIMARY,
  },
  imageSelectedText: {
    marginTop: 10,
    color: Colors.GRAY,
  },
  formContainer: {
    width: "100%",
  },
  input: {
    height: 40,
    borderColor: Colors.LIGHTGRAY,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "white",
  },
  label: {
    fontSize: 15,
    fontWeight:'500',
    marginBottom: 5,
    color: Colors.SECONDARY,
  },
  picker: {
    height: 50,
    borderColor: Colors.LIGHTGRAY,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: "white",
  },
  saveButton: {
    backgroundColor: Colors.PRIMARY,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default EditProfile;
