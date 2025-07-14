import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { logRequest } from "./../func/logFunc"
import { router, useFocusEffect } from "expo-router";
import { useShallow } from "zustand/react/shallow";
import useLogin from "./../func/store/useUserLogin";
import { saveToken } from './../func/global/authStorage';

const LoginScreen = () => {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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

  const handleLogin = () => {

    if(user===''){
      Alert.alert('Error', 'Username harus diisi.');
      return;
    }

    if(password===''){
      Alert.alert('Error', 'Password harus diisi.');
      return;
    }

    var bodyFormData = new FormData();
    bodyFormData.append('username', user);
    bodyFormData.append('password', password);

    logRequest(bodyFormData)
      .then(async response => {
        if(response["status"]=="error"){
          Alert.alert('Error', response["message"]);
          return;
        }else{
          await saveToken(user);
          setNamaUser(response.datauser[0]["NamaPeg"]);
          setUserName(user);
          setLogin(true);
          saveToken(user);
          router.navigate("homeScreen");
        }
      })
      .catch(error => {
        Alert.alert('Error', error);
      });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <Text style={styles.title}>Selamat Datang</Text>
        <Text style={styles.subtitle}>Silakan login untuk melanjutkan</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          autoCapitalize="none"
          value={user}
          onChangeText={setUser}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'}
              size={24}
              color="#888"
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Masuk</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    color: '#222831',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#777777',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 48,
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    marginBottom: 24,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#2783B7',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default LoginScreen;
