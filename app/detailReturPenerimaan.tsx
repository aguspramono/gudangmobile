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
import { getReturRequestByID, getReturDetailRequestByID,printPesananRequest } from './../func/returPenerimaan';

function detailReturPenerimaan() {
    const route = useRoute();
    const id = route.params['id'];

    const [returpenerimaan, setReturPenerimaan] = useState<any[]>([]);
    const [returpenerimaandetail, setReturPenerimaanDetail] = useState<any[]>([]);

    const [pdfUri, setPdfUri] = useState(null);

    const [refreshing, setRefreshing] = useState(false);
    const [showAlertInfoDownload, setShowAlertInfoDownload] = useState(false);

    const fetchData = async () => {
        try {
            const data = await getReturRequestByID(id);
            const dataDetail = await getReturDetailRequestByID(id);
            setReturPenerimaan(data);

            const returpenerimaandetailarr = [];
            dataDetail.map((item, i) => {

                returpenerimaandetailarr.push({
                    id: item.ReNum + i,
                    kodebarang: item.Kode,
                    noinvoice: item.InvNum,
                    namabarang: item.Nama + "(" + item.Satuan + ")",
                    qtybarang: item.Qtty,
                    harga: item.Harga,
                    disc: item.Disc,
                    nominaldisc: item.NominalDisc,
                    xdisc: item.xDisc,
                    ppn: item.PPn,
                    nominalppn: item.NominalPPn,
                    jumlahrp: item.jumlahtotal,
                })
            });
            setReturPenerimaanDetail(returpenerimaandetailarr);
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


    const renderDetailReturPenerimaan = ({ item }) => {
        return (
            <TouchableOpacity style={{ marginTop: 8, paddingVertical: 10, paddingHorizontal: 15, borderRadius: 15, backgroundColor: '#fff' }}>
                <View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontWeight: 'bold', color: "#585858" }}>K.Brg : {item.kodebarang}</Text>
                    </View>

                    <View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                            <Text>Invoice : </Text>
                            <Text style={{ width: 280, textAlign: 'right' }}>{item.noinvoice}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                            <Text>Detail : </Text>
                            <Text style={{ width: 280, textAlign: 'right' }}>{item.namabarang}</Text>
                        </View>

                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#A0C4FF20', paddingHorizontal: 10, paddingVertical: 3, marginTop: 5, borderRadius: 10 }}>
                        <Text style={{ color: "#585858", fontSize: 12 }}>
                            {"Qtty : " + item.qtybarang + " | Harga : " + item.harga + " | Disc % : " + item.disc + " | Nominal Disc : " + item.nominaldisc + " | xDisc : " + item.xdisc + " | PPn : " + item.ppn + " | Nominal PPn : " + item.nominalppn + " | Jumlah Rp : " + item.jumlahrp}
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
                    <Text style={{ fontSize: 16, fontWeight: "bold" }}> Detail Retur Penerimaan</Text>
                </View>
            </View>
            <View>
                {returpenerimaan?.map((item, i) => (
                    <View key={i} style={{ padding: 10, backgroundColor: '#A0C4FF20', borderRadius: 10 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text>Tanggal</Text>
                            <Text style={{ fontWeight: 'bold' }}>{item["Tgl"]}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                            <Text>Nomor Retur</Text>
                            <Text style={{ fontWeight: 'bold' }}>{item["ReNum"]}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                            <Text>Supplier</Text>
                            <Text style={{ fontWeight: 'bold' }}>{item["sNo_Acc"]+"-"+item["Nama"]+"("+item["Kota"]+")"}</Text>
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


                        <View style={{ flexDirection: 'row', marginTop: 10 }}>

                            <TouchableOpacity style={{ flex: 1, backgroundColor: '#0085c8', paddingVertical: 10, borderRadius: 10, marginRight: 5 }} onPress={() => handlePrint()}>
                                <Text style={{ color: '#fff', textAlign: 'center' }}>Cetak PDF</Text>
                            </TouchableOpacity>

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
                    </View>
                ))}

                <Text style={{ color: '#585858', fontWeight: 'bold', fontSize: 16, marginBottom: 5, marginTop: 15 }}>Item Pesanan Barang</Text>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    persistentScrollbar={false}
                    style={{ marginBottom: 440 }}
                ><FlatList
                        data={returpenerimaandetail}
                        renderItem={renderDetailReturPenerimaan}
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
export default detailReturPenerimaan;
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
