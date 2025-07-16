import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import React, { useEffect, useState } from 'react';
import { useShallow } from "zustand/react/shallow";
import useLogin from "./../func/store/useUserLogin";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { deleteToken } from './../func/global/authStorage';
import { getDatauserFun,checkLogin } from "./../func/logFunc"

function profileScreen() {
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
        await deleteToken();
        router.navigate("/");
    }

    useEffect(() => {
        getDataUser();
    }, []);

    return (
        <View style={styles.container}>
            <View style={{ alignItems: "center", justifyContent: "center", }}>
                <View>
                     <Image
                    source={{ uri: 'https://i.pravatar.cc/100' }}
                    style={[
                        styles.circleImageLayout,
                        styles.centerItem,
                        { marginTop: 70 },
                    ]}
                />
                <Text style={{ fontSize: 18,fontWeight: "bold",textAlign:'center',marginTop: 20,textTransform:'capitalize' }}>{namaUser}</Text>
                </View>
               
                <TouchableOpacity
                    style={[
                        styles.menuButton,
                        {
                            marginTop: 50,
                            width: "100%",
                            alignItems: "center",
                            justifyContent: "center",
                            borderColor: "#3db61b",
                        },
                    ]}
                >
                    <View>
                        <Text
                            style={[
                                styles.textMenuButton,
                                { marginLeft: 5, color: "#3db61b" },
                            ]}
                        >Ubah Profile</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.menuButton,
                        {
                            marginTop: 10,
                            width: "100%",
                            alignItems: "center",
                            justifyContent: "center",
                            borderColor: "#3db61b",
                        },
                    ]}
                >
                    <View>
                        <Text
                            style={[
                                styles.textMenuButton,
                                { marginLeft: 5, color: "#3db61b" },
                            ]}
                        >
                            {" "}
                            Ubah Password
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.menuButton,
                        {
                            marginBottom: 100,
                            marginTop: 10,
                            width: "100%",
                            alignItems: "center",
                            justifyContent: "center",
                            borderColor: "#b61b1b",
                        },
                    ]}
                    onPress={()=>handleLogout()}
                >
                    <View>
                        <Text style={{}}>
                            <MaterialCommunityIcons size={18} name="logout" color="#b61b1b" />
                        </Text>
                    </View>
                    <View>
                        <Text
                            style={[
                                styles.textMenuButton,
                                { marginLeft: 5, color: "#b61b1b" },
                            ]}
                        >Keluar</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <StatusBar style="light" />
        </View>
    );
}

export default profileScreen;

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: "transparent",
    marginTop: 20,
    paddingHorizontal: 20,
},
image: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
},
circleImageLayout: {
    width: 120,
    height: 120,
    borderRadius: 200 / 2,
},
centerItem: {
    alignItems: "center",
},
menuButton: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 0.5,
},
textMenuButton: {
    justifyContent: "center",
},
});
