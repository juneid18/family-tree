import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Colors from "../../constants/Colors";
import AntDesign from "@expo/vector-icons/AntDesign";
import HeaderComponent from "../../components/home/header";
import Overview from "../../components/home/overview";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { useUser } from "@clerk/clerk-expo";
import { UserDetailContext } from "../../context/UserDetailContext";
import { useNavigation } from "expo-router";

const Home = () => {
  const { user } = useUser();
  const [joinedTree, setJoinedTree] = useState([]);
  const currentEmail = user?.primaryEmailAddress?.emailAddress|| "Email not available";
  const userData = useContext(UserDetailContext);
  const navigation = useNavigation();

  useEffect(() => {
    if (userData && userData.JoinedTree) {
      setJoinedTree(userData.JoinedTree);
    }
  }, [userData]);

  const [joinTreeData, setJoinTreeData] = useState();

  const fetchJoinedTree = async () => {
    try {
      const response = await axios.post(
        "http://192.168.80.236:3000/fetchjointree",
        { JoinedTree: joinedTree } // Use the current state
      );
      if (response.status === 200) {
        setJoinTreeData(response.data.UserTree);        
      } else {
        console.log("Response was not successful.");
      }
    } catch (error) {
      console.log("Error fetching joined tree:", error);
    }
  };

  useEffect(() => {
    fetchJoinedTree(); // Initial fetch
    // const interval = setInterval(() => {
    //   fetchJoinedTree(); // Fetch every 5 seconds
    // }, 5000); // 5000 milliseconds = 5 seconds

    // return () => clearInterval(interval);
  }, [joinedTree]); // Add joinedTree as a dependency

  const [modalVisible, setModalVisible] = useState(false);
  const [joinCode, setJoinCode] = useState("");

  const handleJoin = async () => {
    try {
      if (!joinCode) {
        Alert.alert("Validation Error", "Please enter a join code.");
        return;
      }
      const response = await axios.post("http://192.168.80.236:3000/joincode", {
        JoinCode: joinCode,
        email: currentEmail,
      });

      if (response.status === 200) {
        Alert.alert("Success", "Successfully joined the tree!");
        fetchJoinedTree();
        
      } else {
        Alert.alert("Error", "Failed to join the tree.");
      }
    } catch (error) {
      console.log("Error joining tree:", error);
      Alert.alert("Error", "An error occurred while joining the tree.");
    } finally {
      setJoinCode(""); // Reset input
      setModalVisible(false); // Close modal
    }
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Modal */}
      <JoinCodeModal
        visible={modalVisible}
        joinCode={joinCode}
        setJoinCode={setJoinCode}
        handleJoin={handleJoin}
        closeModal={closeModal}
      />

      {/* Header Component */}
      <HeaderComponent />

      {/* Content Section */}
      <View style={styles.contentContainer}>
        <Text style={styles.headerTitle}>Explore family members</Text>
        <Text style={styles.subTitle}>Track your family members with</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('search')}
          style={styles.getStartedButton}
        >
          <Text style={styles.getStartedText}>
            <AntDesign name="search1" size={20} color="black" /> Get Started
          </Text>
        </TouchableOpacity>
      </View>

      <Overview Overview={joinTreeData} />

      {/* Fixed Action Button */}
      <TouchableOpacity
        accessible={true}
        accessibilityLabel="Open join modal"
        onPress={openModal}
        style={styles.fixedButton}
      >
        <AntDesign name="link" size={24} color={Colors.WHITE} />
      </TouchableOpacity>
    </ScrollView>
  );
};

// Join Code Modal Component
const JoinCodeModal = ({
  visible,
  joinCode,
  setJoinCode,
  handleJoin,
  closeModal,
}) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={visible}
    onRequestClose={closeModal}
  >
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.headerText}>Enter Join Code</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your join code"
          value={joinCode}
          onChangeText={setJoinCode}
          keyboardType="default" // Set to number-pad for numbers only
        />
        <TouchableOpacity style={styles.submitButton} onPress={handleJoin}>
          <Text style={styles.buttonText}>Join</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 50,
    paddingHorizontal: 20,
  },
  contentContainer: {
    width: "100%",
    height: 150,
    backgroundColor: "#80C483",
    marginVertical: 20,
    borderRadius: 20,
    padding: 25,
    elevation: 7,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "900",
  },
  subTitle: {
    fontWeight: "bold",
  },
  getStartedButton: {
    backgroundColor: Colors.WHITE,
    paddingVertical: 10,
    borderRadius: 8,
    marginVertical: 14,
  },
  getStartedText: {
    textAlign: "center",
    fontWeight: "600",
  },
  fixedButton: {
    position: "absolute",
    zIndex: 1,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.PRIMARY,
    padding: 14,
    borderRadius: 15,
    elevation: 5, // Shadow on Android
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    alignItems: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
    width: "100%",
  },
  submitButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 10,
    alignItems: "center",
  },
  closeButtonText: {
    color: "red",
    fontWeight: "bold",
  },
});

export default Home;
