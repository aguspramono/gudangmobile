import * as Notifications from 'expo-notifications';
import * as Linking from 'expo-linking';
import { Alert, Platform } from 'react-native';


export const chekPremissionAndGetToken = async () => {


    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;


    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
        if (finalStatus === 'undetermined') {
            Alert.alert(
                'Izin Diperlukan',
                'Aplikasi membutuhkan izin notifikasi untuk berfungsi dengan baik.',
                [{ text: 'OK' }]
            );
            return null;
        }

        if (finalStatus !== 'granted') {
            Alert.alert(
            'Izin Diperlukan',
            'Aplikasi membutuhkan izin notifikasi. Buka pengaturan untuk mengaktifkannya.',
            [
                {
                text: 'Buka Pengaturan',
                onPress: () => {
                    if (Platform.OS === 'ios') {
                    Linking.openURL('app-settings:');
                    } else {
                    Linking.openSettings();
                    }
                },
                }
            ]
            );
            return null;
        }
    }else{

      if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
            });
        }
        const tokenData = await Notifications.getExpoPushTokenAsync();
        return tokenData.data;
        
    }
};