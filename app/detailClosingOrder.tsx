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
import { getAllClosingOrderRequestByid, getAllClosingOrderDetailRequestByid } from './../func/closingOrderFunc';

function detailClosingOrder() {

    const route = useRoute();
    const id = route.params['id'];

    const [closingorder, setClosingOrder] = useState<any[]>([]);
    const [closingpesanandetail, setClosingPesananDetail] = useState<any[]>([]);
    const [jumlahqtyin, setJumlahQtyIn] = useState(0);
    const [jumlahqtypo, setJumlahQtyPO] = useState(0);

    const [pdfUri, setPdfUri] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [showAlertInfoDownload, setShowAlertInfoDownload] = useState(false);

    const fetchData = async () => {
        try {
            const data = await getAllClosingOrderRequestByid(id);
            const dataDetail = await getAllClosingOrderDetailRequestByid(id);
            setClosingOrder(data);

            const closeorderdetailarr = [];
            dataDetail.map((item, i) => {

                closeorderdetailarr.push({
                    id: item.NoPo + i,
                    tanggal: item.Tgl,
                    nomorpo: item.NoPo,
                    kodebarang: item.Kode,
                    namabarang: item.Kode + " (" + item.Descri + ")",
                    qtypo: item.Qtty,
                    qtyin: item.QtyIn,
                })
            });

            setClosingPesananDetail(closeorderdetailarr);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleBack = () => {
        router.back();
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchData();
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    // const handlePrint = async () => {
    //     const url = await printPesananRequest(id);
    //     setPdfUri(url);
    //     setShowAlertInfoDownload(true)
    // }

    useEffect(() => {
        fetchData();
    }, []);


    const renderDetailCloseOrderBarang = ({ item }) => {
        return (
            <TouchableOpacity style={{ marginTop: 8, paddingVertical: 10, paddingHorizontal: 15, borderRadius: 15, backgroundColor: '#fff' }}>
                <View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontWeight: 'bold', color: "#585858" }}>No : {item.nomorpo}</Text>
                        <Text style={{ fontWeight: 'bold', color: "#585858" }}>Tgl : {item.tanggal}</Text>
                    </View>

                    <View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                            <Text>Detail : </Text>
                            <Text style={{ width: 280, textAlign: 'right' }}>{item.namabarang}</Text>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#A0C4FF20', paddingHorizontal: 10, paddingVertical: 3, marginTop: 5, borderRadius: 10 }}>
                        <Text style={{ color: "#585858", fontSize: 12 }}>
                            {"Qty PO : " + item.qtypo + " | Qty In : " + item.qtyin}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const ReadMoreText = ({ text, maxLength = 10 }) => {
        const [isExpanded, setIsExpanded] = useState(false);

        const shouldShowReadMore = text.length > maxLength;
        const displayText = isExpanded ? text : text.slice(0, maxLength) + (shouldShowReadMore ? '...' : '');

        return (
            <View>
                <Text style={[styles.text, { fontWeight: 'bold' }]}>{displayText}</Text>

                {shouldShowReadMore && (
                    <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
                        <Text style={styles.readMore}>
                            {isExpanded ? 'Sembunyikan' : 'Baca Selengkapnya'}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };


       return (

        <View style={styles.container}>

            <View style={{ flexDirection: "row", marginBottom: 10 }}>
                <TouchableOpacity onPress={handleBack} style={{
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
                    <Text style={{ fontSize: 16, fontWeight: "bold" }}> Detail Closing Order</Text>
                </View>
            </View>

            <View>
                {closingorder?.map((item, i) => (
                    <View key={i} style={{ padding: 10, backgroundColor: '#A0C4FF20', borderRadius: 10 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text>Tanggal</Text>
                            <Text style={{ fontWeight: 'bold' }}>{item["Tgl"]}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                            <Text>Nomor Closing</Text>
                            <Text style={{ fontWeight: 'bold' }}>{item["NoClosing"]}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                            <Text>Supplier</Text>
                            <Text style={{ fontWeight: 'bold' }}>{item["sNo_Acc"]+"-"+ item["Nama"]}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                            <Text>Ket.</Text>
                            <ReadMoreText text={item["Keterangan"]} />
                            {/* <Text style={{ fontWeight: 'bold' }}>{item["Keterangan"]}</Text> */}
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                            <Text>Admin</Text>
                            <Text style={{ fontWeight: 'bold' }}>{item["Username"]}</Text>
                        </View>

                    </View>
                ))}

                <Text style={{ color: '#585858', fontWeight: 'bold', fontSize: 16, marginBottom: 5, marginTop: 15 }}>Item Close Pesanan</Text>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    persistentScrollbar={false}
                    style={{ marginBottom: 310 }}
                ><FlatList
                        data={closingpesanandetail}
                        renderItem={renderDetailCloseOrderBarang}
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

export default detailClosingOrder;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        marginTop: 50,
        paddingHorizontal: 20,
    },
    text: {
    },
    readMore: {
        color: '#007bff',
        marginTop: 5,
    },
});