import {
  View,
  Text,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import Colors from "../../constants/Colors";
import Entypo from "@expo/vector-icons/Entypo";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);

  const handleSearch = () => {
    if (searchQuery.trim() !== "" && !searchHistory.includes(searchQuery)) {
      setSearchHistory([searchQuery, ...searchHistory]);
      setSearchQuery(""); // Clear the input after search
    }
  };

  const removeItemFromHistory = (item) => {
    setSearchHistory(
      searchHistory.filter((historyItem) => historyItem !== item)
    );
  };

  const renderHistoryItem = ({ item }) => (
    <View style={styles.historyItemContainer}>
      <TouchableOpacity onPress={() => setSearchQuery(item)}>
        <Text style={styles.historyItem}>{item}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => removeItemFromHistory(item)}>
        <Entypo
          name="cross"
          size={20}
          color={Colors.GRAY}
          style={styles.removeButton}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/vector-leaf-fall-isolated-transparent-background-autumn-leaves-are-falling-from-tree_156846-1072.png")}
        style={styles.image}
      />
      <TextInput
        placeholder="Search here..."
        style={styles.searchInput}
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch} // Call handleSearch when pressing "Search"
      />
      <Text style={styles.recentSearchesTitle}>Recently searched:</Text>
      {searchQuery === "" && (
        <FlatList
          data={searchHistory}
          renderItem={renderHistoryItem}
          keyExtractor={(item, index) => index.toString()} // Use index as key
          style={styles.historyList}
        />
      )}
      {searchQuery !== "" && searchHistory.length === 0 && (
        <Text style={styles.noHistoryText}>No recent searches available.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 40,
    position: "relative", // To position the image absolutely within the container
    paddingBottom: 20, // Add padding at the bottom to avoid overlap with items
  },
  image: {
    width: "100%",
    height: 100,
    position: "absolute",
    top: 0,
  },
  searchInput: {
    fontSize: 18,
    paddingVertical: 10,
    margin: 16,
    backgroundColor: Colors.LIGHTGRAY, // Changed to use your Colors constant
    borderRadius: 20,
    elevation: 2,
    paddingLeft: 20,
  },
  recentSearchesTitle: {
    padding: 10,
    fontWeight: "bold",
    fontSize: 16,
    color: Colors.SECONDARY, // Adjust color to match your theme
  },
  historyList: {
    marginTop: 10, // Add some margin above the list
  },
  historyItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  historyItem: {
    fontSize: 16,
    color: "#333",
  },
  removeButton: {
    marginLeft: 10, // Space between item text and button
  },
  noHistoryText: {
    padding: 10,
    fontSize: 14,
    color: "#666",
    textAlign: "center", // Center the text
  },
});

export default Search;
