import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import React, { useContext } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import Colors from "../../constants/Colors";
import { useClerk, useUser } from "@clerk/clerk-expo";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserDetailContext } from "../../context/UserDetailContext";

const Profile = () => {
  const navigation = useNavigation();
  const { user } = useUser();
  const { signOut } = useClerk();
  const userData = useContext(UserDetailContext);

  const handleLogout = async () => {
    try {
      await signOut();
      await AsyncStorage.removeItem("IsUserSave");
      navigation.navigate("login/index");
    } catch (error) {
      console.error("Error during logout: ", error);
    }
  };

  const formattedDOB = userData?.DOB
    ? new Date(userData.DOB).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown";

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Profile Image */}
      <View style={styles.profileImageContainer}>
        <Image
          source={{ uri: userData?.profile_img || "path/to/placeholder.png" }}
          style={styles.profileImage}
        />
      </View>

      {/* Name and Info */}
      <Text style={styles.userName}>{userData?.name}</Text>
      <Text style={styles.userBirthDate}>Born: {formattedDOB}</Text>

      {userData?.IsAdmin? (
        <TouchableOpacity style={styles.adminButton}>
          <Text style={styles.adminButtonText}>
            <AntDesign name="logout" size={18} color="white" /> Admin Panel
          </Text>
        </TouchableOpacity>
      ) : (
        <Text style={{
          marginTop:-20
        }}></Text>
      )}

      {/* Buttons Section */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate("edit/index")}
        >
          <Text style={styles.buttonText}>
            <AntDesign name="edit" size={18} color="white" /> Edit
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.buttonText}>
            <AntDesign name="logout" size={18} color="white" /> Logout
          </Text>
        </TouchableOpacity>
      </View>

      {/* About Section */}
      <View style={styles.aboutSection}>
        <Text style={styles.sectionTitle}>About {user?.firstName}</Text>
        <Text style={styles.sectionContent}>{userData?.bio}</Text>

        {/* Highlighted Relationship Status */}
        <Text style={styles.highlightedTitle}>Relationship Status</Text>
        <View style={styles.highlightedSection}>
          <Text style={styles.highlightedText}>
            {userData?.relationshipStatus || "Not specified"}
          </Text>
        </View>

        {/* Contact Info Section */}
        <Text style={styles.sectionTitle}>Contact Info</Text>
        <View style={styles.contactInfoContainer}>
          <Text style={styles.contactInfo}>
            <AntDesign name="mail" size={20} color={Colors.PRIMARY} />{" "}
            {userData?.email}
          </Text>
          <Text style={styles.contactInfo}>
            <AntDesign name="phone" size={20} color={Colors.PRIMARY} />{" "}
            {userData?.phone}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: "#f0f4f7",
  },
  profileImageContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginVertical: 30,
  },
  profileImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2C3E50",
    marginBottom: 4,
  },
  userBirthDate: {
    fontSize: 14,
    color: "#7F8C8D",
    marginBottom: 30,
  },
  adminButton: {
    backgroundColor: Colors.SECONDARY, // Color for the Admin Panel button
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 20,
    elevation: 4,
    alignSelf: "center",
  },
  adminButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginBottom: 30,
  },
  editButton: {
    flex: 1,
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 12,
    borderRadius: 20,
    marginHorizontal: 8,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  logoutButton: {
    flex: 1,
    backgroundColor: "#E74C3C",
    paddingVertical: 12,
    borderRadius: 20,
    marginHorizontal: 8,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  aboutSection: {
    backgroundColor: "#ffffff",
    padding: 20,
    width: "90%",
    borderRadius: 20,
    elevation: 6,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#34495E",
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: 14,
    color: "#7F8C8D",
    lineHeight: 22,
    marginBottom: 15,
  },
  highlightedSection: {
    backgroundColor: "#EAF7E9", // Light green background for highlight
    padding: 5,
    borderRadius: 50,
    marginVertical: 10,
    shadowColor: "#000",
    width: 100,
    elevation: 3,
  },
  highlightedTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.SECONDARY, // Dark green color for emphasis
  },
  highlightedText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.GRAY,
    textAlign: "center",
  },
  contactInfoContainer: {
    marginTop: 10,
  },
  contactInfo: {
    fontSize: 14,
    color: "#7F8C8D",
    marginBottom: 15,
  },
});

export default Profile;
