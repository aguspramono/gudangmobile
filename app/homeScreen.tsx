import React, { useEffect, useState, useCallback,useRef } from 'react';
import { ScrollView, RefreshControl,BackHandler,ToastAndroid } from 'react-native';
import { View, Text, StyleSheet, FlatList, Animated, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { getAllPesananRequest } from './../func/pesananFunc';
import { router, useFocusEffect } from "expo-router";
import { useShallow } from "zustand/react/shallow";
import useLogin from "./../func/store/useUserLogin";
import { StatusBar } from "expo-status-bar";


export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedOrderBarang, setSelectedOrderBarang] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const scaleAnim = new Animated.Value(1);
  const lastBackPressed = useRef(0);

  const [pesananbarang, setPesananBarang] = useState<any[]>([]);

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

  const getDataPesananBarang = async () => {
    const orderbarang = [];
    const response = await getAllPesananRequest("", 0, 10, "all", "Nomor Pesanan", "2025-01-01", "2025-12-31", "", "", "pending");
    response.map((item, i) => (
      orderbarang.push({
        id: item.NoPesanan + i,
        inv: item.NoPesanan,
        detail: item.Qtty + ' item pesanan barang',
        tanggal: item.tanggal,
        statusdiset: item.statusdiset,
        statusdiket: item.statusdiket,
        disetujui: item.disetujui,
        diketahui: item.diketahui,
      })
    ));
    setPesananBarang(orderbarang);
  };

  const categories = [
    { id: '0', label: 'Pesan', icon: 'check-circle-outline', color: '#9DE0AD', count: 12 },
    { id: '1', label: 'Order', icon: 'progress-clock', color: '#FFB6B6', count: 5 },
    { id: '2', label: 'Terima', icon: 'clipboard-text-outline', color: '#FFD666', count: 8 },
    { id: '3', label: 'Semua', icon: 'view-dashboard-outline', color: '#A0C4FF', count: -1 },
  ];

  const handlePress = (itemId) => {
    setSelectedCategory(itemId);
    if(itemId=="0"){
      router.navigate({ pathname: "pesananScreen" });
    }else if(itemId=="1"){
      router.navigate({ pathname: "orderScreen" });
    }else if(itemId=="2"){
      router.navigate({ pathname: "terimaScreen" });
    }else if(itemId=="3"){
      router.navigate({ pathname: "menuScreen" });
      //router.navigate({ pathname: "kasirscreen" });
    }
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.1, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const handleProfile = () =>{
    router.navigate('profileScreen');
  }

  const handlePressOrderBarang = (itemId) => {
    router.navigate({ pathname: "detailPesanBarang", params: { id: itemId } });
    setSelectedOrderBarang(itemId);
  };

  const renderCategory = ({ item }) => {
    const isSelected = item.id === selectedCategory;

    return (
      <TouchableOpacity onPress={() => handlePress(item.id)}>
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


  const renderOrderBarang = ({ item }) => {
  if (!item || !item.inv || !item.tanggal || !item.detail) {
    return null;
  }

  const statusLabel = 
    item.statusdiset === "pending" || item.diketahui === "pending"
      ? "Menunggu"
      : item.statusdiset;

  return (
    <TouchableOpacity
      style={{
        marginTop: 8,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 15,
        backgroundColor: '#fff',
      }}
      onPress={() => handlePressOrderBarang(item.inv)}
    >
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontWeight: 'bold', color: '#585858' }}>
            {item.inv}
          </Text>
          <Text style={{ color: '#585858', fontSize: 12 }}>
            {item.tanggal}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text style={{ marginTop: 5 }}>{item.detail}</Text>
          <Text
            style={{
              color: '#585858',
              fontSize: 12,
              backgroundColor: '#FFD666',
              paddingHorizontal: 10,
              paddingVertical: 3,
              marginTop: 5,
              borderRadius: 10,
            }}
          >
            {statusLabel}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getDataPesananBarang();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);


  useFocusEffect(
        useCallback(() => {
        getDataPesananBarang();

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
    getDataPesananBarang();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="dark"/>
      <View style={styles.headerProfile}>
        <Text style={{ color: '#585858', fontWeight: 'bold', fontSize: 16,textTransform:'capitalize' }}>Hi, {namaUser}!</Text>
        <TouchableOpacity style={styles.avatarContainer} onPress={handleProfile}>

          <Image
            source={require('./../assets/images/user.png')} // Ganti dengan avatar user
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.categoryWrapper}>
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
      <Text style={{ color: '#585858', fontWeight: 'bold', fontSize: 18, marginBottom: 5, marginTop: 15 }}>Pesanan Barang</Text>
      <View>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          persistentScrollbar={false}
          style={{ marginBottom: 35 }}
        ><FlatList
            data={pesananbarang}
            renderItem={renderOrderBarang}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
             ListEmptyComponent={
              <View style={{ alignItems: 'center', marginTop: 50 }}>
                <Image
                  source={require('./../assets/images/empty.png')}
                  style={{ width: 150, height: 150, marginBottom: 15 }}
                  resizeMode="contain"
                />
                <Text style={{ textAlign: 'center', color: '#888', fontSize: 16 }}>
                  tidak ada data
                </Text>
              </View>
            }
           /></ScrollView>
      </View>
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
    alignItems: 'center',
    marginBottom: 20,
  },
  categoryItem: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 15,
    marginHorizontal: 6.9,
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
