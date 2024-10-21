import React, { useState, useRef, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  FlatList,
  Image,
  Alert,
  Modal,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Colors from "../../constants/Colors";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useUser } from "@clerk/clerk-expo";
import cloudinaryImageUri from "../../lib/cloudinary";
import { isLoaded } from "expo-font";
import FetchUserTree from "../../helper/FetchUserTree";

const Tree = () => {
  const { user } = useUser();
  const UserCurrentEmail = user.primaryEmailAddress.emailAddress;

  const navigation = useNavigation();

  const [isSearchBarVisible, setSearchBarVisible] = useState(false);
  const [isButtonVisible, setButtonVisible] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [userTree, setuserTree] = useState([]);
  const scrollOffset = useRef(0);
  const currentScrollOffset = useRef(new Animated.Value(0)).current;

  // Animation values for the button
  const buttonAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animate the button when its visibility changes
    Animated.timing(buttonAnimation, {
      toValue: isButtonVisible ? 1 : 0, // 1 for visible, 0 for hidden
      duration: 300, // Duration of animation (300ms)
      useNativeDriver: true, // Enable native driver for better performance
    }).start();
  }, [isButtonVisible]);

  // Fetching user family tree
  const fetchFamilyTree = async () => {
    try {
      const responceData = await FetchUserTree(UserCurrentEmail);
      // console.log("Fetched Tree Data:", responceData); // Check the data
      setuserTree(responceData || []);
    } catch (error) {
      console.error("Error fetching family tree:", error);
      Alert.alert(
        "Error",
        "Could not fetch family tree. Please try again later."
      );
    }
  };

  useEffect(() => {
    fetchFamilyTree(); // Initial fetch

    const intervalId = setInterval(() => {
      fetchFamilyTree(); // Fetch every 4 seconds
    }, 4000);

    return () => {
      clearInterval(intervalId); // Cleanup on unmount
    };
  }, []);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: currentScrollOffset } } }],
    { useNativeDriver: false }
  );

  currentScrollOffset.addListener(({ value }) => {
    if (value > scrollOffset.current) {
      setButtonVisible(false); // User scrolling down, hide button
    } else if (value < scrollOffset.current) {
      setButtonVisible(true); // User scrolling up, show button
    }
    scrollOffset.current = value;
  });

  // Modal Functionality is here...
  const [familyTreeName, setFamilyTreeName] = useState("");
  const [mainParentsCount, setMainParentsCount] = useState(1);
  const [mainParentsNames, setMainParentsNames] = useState([""]);
  const [Description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [Loading, setLoading] = useState(false);

  // Function to handle image upload
  const handleImageUpload = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setThumbnail(result.assets[0].uri);
    }
  };

  // Function to handle the submission
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const ImageUri = await cloudinaryImageUri(thumbnail);

      const requestData = {
        treeName: familyTreeName,
        description: Description,
        main_parent: mainParentsNames,
        thumbnail: ImageUri,
        createdBy: UserCurrentEmail,
      };

      console.log("Request Data:", requestData);
      const responce = await axios.post(
        "http://192.168.80.236:3000/familytree",
        requestData
      );
      if (responce.status === 200) {
        console.log("Response is: ", responce.data.success);
        // You may want to handle successful submission here (e.g., show a success message)
      } else {
        console.log("Response was not successful.");
      }
    } catch (error) {
      console.log("error occupied", error);
    } finally {
      setLoading(false);
      setFamilyTreeName("");
      setDescription("");
      setMainParentsNames([""]); // Reset to an array with one empty string
      setThumbnail("");
      setModalVisible(false);
    }
  };

  // Update main parents names array based on count
  const handleMainParentsCountChange = (count) => {
    setMainParentsCount(count);
    setMainParentsNames(
      Array.from({ length: count }, (_, i) => mainParentsNames[i] || "")
    );
  };

  // Filtered user tree based on search query
  const filteredUserTree = userTree.filter((item) =>
    item.treeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={{ flex: 1, marginTop: 40, padding: 20 }}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <ScrollView style={styles.modalContent}>
            {/* Close Button */}
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>✖️</Text>
            </TouchableOpacity>

            {/* Thumbnail Upload */}
            <TouchableOpacity
              onPress={handleImageUpload}
              style={styles.thumbnailContainer}
            >
              {thumbnail ? (
                <Image source={{ uri: thumbnail }} style={styles.thumbnail} />
              ) : (
                <Text style={styles.uploadText}>Upload Thumbnail</Text>
              )}
            </TouchableOpacity>

            {/* Family Tree Name Input */}
            <Text style={styles.label}>Family Tree Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Family Tree Name"
              value={familyTreeName}
              onChangeText={setFamilyTreeName}
            />

            {/* Family Tree Description Input */}
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Description"
              value={Description}
              onChangeText={setDescription}
            />

            {/* Main Parents Count */}
            <Text style={styles.label}>Number of Main Parents</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter number (1-5)"
              keyboardType="numeric"
              value={mainParentsCount.toString()}
              onChangeText={(value) =>
                handleMainParentsCountChange(Number(value))
              }
            />

            {/* Main Parents Names */}
            {Array.from({ length: mainParentsCount }, (_, i) => (
              <View key={i} style={styles.parentInputContainer}>
                <Text style={styles.label}>Main Parent {i + 1}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={`Enter name of Main Parent ${i + 1}`}
                  value={mainParentsNames[i]}
                  onChangeText={(text) => {
                    const newNames = [...mainParentsNames];
                    newNames[i] = text;
                    setMainParentsNames(newNames);
                  }}
                />
              </View>
            ))}

            {/* Submit Button */}
            {Loading ? (
              <TouchableOpacity style={styles.submitButton} disabled={true}>
                <ActivityIndicator size="small" color={Colors.WHITE} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
              >
                <Text style={styles.buttonText}>Create</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </Modal>

      {/* Header Section with Title and Search Icon */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>Family Tree</Text>

        {/* Search Icon */}
        <TouchableOpacity
          onPress={() => setSearchBarVisible(!isSearchBarVisible)}
        >
          <Ionicons name="search" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Search Bar Section */}
      {isSearchBarVisible && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#f0f0f0",
            borderRadius: 8,
            paddingHorizontal: 10,
            paddingVertical: 5,
            elevation: 3,
          }}
        >
          <TextInput
            placeholder="Find here..."
            style={{
              flex: 1,
              fontSize: 16,
              paddingVertical: 10,
              paddingHorizontal: 10,
            }}
            value={searchQuery} // Controlled input for search
            onChangeText={setSearchQuery} // Update search query state
          />

          {/* Close Button */}
          <TouchableOpacity onPress={() => { setSearchBarVisible(false); setSearchQuery(''); }}>
          <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
        </View>
      )}

      {/* FlatList with filtered data */}
      {filteredUserTree.length === 0 ? (
        <Text
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            right: 0,
            textAlign: "center",
            color: Colors.GRAY,
            elevation: 7,
          }}
        >
          No family trees found.
        </Text>
      ) : (
        <Animated.FlatList
          data={filteredUserTree} // Use filtered data
          showsVerticalScrollIndicator={false}
          inverted={true}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(`familytree/index`, {
                  treeId: item._id,
                })
              }
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 20,
                backgroundColor: "#f9f9f9",
                marginVertical: 8,
                borderRadius: 10,
                shadowColor: "#000",
                shadowOpacity: 0.1,
                shadowRadius: 5,
                elevation: 7,
              }}
              activeOpacity={0.7}
            >
              {/* Family Tree Image */}
              <Image
                source={{
                  uri:
                    item?.thumbnail ||
                    "https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg",
                }}
                style={{        
                  width: 60,
                  height: 60,
                  borderRadius: 50,
                  marginRight: 20,
                }}
              />
              <View>
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                  {item?.treeName || "Unnamed Tree"}
                </Text>
  
                <Text style={{ fontSize: 14, color: "#555" }}>
                  {item?.members?.length
                    ? `${item.members.length} members`
                    : "No members"}
                </Text>
              </View>
              <AntDesign
                name="right"
                size={24}
                color="black"
                style={{
                  position: "absolute",
                  right: 20,
                  color: Colors.SECONDARY,
                  fontWeight: "600",
                  textAlign: "center",
                }}
              />
            </TouchableOpacity>
          )}
          onScroll={handleScroll}
          scrollEventThrottle={16} // Smooth scrolling tracking
        />
      )}

      {/* Bottom Center Button with Animation */}
      <Animated.View
        style={{
          position: "absolute",
          bottom: 10,
          left: '50%',
          transform: [
            { translateX: -5 }, // Center horizontally
            { scale: buttonAnimation }, // Scale for zoom animation
          ],
          opacity: buttonAnimation, // Fade animation
          shadowColor: "#000",
          shadowOpacity: 0.2,
          shadowRadius: 10,
          elevation: 5,
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: Colors.PRIMARY,
            padding: 14,
            borderRadius: 50,
          }}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons
            name="add"
            size={24}
            style={{
              color: Colors.WHITE,
              fontWeight: "900",
              textAlign: "center",
            }}
          />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dim background
  },
  modalContent: {
    width: "90%",
    maxHeight: "90%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    elevation: 5,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 20,
    color: "#FF4D4D",
  },
  thumbnailContainer: {
    width: "100%",
    height: 120,
    backgroundColor: "#eaeaea",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 20,
  },
  thumbnail: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  uploadText: {
    color: "#7f8c8d",
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    alignSelf: "flex-start",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  parentInputContainer: {
    width: "100%",
  },
  submitButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    borderRadius: 20,
    marginTop: 15,
    marginBottom: 40,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default Tree;
