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
import { getAllDataById,PrntAllDataItemById } from './../func/lunasHutangFunc';
import { formatNumber, DateFormat } from './../func/global/globalFunc';



function detailHutang() {

    const route = useRoute();
    const id = route.params['id'];

    const [hutang, setHutang] = useState(null);
    const [hutangdetail, setHutangDetail] = useState<any[]>([]);

    const [pdfUri, setPdfUri] = useState(null);

    const [refreshing, setRefreshing] = useState(false);
    const [showAlertInfoDownload, setShowAlertInfoDownload] = useState(false);

    const fetchData = async () => {
        try {
            const data = await getAllDataById(id);



            const hutangarr = [];

            hutangarr.push({
                id: data.Header.NoBukti,
                Supplier: data.Header.Supplier,
                Keterangan: data.Header.Keterangan,
                Username: data.Header.Username,
                Tanggal: data.Header.Tanggal,
            })


            setHutang(hutangarr);


            const hutangdetailarr = [];

            data.Detail.map((item, i) => {

                hutangdetailarr.push({
                    id: item.InvNum + i,
                    Tgl: item.Tgl,
                    InvNum: item.InvNum,
                    Sisa: item.Sisa,
                    Bayar: item.Bayar,
                    Lunas: item.Lunas,
                })
            });

            setHutangDetail(hutangdetailarr);


        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


        const handlePrint = async () => {
            const url = await PrntAllDataItemById(id);
            setPdfUri(url);
            setShowAlertInfoDownload(true)
        }

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


    useEffect(() => {
        fetchData();
    }, []);


    const renderDetailHutang = ({ item }) => {
        return (
            <TouchableOpacity style={{ marginTop: 8, paddingVertical: 10, paddingHorizontal: 15, borderRadius: 15, backgroundColor: '#fff' }}>
                <View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontWeight: 'bold', color: "#585858" }}>Invoice : {item.InvNum}</Text>
                    </View>

                    <View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                            <Text>Tgl : </Text>
                            <Text style={{ width: 280, textAlign: 'right' }}>{DateFormat(item.Tgl, "dd/mm/yyyy")}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                            <Text>Sisa : </Text>
                            <Text style={{ width: 280, textAlign: 'right' }}>{formatNumber(item.Sisa)}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                            <Text>Bayar : </Text>
                            <Text style={{ width: 280, textAlign: 'right' }}>{formatNumber(item.Bayar)}</Text>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#A0C4FF20', paddingHorizontal: 10, paddingVertical: 3, marginTop: 5, borderRadius: 10 }}>
                        <Text style={{ color: "#585858", fontSize: 12 }}>
                            {"Lunas : " + item.Lunas}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
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
                    <Text style={{ fontSize: 16, fontWeight: "bold" }}> Detail Hutang</Text>
                </View>
            </View>

            {hutang?.map((item, i) => (
                <View key={i} style={{ padding: 10, backgroundColor: '#A0C4FF20', borderRadius: 10 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text>Tanggal</Text>
                        <Text style={{ fontWeight: 'bold' }}>{DateFormat(item["Tanggal"], "dd/mm/yyyy")}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                        <Text>Nomor Bukti</Text>
                        <Text style={{ fontWeight: 'bold' }}>{id}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                        <Text>Supplier</Text>
                        <Text style={{ fontWeight: 'bold', width: 230, textAlign: 'right' }}>{item["Supplier"]}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                        <Text>Keterangan</Text>
                        <Text style={{ fontWeight: 'bold' }}>{item["Keterangan"]}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <TouchableOpacity style={{ flex: 1, backgroundColor: '#0085c8', paddingVertical: 10, borderRadius: 10, marginRight: 5 }} onPress={() => { handlePrint() }}>
                            <Text style={{ color: '#fff', textAlign: 'center' }}>Cetak PDF</Text>
                        </TouchableOpacity>
                    </View>

                    {pdfUri && (
                        <>
                            <View>
                                <WebView
                                    source={{ uri: pdfUri }}
                                    originWhitelist={['*']}
                                    useWebKit
                                    javaScriptEnabled
                                />
                            </View>
                        </>
                    )}
                </View>
            ))}


            <View>


                <Text style={{ color: '#585858', fontWeight: 'bold', fontSize: 16, marginBottom: 5, marginTop: 15 }}>Item Hutang</Text>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    persistentScrollbar={false}
                    style={{ marginBottom: 320 }}
                ><FlatList
                        data={hutangdetail}
                        renderItem={renderDetailHutang}
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

            <CustomAlert
                visible={showAlertInfoDownload}
                title="Sukses!"
                message="Laporan berhasil digenerate, jangan tutup pesan ini sebelum status download sukses."
                icon={require('./../assets/images/success.png')}
                onClose={() => { setPdfUri(null), setShowAlertInfoDownload(false) }}
                onAcc={() => { }}
                onDec={() => setShowAlertInfoDownload(false)}
                option=""
                textconfirmacc=""
                textconfirmdec=""
            />
        </View>
    );


}

export default detailHutang;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "transparent",
        marginTop: 50,
        paddingHorizontal: 20,
    },
    containerfilter: {
        flexDirection: "row",
        marginBottom: 10,
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: "#fff",
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
    },
    bottomModal: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        backgroundColor: "#fff",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
    },
    modalText: {
        fontSize: 16,
        marginTop: 10,
    },
    pickerContainer: {
        borderRadius: 12,
        backgroundColor: "#fff",
        ...Platform.select({
            android: {
                borderWidth: 1,
                borderColor: "#ccc",
            },
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
        }),
        overflow: "hidden",
    },
    picker: {
        height: 50,
        color: "#333",
        paddingHorizontal: 10,
    },
    buttonTextrt: {
        color: "#fff",
        fontWeight: "bold",
    },
});
