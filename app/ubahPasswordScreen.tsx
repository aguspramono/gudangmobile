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
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { StatusBar } from "expo-status-bar";
import { updatePassFunc } from "./../func/logFunc";

import { useShallow } from "zustand/react/shallow";
import useLogin from "./../func/store/useUserLogin";


export default function UbahPasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);


  const {
        userName,
    } = useLogin(
        useShallow((state: any) => ({
            userName: state.userName,

        }))
    );



  const validate = () => {
    if (!currentPassword) return 'Masukkan password sekarang.';
    if (!newPassword) return 'Masukkan password baru.';
    if (newPassword.length < 8) return 'Password baru minimal 8 karakter.';
    if (newPassword !== confirmPassword) return 'Konfirmasi password tidak cocok.';
    if (newPassword === currentPassword) return 'Password baru tidak boleh sama dengan password sekarang.';
    return null;
  };

  const handleChangePassword = async () => {
    const err = validate();
    if (err) {
      Alert.alert('Perhatian', err);
      return;
    }

    try {
      setLoading(true);
      var bodyFormData = new FormData();

      bodyFormData.append('username', userName);
      bodyFormData.append('password', currentPassword);
      bodyFormData.append('newpassword', newPassword);

      updatePassFunc(bodyFormData)
            .then(async response => {
              if(response["status"]=="error"){
                Alert.alert('Error', response["message"]);
                return;
              }else{
                Alert.alert('Berhasil', 'Password berhasil diubah');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('')
              }
            })
            .catch(error => {
              Alert.alert('Error', error);
            });



    } catch (e) {
      Alert.alert('Kesalahan', 'Terjadi kesalahan. Coba lagi.');
      console.error('change-password error', e);
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
          <Text style={{ fontSize: 16, fontWeight: "bold" }}> Ubah Password</Text>
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
          {/* Password sekarang */}
          <Text style={styles.label}>Password Sekarang</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.inputWithIcon}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry={!showCurrent}
              placeholder="Masukkan password sekarang"
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={() => setShowCurrent(v => !v)}
              style={styles.iconInside}
            >
              <Ionicons
                name={showCurrent ? 'eye-off' : 'eye'}
                size={22}
                color="#6b7280"
              />
            </TouchableOpacity>
          </View>

          {/* Password baru */}
          <Text style={styles.label}>Password Baru</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.inputWithIcon}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showNew}
              placeholder="Masukkan password baru"
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={() => setShowNew(v => !v)}
              style={styles.iconInside}
            >
              <Ionicons
                name={showNew ? 'eye-off' : 'eye'}
                size={22}
                color="#6b7280"
              />
            </TouchableOpacity>
          </View>

          {/* Konfirmasi password baru */}
          <Text style={styles.label}>Konfirmasi Password Baru</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.inputWithIcon}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirm}
              placeholder="Ketik ulang password baru"
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={() => setShowConfirm(v => !v)}
              style={styles.iconInside}
            >
              <Ionicons
                name={showConfirm ? 'eye-off' : 'eye'}
                size={22}
                color="#6b7280"
              />
            </TouchableOpacity>
          </View>

          {/* Tombol submit */}
          <TouchableOpacity
            style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
            onPress={handleChangePassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator />
            ) : (
              <Text style={styles.submitText}>Ganti Password</Text>
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
