import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import React, { useEffect, useState } from 'react';
import { getToken } from './../func/global/authStorage';
import { useShallow } from "zustand/react/shallow";
import useLogin from "./../func/store/useUserLogin";
import { checkToken } from "./../func/logFunc"



function Splash() {
   const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

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
      namaUser:state.namaUser,
      setNamaUser:state.setNamaUser

    }))
  );

  const checkLogin = async () => {
    
        const token = await getToken();
        var bodyFormData = new FormData();
        bodyFormData.append('token', token);

          checkToken(bodyFormData)
            .then(async response => {

              setNamaUser(response.datauser[0]["NamaPeg"]);
              setUserName(response.datauser[0]["Username"]);
              setLogin(true);
            })
            .catch(error => {
              console.log('Error', error);
            });


        if (!!token === null) {
          router.navigate("index");
        }else{
         router.navigate("homeScreen");
        }
        //setIsLoggedIn(!!token);
      };

    useEffect(() => {
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
