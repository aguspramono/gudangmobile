import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, StatusBar, Animated, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from "expo-router";
import { useShallow } from "zustand/react/shallow";
import useLogin from "./../func/store/useUserLogin";

export default function HomeScreen() {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedCategoryMaster, setSelectedCategoryMaster] = useState(null);
    
    const scaleAnim = new Animated.Value(1);

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
            setNamaUser: state.setNamaUser,
        }))
    );

    const transaksi = [
        { id: '0', label: 'Pesan', icon: 'check-circle-outline', color: '#A0C4FF', count: 12 },
        { id: '1', label: 'Order', icon: 'progress-clock', color: '#A0C4FF', count: 5 },
        { id: '2', label: 'Terima', icon: 'clipboard-text-outline', color: '#A0C4FF', count: 8 },
        { id: '3', label: 'Keluar', icon: 'exit-to-app', color: '#A0C4FF', count: -1 },
        { id: '4', label: 'Mutasi', icon: 'sync', color: '#A0C4FF', count: -1 },
        { id: '5', label: 'C. Pesan', icon: 'window-closed', color: '#A0C4FF', count: -1 },
        { id: '6', label: 'C. Order', icon: 'window-closed', color: '#A0C4FF', count: -1 },
        { id: '7', label: 'Retur', icon: 'keyboard-return', color: '#A0C4FF', count: -1 },
        // { id: '8', label: 'Adjust', icon: 'adjust', color: '#A0C4FF', count: -1 },
        // { id: '9', label: 'Hutang', icon: 'cash-100', color: '#A0C4FF', count: -1 },
    ];

    const master = [
        { id: '0', label: 'Distribusi', icon: 'distribute-horizontal-center', color: '#9DE0AD', count: 12 },
        { id: '1', label: 'Kategori', icon: 'clipboard-list', color: '#9DE0AD', count: 5 },
        { id: '2', label: 'Satuan', icon: 'clipboard-text-outline', color: '#9DE0AD', count: 8 },
        { id: '3', label: 'Merek', icon: 'clipboard-text-outline', color: '#9DE0AD', count: -1 },
        { id: '4', label: 'Gudang', icon: 'warehouse', color: '#9DE0AD', count: -1 },
        { id: '5', label: 'Lokasi', icon: 'google-maps', color: '#9DE0AD', count: -1 },
        { id: '6', label: 'Customer', icon: 'face-man', color: '#9DE0AD', count: -1 },
        { id: '7', label: 'Supplier', icon: 'face-man', color: '#9DE0AD', count: -1 },
    ];

    const handlePressTransaksi = (itemId) => {
        setSelectedCategory(itemId);
        if (itemId == "0") {
            router.navigate({ pathname: "pesananScreen" });
        } else if (itemId == "1") {
            router.navigate({ pathname: "orderScreen" });
        } else if (itemId == "2") {
            router.navigate({ pathname: "terimaScreen" });
        }else if (itemId == "3") {
            router.navigate({ pathname: "keluarScreen" });
        }else if (itemId == "4") {
            router.navigate({ pathname: "mutasiScreen" });
        }else if (itemId == "5") {
            router.navigate({ pathname: "closingPesananScreen" });
        }else if (itemId == "6") {
            router.navigate({ pathname: "closingOrderScreen" });
        }else if (itemId == "7") {
            router.navigate({ pathname: "returPenerimaanScreen" });
        }
        Animated.sequence([
            Animated.timing(scaleAnim, { toValue: 1.1, duration: 100, useNativeDriver: true }),
            Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
        ]).start();
    };


     const handlePressMaster = (itemId) => {
        setSelectedCategoryMaster(itemId);
        // if (itemId == "0") {
        //     router.navigate({ pathname: "pesananScreen" });
        // } else if (itemId == "1") {
        //     router.navigate({ pathname: "orderScreen" });
        // } else if (itemId == "2") {
        //     router.navigate({ pathname: "terimaScreen" });
        // }else if (itemId == "3") {
        //     router.navigate({ pathname: "keluarScreen" });
        // }
        Animated.sequence([
            Animated.timing(scaleAnim, { toValue: 1.1, duration: 100, useNativeDriver: true }),
            Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
        ]).start();
    };
    const renderTransaksi = ({ item }) => {
        const isSelected = item.id === selectedCategory;
        
        return (
            <TouchableOpacity onPress={() => handlePressTransaksi(item.id)}>
                <Animated.View
                    style={[styles.categoryItem, {
                        backgroundColor: item.color + '20',
                        transform: [{ scale: isSelected ? scaleAnim : 1 }],
                    }]}
                >
                    <View style={[styles.categoryIcon, { backgroundColor: item.color }]}>
                        <MaterialCommunityIcons name={item.icon} size={20} color="#fff" />
                    </View>
                    <Text style={[styles.categoryLabel, isSelected && { color: '#000' }]}>{item.label}</Text>
                </Animated.View>
            </TouchableOpacity>
        );
    };

    const renderMaster = ({ item }) => {
        const isSelectedMaster = item.id === selectedCategoryMaster;

        return (
            <TouchableOpacity onPress={() => handlePressMaster(item.id)}>
                <Animated.View
                    style={[styles.categoryItem, {
                        backgroundColor: item.color + '20',
                        transform: [{ scale: isSelectedMaster ? scaleAnim : 1 }],
                    }]}
                >
                    <View style={[styles.categoryIcon, { backgroundColor: item.color }]}>
                        <MaterialCommunityIcons name={item.icon} size={20} color="#fff" />
                    </View>
                    <Text style={[styles.categoryLabel, isSelectedMaster && { color: '#000' }]}>{item.label}</Text>
                </Animated.View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <Text style={{ color: '#585858', fontWeight: 'bold', fontSize: 16, textTransform: 'capitalize' }}>Transaksi</Text>

            <View style={[styles.categoryWrapper, { flexDirection: 'row', flexWrap: 'wrap', gap: 15 }]}>
                {transaksi.map((item) => (
                    <View key={item.id}>
                        {renderTransaksi({ item })}
                    </View>
                ))}
            </View>

            {/* <Text style={{ color: '#585858', fontWeight: 'bold', fontSize: 16, textTransform: 'capitalize' }}>Master</Text>

            <View style={[styles.categoryWrapper, { flexDirection: 'row', flexWrap: 'wrap', gap: 15 }]}>
                {master.map((item) => (
                    <View key={item.id}>
                        {renderMaster({ item })}
                    </View>
                ))}
            </View> */}

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        marginTop: 50,
        paddingHorizontal: 20,
    },

    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    categoryWrapper: {
        marginTop:20,
        marginBottom: 20,
    },
    categoryItem: {
        alignItems: 'center',
        padding: 10,
        borderRadius: 15,
        width: 80,
    },
    categoryIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
        position: 'relative',
    },
    categoryLabel: {
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
    },
    badge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: '#FF3B30',
        borderRadius: 10,
        paddingHorizontal: 5,
        paddingVertical: 1,
        minWidth: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
    },
    menuButton: {
        backgroundColor: '#F1F1F6',
        padding: 10,
        borderRadius: 25,
    },
    avatarContainer: {
        padding: 5,
        borderRadius: 10,
    },
    avatar: {
        width: 35,
        height: 35,
        borderRadius: 15,
    },

    headerProfile: {
        marginBottom: 25,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});
