import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { StatusBar } from "expo-status-bar";
import { updateProfFunc } from "./../func/logFunc";

import { useShallow } from "zustand/react/shallow";
import useLogin from "./../func/store/useUserLogin";


export default function ubahProfileScreen() {
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(false);


  const {
        userName,
        namaUser,
        setNamaUser,
    } = useLogin(
        useShallow((state: any) => ({
            userName: state.userName,
            namaUser:state.namaUser,
            setNamaUser:state.setNamaUser
        }))
    );

  const validate = () => {
    if (!newName) return 'Nama tidak boleh kosong.';
    return null;
  };

  const handleChangeProfile = async () => {
    const err = validate();
    if (err) {
      Alert.alert('Perhatian', err);
      return;
    }

    try {
      setLoading(true);
      var bodyFormData = new FormData();

      bodyFormData.append('username', userName);
      bodyFormData.append('newname', newName);

      updateProfFunc(bodyFormData)
            .then(async response => {
              if(response["status"]=="error"){
                Alert.alert('Error', response["message"]);
                return;
              }else{
                Alert.alert('Berhasil', 'Profile berhasil diubah');
                setNewName('');
                setNamaUser(newName);
              }
            })
            .catch(error => {
              Alert.alert('Error', error);
            });

    } catch (e) {
      Alert.alert('Kesalahan', 'Terjadi kesalahan. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" backgroundColor='#fff' />
      {/* Header */}
      <View style={{ flexDirection: "row", marginBottom: 10 }}>
        <TouchableOpacity onPress={()=>{router.back();}} style={{
          padding: 15,
          marginTop: 10,
          borderWidth: 0.5,
          width: 45,
          borderRadius: 10,
          borderColor: "#d1d1d1",
        }}
        >
          <Text style={{}}>
            <FontAwesome size={14} name="chevron-left" color="#2783B7" />
          </Text>
        </TouchableOpacity>
        <View style={{ padding: 15, marginTop: 4 }}>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}> Ubah Profile</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >

            {/* Username */}
          <Text style={styles.label}>Username</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.inputWithIcon}
              value={userName}
              onChangeText={setNamaUser}
              autoCapitalize="none"
              readOnly
            />
          </View>


          {/* Nama */}
          <Text style={styles.label}>Nama</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.inputWithIcon}
              value={newName===''?namaUser:newName}
              onChangeText={setNewName}
              autoCapitalize="none"
            />
          </View>


          {/* Tombol submit */}
          <TouchableOpacity
            style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
            onPress={handleChangeProfile}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator />
            ) : (
              <Text style={styles.submitText}>Ubah Profile</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
        marginTop: 50,
        paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 14,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  scrollContent: {
    flexGrow: 1,
  },
  label: {
    fontSize: 14,
    marginTop: 8,
    marginBottom: 6,
  },
  inputWrapper: {
    position: 'relative',
    marginBottom: 10,
  },
  inputWithIcon: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: 'white',
    paddingRight: 40, // ruang untuk icon
  },
  iconInside: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -11 }],
  },
  submitBtn: {
    backgroundColor: '#0085c8', 
    paddingVertical: 10, 
    borderRadius: 10, 
    marginRight: 5,
    alignItems: 'center',
    marginTop:20
  },
  submitBtnDisabled: {
    opacity: 0.7,
  },
  submitText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  cancelBtn: {
    marginTop: 14,
    alignItems: 'center',
  },
  cancelText: {
    color: '#6b7280',
    fontSize: 14,
  },
});
