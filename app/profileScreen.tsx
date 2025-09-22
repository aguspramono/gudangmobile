import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { deleteToken } from './../func/global/authStorage';
import { getDatauserFun,deleteTokenNotifUser } from "./../func/logFunc"
import { useShallow } from "zustand/react/shallow";
import useLogin from "./../func/store/useUserLogin";
import { router } from "expo-router";

const ProfileScreen = () => {
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

    const getDataUser = async() =>{
        var bodyFormData = new FormData();
        bodyFormData.append('username', userName);
        const response = await getDatauserFun(bodyFormData);
        setNamaUser(response.datauser[0]['NamaPeg']);
    }
    
    const handleLogout = async () =>{
        var bodyFormData = new FormData();
        bodyFormData.append('username', userName);
        await deleteToken();
        await deleteTokenNotifUser(bodyFormData);
        router.navigate("/");
    }

    const MenuItem = ({ title, icon, isLogout,param }) => (
        <TouchableOpacity style={styles.menuItem} onPress={()=> isLogout?handleLogout():param=="1"?router.navigate({ pathname: "ubahPasswordScreen" }):router.navigate({ pathname: "ubahProfileScreen" })}>
            <Ionicons name={icon} size={20} color={isLogout ? 'tomato' : '#555'} />
            <Text style={[styles.menuText, isLogout && { color: 'tomato' }]}>{title}</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" style={{ marginLeft: 'auto' }} />
        </TouchableOpacity>
        );

    useEffect(() => {
        getDataUser();
    }, []);
  return (
    <ScrollView contentContainerStyle={styles.container}>
        <StatusBar style="light" />
      <View style={styles.header}>
      </View>

      <View style={styles.profileCard}>
        <Image
          source={require('./../assets/images/user.png')}
          style={styles.profileImage}
        />
        <Text style={styles.name}>{namaUser}</Text>
        <Text style={styles.email}>{userName}</Text>

        <View style={styles.infoRow}>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>"Setiap hari adalah kesempatan baru untuk menjadi versi terbaik dari diri kita"</Text>
          </View>
        </View>
      </View>

      <View style={styles.menuList}>
        <MenuItem title="Ubah Profile" icon="person" isLogout={false} param="0"/>
        <MenuItem title="Ubah Password" icon="key" isLogout={false} param="1"/>
        <MenuItem title="Logout" icon="log-out-outline" isLogout param="" />
      </View>

      <View style={{marginTop:30}}><Text style={{textAlign:'center'}}>PT. Swastisiddhi Amagra</Text><Text style={{textAlign:'center'}}>V 1.0</Text></View>

    </ScrollView>
    
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#F6F9F7',
    paddingBottom: 20,
  },
  header: {
    backgroundColor: '#0085c8',
    paddingTop: 0,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    height:200
  },
  headerText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  profileCard: {
    alignItems: 'center',
    marginTop: -80,
    backgroundColor: 'white',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    textTransform:'capitalize',
  },
  email: {
    color: '#888',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  infoBox: {
    flex: 1,
    backgroundColor: '#E5F3ED',
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 10,
  },
  yellowBox: {
    backgroundColor: '#FFD966',
  },
  infoLabel: {
    fontSize: 12,
    color: '#555',
    textAlign:'center'
  },
  infoValue: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  menuList: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  menuItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#333',
  },
});

export default ProfileScreen;
