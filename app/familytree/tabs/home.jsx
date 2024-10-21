import React, { useState } from 'react';
import { WebView } from 'react-native-webview';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { TouchableOpacity } from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from '../../../constants/Colors';


export default function App({ treeDetails }) {
  // console.log("Tree Details in Home:", treeDetails);
  const [loading, setLoading] = useState(true);
  return (
    <View style={styles.container}>
      {loading && (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={styles.loader}
        />
      )}
      <WebView
        style={styles.webview}
        source={require('../../../assets/FamilyTree/index.html')}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
      />

      <TouchableOpacity style={{
        width:50,
            backgroundColor: Colors.PRIMARY,
            padding: 12,
            borderRadius: 50,
            position:'absolute',
            bottom:10,
            right:20
      }}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
});



