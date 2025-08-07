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
import { getOrderRequestByID, getOrderDetailRequestByID,printPesananRequest } from './../func/orderFunc';


function detailOrderBarang() {
    const route = useRoute();
    const id = route.params['id'];

    const [orderbarang, setOrderBarang] = useState<any[]>([]);
    const [orderbarangdetail, setOrderBarangDetail] = useState<any[]>([]);
    const [departemen, setDepartemen] = useState(false);

    const [jumlahqty, setJumlahqty] = useState(0);
    const [jumlahrp, setJumlahrp] = useState(0);
    const [grandtotal, setGrandtotal] = useState(0);
    const [diskongrand, setDiskongrand] = useState(0);
    const [ppngrand, setPpngrand] = useState(0);
    const [diskonnominalgrand, setDiskonnominalgrand] = useState(0);
    const [ppnnominalgrand, setPpnnominalgrand] = useState(0);
    const [grandtotalsum, setGrandtotalsum] = useState(0);
    const [pdfUri, setPdfUri] = useState(null);

    const [refreshing, setRefreshing] = useState(false);
    const [showAlertInfoDownload, setShowAlertInfoDownload] = useState(false);

    // const updateSummary = () => {
    //     if (orderbarangdetail.length < 1) {
    //         setJumlahqty(0);
    //         setJumlahrp(0);
    //     } else {
    //         let jumlahqtyval = 0;
    //         let jumlahrpval = 0;
    //         orderbarangdetail.map((item) => {
    //             jumlahqtyval = jumlahqtyval + parseFloat(item.qtybarang);
    //             jumlahrpval = jumlahrpval + parseFloat(item.jumlahbarang);
    //         });

    //         setJumlahqty(jumlahqtyval);
    //         setJumlahrp(jumlahrpval);
    //         setGrandtotal(jumlahrpval);
    //     }
    // };

    // const updateGrandtotal = () => {
    //     let jumlahgrandvaldiskon = 0;
    //     let jumlahgrandvalppn = 0;
    //     if (isNaN(diskongrand)) {
    //         setDiskongrand(0);
    //     }

    //     if (isNaN(ppngrand)) {
    //         setPpngrand(0);
    //     }

    //     if (isNaN(ppnnominalgrand)) {
    //         setPpnnominalgrand(0);
    //     }

    //     if (isNaN(diskonnominalgrand)) {
    //         setDiskonnominalgrand(0);
    //     }

    //     jumlahgrandvaldiskon = jumlahrp - (jumlahrp * diskongrand) / 100;
    //     jumlahgrandvalppn =
    //         jumlahgrandvaldiskon + (jumlahgrandvaldiskon * ppngrand) / 100;

    //     jumlahgrandvalppn =
    //         jumlahgrandvalppn + ppnnominalgrand - diskonnominalgrand;
    //     setGrandtotalsum(jumlahgrandvalppn);
    // };


    const fetchData = async () => {
        try {
            const data = await getOrderRequestByID(id);
            const dataDetail = await getOrderDetailRequestByID(id);
            setOrderBarang(data);
            setDiskongrand(data[0]["Disc"]);
            setPpngrand(data[0]["PPn"]);
            setDiskonnominalgrand(data[0]["NominalDisc"]);
            setPpnnominalgrand(data[0]["NominalPPn"]);

            if (dataDetail.length < 1) {
                setJumlahqty(0);
                setJumlahrp(0);
            }

            let jumlahqtyval = 0;
            let jumlahrpval = 0;

            const orderbarangdetailarr = [];
            dataDetail.map((item, i) => {
                
                let total = 0;
                if (parseFloat(item.Disc) > 0) {
                    total =
                        parseFloat(item.Qtty) * parseFloat(item.Harga) -
                        (parseFloat(item.Qtty) *
                            parseFloat(item.Harga) *
                            parseFloat(item.Disc)) /
                        100;
                } else {
                    total = parseFloat(item.Qtty) * parseFloat(item.Harga);
                }

                jumlahqtyval = jumlahqtyval + parseFloat(item.Qtty);
                jumlahrpval = jumlahrpval + total;

                orderbarangdetailarr.push({
                    id: item.NoPesanan + i,
                    kodebarang: item.Kode,
                    namabarang: item.Nama,
                    qtybarang: item.Qtty,
                    satuanbarang: item.Satuan,
                    hargabeliend: item.Harga,
                    diskonbarang: item.Disc,
                    jumlahbarang: total,
                    nomorpesanan: item.NoPesanan,
                    alokasi: item.Alokasi,
                })
            });
            if (dataDetail.length > 0) {
                setDepartemen(dataDetail[0].Departemen);
            } else {
                setDepartemen(null);
            }

            setJumlahqty(jumlahqtyval);
            setJumlahrp(jumlahrpval);
            setGrandtotal(jumlahrpval);
            setOrderBarangDetail(orderbarangdetailarr);
            
            //hitung grand total
            let jumlahgrandvaldiskon = 0;
            let jumlahgrandvalppn = 0;
            let diskonGrand= parseFloat(data[0]["Disc"]);
            let ppngrand= parseFloat(data[0]["PPn"]);
            let nominaldiskongrand= parseFloat(data[0]["NominalDisc"]);
            let nominalppngrand= parseFloat(data[0]["NominalPPn"]);
            if (isNaN(data[0]["Disc"]) || data[0]["Disc"]==null || data[0]["Disc"]=="") {
                diskonGrand=0;
            }

            if (isNaN(data[0]["PPn"]) || data[0]["PPn"]==null || data[0]["PPn"]=="") {
                ppngrand=0
            }

            if (isNaN(data[0]["NominalPPn"]) || data[0]["NominalPPn"]==null || data[0]["NominalPPn"]=="") {
                nominalppngrand=0;
            }

            if (isNaN(data[0]["NominalDisc"]) || data[0]["NominalDisc"]==null || data[0]["NominalDisc"]=="") {
                nominaldiskongrand=0;
            }

            jumlahgrandvaldiskon = jumlahrpval - (jumlahrpval * diskonGrand) / 100;
            jumlahgrandvalppn =
                jumlahgrandvaldiskon + (jumlahgrandvaldiskon * ppngrand) / 100;

            jumlahgrandvalppn =
                jumlahgrandvalppn + nominalppngrand - nominaldiskongrand;

            setGrandtotalsum(jumlahgrandvalppn);
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

    const renderDetailOrderBarang = ({ item }) => {
        return (
            <TouchableOpacity style={{ marginTop: 8, paddingVertical: 10, paddingHorizontal: 15, borderRadius: 15, backgroundColor: '#fff' }}>
                <View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontWeight: 'bold', color: "#585858" }}>K.Brg : {item.kodebarang}</Text>
                        <Text style={{ color: "#585858", fontSize: 12 }}>No. Pesanan: {item.nomorpesanan}</Text>
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
                            {"Qtty : " + item.qtybarang + " " + item.satuanbarang + " | Harga : " + item.hargabeliend + " | Disc : " + item.diskonbarang + " | Jmlh : " + item.jumlahbarang}
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
                    <Text style={{ fontSize: 16, fontWeight: "bold" }}> Detail Order</Text>
                </View>
            </View>

            <View>
                {orderbarang?.map((item, i) => (
                    <View key={i} style={{ padding: 10, backgroundColor: '#A0C4FF20', borderRadius: 10 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text>Tanggal</Text>
                            <Text style={{ fontWeight: 'bold' }}>{item["Tgl"]}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                            <Text>Nomor PO</Text>
                            <Text style={{ fontWeight: 'bold' }}>{id}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                            <Text>Supplier</Text>
                            <Text style={{ fontWeight: 'bold', width: 230, textAlign: 'right' }}>{item["sNo_Acc"] + " - " + item["Nama"]}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                            <Text>Departemen</Text>
                            <Text style={{ fontWeight: 'bold' }}>{departemen}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                            <Text>Gudang</Text>
                            <Text style={{ fontWeight: 'bold' }}>{item["Gudang"]}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <TouchableOpacity style={{ flex: 1, backgroundColor: '#0085c8', paddingVertical: 10, borderRadius: 10, marginRight: 5 }} onPress={() =>{handlePrint()}}>
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

                <Text style={{ color: '#585858', fontWeight: 'bold', fontSize: 16, marginBottom: 5, marginTop: 15 }}>Item Order Barang</Text>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    persistentScrollbar={false}
                    style={{ marginBottom: 460 }}
                ><FlatList
                        data={orderbarangdetail}
                        renderItem={renderDetailOrderBarang}
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
                        <Text>%Disc / %PPN</Text>
                        <Text style={{ fontWeight: 'bold' }}>{diskongrand + " / " + ppngrand}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                        <Text>Nominal PPn</Text>
                        <Text style={{ fontWeight: 'bold' }}>{ppnnominalgrand}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                        <Text>Nominal Disc</Text>
                        <Text style={{ fontWeight: 'bold' }}>{diskonnominalgrand}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                        <Text>Grand Total</Text>
                        <Text style={{ fontWeight: 'bold' }}>{grandtotalsum}</Text>
                    </View>
                </View>
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

export default detailOrderBarang;

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
