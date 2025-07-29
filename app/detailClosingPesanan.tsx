import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    RefreshControl,
    FlatList,
} from "react-native";
import { Platform } from 'react-native';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useRoute } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { Link, router } from "expo-router";
import CustomAlert from './../component/sweetalert';
import { WebView } from 'react-native-webview';
import { getAllClosingPesananRequestByid, getAllClosingPesananDetailRequestByid } from './../func/closingPesananFunc';

function detailClosingPesanan() {

    const route = useRoute();
    const id = route.params['id'];

    const [closingpesanan, setClosingPesanan] = useState<any[]>([]);
    const [closingpesanandetail, setClosingPesananDetail] = useState<any[]>([]);
    const [jumlahqtyin, setJumlahQtyIn] = useState(0);
    const [jumlahqtypo, setJumlahQtyPO] = useState(0);

    const [pdfUri, setPdfUri] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [showAlertInfoDownload, setShowAlertInfoDownload] = useState(false);

    



}

export default detailClosingPesanan;
