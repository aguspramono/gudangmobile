import * as Notifications from 'expo-notifications';
import * as Linking from 'expo-linking';
import { Alert, Platform } from 'react-native';


export const chekPremissionAndGetToken = async () => {

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    //console.log(existingStatus);

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
        //console.log("dasdasdas");
    //     const tokenData = await Notifications.getExpoPushTokenAsync();
    //    Alert.alert("Token Data", JSON.stringify(tokenData));

       
        try {
        const tokenData = await Notifications.getExpoPushTokenAsync();
        Alert.alert("Token Didapat", tokenData.data);
        } catch (error) {
        console.log("Gagal Ambil Token", error.message);
        }
    }

    
    

    

};