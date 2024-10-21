import { View, Text, TextInput, StyleSheet, FlatList, Image } from "react-native";
import React, { useState } from "react"; 
import Colors from '../../../constants/Colors';

const Member = ({ treeDetails }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Assuming treeDetails.members is an array of email strings, we filter based on email
  const filteredMembers = treeDetails?.members?.filter(member =>
    member.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Search Member</Text>
      <TextInput
        placeholder="Search"
        placeholderTextColor={Colors.GRAY}
        style={styles.input}
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      
      {filteredMembers && filteredMembers.length > 0 ? (
        <FlatList
          data={filteredMembers}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <View style={styles.card}>
                <Text style={styles.memberName}>{item}</Text> 
            </View>
          )}
          showsVerticalScrollIndicator={false}
          style={styles.memberList}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : (
        <Text style={styles.noMemberText}>No Members Found</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.WHITE,
  },
  headerText: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    color: Colors.SECONDARY,
  },
  input: {
    backgroundColor: Colors.LIGHTGRAY,
    borderWidth: 1,
    borderColor: Colors.GRAY,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 10,
    borderRadius: 10,
    elevation: 3,
  },
  memberList: {
    marginTop: 20,
  },
  card: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 10,
    backgroundColor: Colors.WHITE,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.GRAY,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
    borderWidth: 2,
    borderColor: Colors.PRIMARY,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  memberName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.SECONDARY,
  },
  memberDetails: {
    fontSize: 14,
    color: Colors.GRAY,
    marginTop: 4,
  },
  noMemberText: {
    textAlign: 'center',
    fontSize: 16,
    color: Colors.GRAY,
    position: 'absolute',
    top: '50%',
    left: '45%',
  }
});

export default Member;
