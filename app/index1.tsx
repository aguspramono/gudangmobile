import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import React, { useEffect } from 'react';

function Splash() {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("./../assets/images/back.png")}
        resizeMode="cover"
        style={styles.image}
      >
        <Text style={{ color: "#ffffff", fontSize: 18, fontWeight: "bold" }}>
          PT. Swastisiddhi Amagra
        </Text>

        <Pressable
          onPress={() => router.navigate("/loginScreen")}
          style={{
            backgroundColor: "#3db61b",
            paddingHorizontal: 25,
            paddingVertical: 10,
            borderRadius: 20,
            marginTop: 20,
          }}
        >
          <Text style={{ color: "#ffffff" }}>Get Started</Text>
        </Pressable>
      </ImageBackground>

      <StatusBar style="light" />
    </View>
  );
}

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
