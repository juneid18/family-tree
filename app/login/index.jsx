import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import Colors from "../../constants/Colors";
import * as WebBrowser from "expo-web-browser";
import { useOAuth } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";

const Index = () => {
  useWarmUpBrowser();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const [loading, setLoading] = useState(false);

  const onPress = React.useCallback(async () => {
    setLoading(true);
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow({
          redirectUrl: Linking.createURL("/(tabs)/home", { scheme: "myapp" }),
        });

      if (createdSessionId) {
        setActive({ session: createdSessionId });
      } else {
        // Use signIn or signUp for next steps such as MFA
        console.log("User needs to sign in or sign up");
      }
    } catch (err) {
      console.error("OAuth error", err);
    } finally {
      setLoading(false);
    }
  }, [startOAuthFlow]);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Image
        source={require("../../assets/images/tree.png")}
        style={{
          width: "100%",
          height: 300,
          resizeMode: "cover",
        }}
      />
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          marginTop: 20,
        }}
      >
        Welcome to familyTree
      </Text>
      <Text
        style={{
          padding: 20,
          textAlign: "center",
          fontSize: 14,
          color: Colors.SECONDARY,
        }}
      >
        Discover and connect with your family history. Create manage, and
        explore your family trees with ease.
      </Text>
      <TouchableOpacity
        style={{
          backgroundColor: Colors.PRIMARY,
          paddingHorizontal: 100,
          paddingVertical: 14,
          borderRadius: 20,
          fontSize: 20,
          top: 100,
        }}
        onPress={onPress}
        disabled={loading} // Disable button when loading
      >
        {loading ? (
          <ActivityIndicator size="small" color={Colors.WHITE} />
        ) : (
          <Text style={{ color: Colors.WHITE, fontWeight: "bold" }}>
            Get Started
          </Text>
        )}
      </TouchableOpacity>
      <Text
        style={{
          fontSize: 10,
          margin: 10,
          paddingTop: 20,
        }}
      >
        By continuing, you agree to our terms and conditions.
      </Text>
    </View>
  );
};

export default Index;

export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();
