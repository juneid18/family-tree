import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  FlatList,
  RefreshControl,
} from "react-native";
import React, { useState } from "react";
import Colors from "../../../constants/Colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import axios from "axios";

const Event = ({ treeDetails }) => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const handleSubmit = async () => {
    if (!eventTitle || !eventDescription) {
      Alert.alert("Validation Error", "Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      const requestData = {
        treeId: treeDetails._id,
        event: {
          eventName: eventTitle,
          eventdescription: eventDescription,
        },
      };

      const response = await axios.post(
        "http://192.168.80.236:3000/addevent",
        requestData
      );

      if (response.status === 200) {
        Alert.alert("Success", "Event added successfully!");
        // Optionally, refresh the treeDetails to get the latest event.
        onRefresh(); // Call the refresh function to reload data after adding event
      } else {
        Alert.alert("Error", "Failed to add event. Please try again.");
      }
    } catch (error) {
      console.log("Error occurred:", error);
      Alert.alert("Error", "An error occurred. Please try again later.");
    } finally {
      setLoading(false);
      setEventTitle("");
      setEventDescription("");
      setModalVisible(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulating a network request. You can replace this with your API call to fetch updated tree details.
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      {/* Modal for Creating Event */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View style={styles.modalContainer}>
          <ScrollView style={styles.modalContent}>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>✖️</Text>
            </TouchableOpacity>

            <Text style={styles.label}>Event Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Event Title"
              onChangeText={setEventTitle}
              value={eventTitle}
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.inputDesc}
              placeholder="Enter Description"
              onChangeText={setEventDescription}
              value={eventDescription}
            />

            {loading ? (
              <TouchableOpacity style={styles.submitButton} disabled={true}>
                <ActivityIndicator size="small" color={Colors.WHITE} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
              >
                <Text style={styles.buttonText}>Add Event</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </Modal>

      {/* Event Card */}
      <FlatList
      showsVerticalScrollIndicator={false}
        data={treeDetails.event}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.headerText}>
              <MaterialIcons name="event" size={24} color={Colors.WHITE} />{" "}
              Events
            </Text>
            <View style={styles.detailsContainer}>
              <Text style={styles.eventTitle}>{item.eventName}</Text>
              <Text style={styles.eventDate}>
                Date: {new Date(item.eventCreatedAt).toLocaleString()}
              </Text>
              <Text style={styles.eventDescription}>
                {item.eventdescription}
              </Text>
            </View>
          </View>
        )}
      />

      {/* Floating Create Button */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.fab}
      >
        <MaterialIcons name="create" size={24} color={Colors.WHITE} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.WHITE,
  },
  card: {
    width: "100%",
    backgroundColor: "#08619b",
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
    justifyContent: "space-between",
    elevation: 5,
  },
  headerText: {
    color: Colors.WHITE,
    fontSize: 24,
    marginBottom: 10,
    fontWeight: "bold",
  },
  detailsContainer: {
    marginTop: 10,
  },
  eventTitle: {
    color: Colors.WHITE,
    fontSize: 20,
    fontWeight: "bold",
  },
  eventDate: {
    color: Colors.WHITE,
    fontSize: 16,
    marginTop: 5,
  },
  eventDescription: {
    color: Colors.WHITE,
    fontSize: 14,
    marginTop: 5,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: Colors.PRIMARY,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 7,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    maxHeight: "80%",
    overflow: "hidden",
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
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
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
  inputDesc: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
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

export default Event;
