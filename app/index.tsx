import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
  Alert,
  BackHandler,
  ToastAndroid 
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getToken } from './../func/global/authStorage';
import { useShallow } from "zustand/react/shallow";
import useLogin from "./../func/store/useUserLogin";
import { checkToken } from "./../func/logFunc";
import { chekPremissionAndGetToken } from "./../func/global/premissionNotif";
import { useFocusEffect } from '@react-navigation/native';

function Splash() {
  const lastBackPressed = useRef(0);
  const {
    isLogin,
    setLogin,
    userName,
    setUserName,
    namaUser,
    setNamaUser,
  } = useLogin(
    useShallow((state: any) => ({
      isLogin: state.isLogin,
      setLogin: state.setLogin,
      userName: state.userName,
      setUserName: state.setUserName,
      namaUser: state.namaUser,
      setNamaUser: state.setNamaUser
    }))
  );

  const checkLogin = async () => {
    const token = await getToken();
    if (token === null) {
      router.navigate("/");
    } else {
      var bodyFormData = new FormData();
      bodyFormData.append('token', token);
      checkToken(bodyFormData)
        .then(response => {
          if (response["status"] === "error") {
            Alert.alert(response["message"]);
            router.navigate("/");
          } else {
            setNamaUser(response.datauser[0]["NamaPeg"]);
            setUserName(response.datauser[0]["Username"]);
            setLogin(true);
          }
        })
        .catch(error => {
          console.log('Error', error);
        });
      router.navigate("homeScreen");
    }
  };

  const checkprem = async() =>{
    const a = await chekPremissionAndGetToken();
    console.log(a);
  }


  useFocusEffect(
      useCallback(() => {
        const backAction = () => {
          const timeNow = Date.now();
          if (lastBackPressed.current && timeNow - lastBackPressed.current < 2000) {
            BackHandler.exitApp();
            return true;
          }

          lastBackPressed.current = timeNow;
          ToastAndroid.show('Tekan kembali sekali lagi untuk keluar', ToastAndroid.SHORT);
          return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );

      return () => backHandler.remove();
    }, [])
  );

  useEffect(() => {
    checkprem();
    checkLogin();
    
  }, []);

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
          onPress={() => {checkprem(),router.navigate("/loginScreen")}}
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
