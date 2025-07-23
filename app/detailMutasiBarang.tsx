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
import { getAllMutasiRequestbyId, getAllMutasiDetailRequestbyId,printPesananRequest } from './../func/mutasiFunc';

function detailMutasiBarang() {
    const route = useRoute();
    const id = route.params['id'];

    const [mutasibarang, setMutasiBarang] = useState<any[]>([]);
    const [mutasibarangdetail, setMutasiBarangDetail] = useState<any[]>([]);
    const [jumlahqtyin, setJumlahQtyIn] = useState(0);
    const [jumlahqtyout, setJumlahQtyOut] = useState(0);

    const [pdfUri, setPdfUri] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [showAlertInfoDownload, setShowAlertInfoDownload] = useState(false);

    const fetchData = async () => {
        try {
            const data = await getAllMutasiRequestbyId(id);
            const dataDetail = await getAllMutasiDetailRequestbyId(id);
            setMutasiBarang(data);

            let jumlahqtyinval = 0;
            let jumlahqtyoutval = 0;

            const mutasibarangdetailarr = [];
            dataDetail.map((item, i) => {

                jumlahqtyinval = jumlahqtyinval + parseFloat(item.Qtty);

                mutasibarangdetailarr.push({
                    id: item.NoBukti + item.InvNum + i,
                    noinv: item.InvNum,
                    namabarang: item.Nama,
                    satuanbarang: item.Satuan,
                    alokasi: item.Alokasi,
                    qtyin: item.QtyIn,
                    qtyout: item.Qtty,
                    tanggal: data[0]["Tgl"]
                })
            });

            setJumlahQtyIn(jumlahqtyinval);
            setJumlahQtyOut(jumlahqtyinval);
            setMutasiBarangDetail(mutasibarangdetailarr);

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

    const handlePrint = async () => {
        const url = await printPesananRequest(id);
        setPdfUri(url);
        setShowAlertInfoDownload(true)
    }

    useEffect(() => {
        fetchData();
    }, []);

    const renderDetailMutasiBarang = ({ item }) => {
        return (
            <TouchableOpacity style={{ marginTop: 8, paddingVertical: 10, paddingHorizontal: 15, borderRadius: 15, backgroundColor: '#fff' }}>
                <View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontWeight: 'bold', color: "#585858" }}>NoInv : {item.noinv}</Text>
                        <Text style={{ color: "#585858", fontSize: 12 }}>Tgl: {item.tanggal}</Text>
                    </View>

                    <View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                            <Text>Detail : </Text>
                            <Text style={{ width: 280, textAlign: 'right' }}>{item.namabarang}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                            <Text>Alokasi : </Text>
                            <Text style={{ width: 280, textAlign: 'right' }}>{item.alokasi}</Text>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#A0C4FF20', paddingHorizontal: 10, paddingVertical: 3, marginTop: 5, borderRadius: 10 }}>
                        <Text style={{ color: "#585858", fontSize: 12 }}>
                            {"Qty In : " + item.qtyin + " " + item.satuanbarang + " | Qty Out : " + item.qtyout + "  " + item.satuanbarang}
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
                    <Text style={{ fontSize: 16, fontWeight: "bold" }}> Detail Mutasi</Text>
                </View>
            </View>

            <View>
                {mutasibarang?.map((item, i) => (
                    <View key={i} style={{ padding: 10, backgroundColor: '#A0C4FF20', borderRadius: 10 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text>Tanggal</Text>
                            <Text style={{ fontWeight: 'bold' }}>{item["Tgl"]}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                            <Text>Nomor Bukti</Text>
                            <Text style={{ fontWeight: 'bold' }}>{id}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                            <Text>Dari Gudang</Text>
                            <Text style={{ fontWeight: 'bold'}}>{item["drGudang"]}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                            <Text>Ke Gudang</Text>
                            <Text style={{ fontWeight: 'bold' }}>{item["keGudang"] }</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                            <Text>keterangan</Text>
                            <Text style={{ fontWeight: 'bold' }}>{item["Keterangan"]}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                            <Text>Admin</Text>
                            <Text style={{ fontWeight: 'bold' }}>{item["Username"]}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <TouchableOpacity style={{ flex: 1, backgroundColor: '#0085c8', paddingVertical: 10, borderRadius: 10, marginRight: 5 }} onPress={() => { handlePrint(); }}>
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

                <Text style={{ color: '#585858', fontWeight: 'bold', fontSize: 16, marginBottom: 5, marginTop: 15 }}>Item Mutasi Barang</Text>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    persistentScrollbar={false}
                    style={{ marginBottom: 460 }}
                ><FlatList
                        data={mutasibarangdetail}
                        renderItem={renderDetailMutasiBarang}
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

                <View style={{ marginTop: -450, padding: 10, backgroundColor: '#A0C4FF20', borderRadius: 10 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                        <Text>Total QtyIn</Text>
                        <Text style={{ fontWeight: 'bold' }}>{jumlahqtyin}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                        <Text>Total QtyOut</Text>
                        <Text style={{ fontWeight: 'bold' }}>{jumlahqtyout}</Text>
                    </View>
                </View>
            </View>

            <CustomAlert
                visible={showAlertInfoDownload}
                title="Sukses!"
                message="Laporan berhasil didownload."
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

export default detailMutasiBarang;

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
