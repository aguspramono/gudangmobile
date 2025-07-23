import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
} from "react-native";
import { ScrollView, RefreshControl, FlatList, PermissionsAndroid, Platform } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { StatusBar } from "expo-status-bar";
import { useRoute } from '@react-navigation/native';
import { Link, router } from "expo-router";
import { getPesananRequestByID, getPesananDetailRequestByID, updateStatusPesananRequest, printPesananRequest, checkuserpremis } from './../func/pesananFunc';
import { FontAwesome } from '@expo/vector-icons';
import CustomAlert from './../component/sweetalert';
import { WebView } from 'react-native-webview';
import { useShallow } from "zustand/react/shallow";
import useLogin from "./../func/store/useUserLogin";

function detailPesanBarang() {
    const route = useRoute();
    const id = route.params['id'];
    const [pesananbarang, setPesananBarang] = useState<any[]>([]);
    const [pesananbarangdetail, setPesananBarangDetail] = useState<any[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [departemen, setDepartemen] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [showAlertInfo, setShowAlertInfo] = useState(false);
    const [showAlertInfoGagal, setShowAlertInfoGagal] = useState(false);
    const [showAlertInfoDownload, setShowAlertInfoDownload] = useState(false);
    const [pdfUri, setPdfUri] = useState(null);
    const [userdiket, setUserDiket] = useState(null);
    const [userdiset, setUserDiset] = useState(null);

    //set info alert
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [option, setOption] = useState("");
    const [textconfirmacc, setTextConfirmAcc] = useState("");
    const [textconfirmdec, setTextConfirmDec] = useState("");
    const [statuspass, setStatuspass] = useState("");
    //set info alert gagal
    const [messagegagal, setMessagegagal] = useState("");

    const {
        isLogin,
        setLogin,
        userName,
        setUserName,
        namaUser,
        setNamaUser,
    } = useLogin(
        useShallow((state: any) => ({
            isLogin: state.isLogin,
            setLogin: state.setLogin,
            userName: state.userName,
            setUserName: state.setUserName,
            namaUser: state.namaUser,
            setNamaUser: state.setNamaUser,
        }))
    );


    const fetchData = async () => {
        try {
            const data = await getPesananRequestByID(id);
            const dataDetail = await getPesananDetailRequestByID(id);
            const diketahui = await checkuserpremis(data[0]["diketahui"]);
            const disetujui = await checkuserpremis(data[0]["disetujui"]);

            if (diketahui.length > 0) {
                setUserDiket(diketahui[0]["NamaPeg"] == null ? "-" : diketahui[0]["NamaPeg"]);
                setUserDiset(disetujui[0]["NamaPeg"] == null ? "-" : disetujui[0]["NamaPeg"]);
            } else {
                setUserDiket(null);
                setUserDiset(null);
            }

            setPesananBarang(data);
            const pesananbarangdetailarr = [];
            dataDetail.map((item, i) => (
                pesananbarangdetailarr.push({
                    id: item.NoPesanan + i,
                    kodebarang: item.Kode,
                    deskripsi: item.Nama,
                    lokasi: item.Lokasi,
                    qtty: item.Qtty,
                    satuan: item.Satuan,
                    tglbutuh: item.TglButuh,
                    alokasi: item.Alokasi,
                })
            ));
            if (dataDetail.length > 0) {
                setDepartemen(dataDetail[0].Departemen);
            } else {
                setDepartemen(null);
            }

            setPesananBarangDetail(pesananbarangdetailarr);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handlePressOrderBarang = (status) => {
        if (status === "terima") {
            setTitle("Peringatan!");
            setMessage("Yakin ingin menerima pesanan barang ini?");
            setOption("confirm");
            setTextConfirmAcc("Terima");
            setTextConfirmDec("Batal");
            setShowAlert(true);
            setStatuspass("terima");
        } else if (status === "tolak") {
            setTitle("Peringatan!");
            setMessage("Yakin ingin menolak pesanan barang ini?");
            setOption("confirm");
            setTextConfirmAcc("Tolak");
            setTextConfirmDec("Batal");
            setShowAlert(true);
            setStatuspass("tolak");
        }
    }

    const handlePressOrderBarangFunc = (status) => {
        if (status === "terima") {
            updateStatusPesananRequest(id, "onprocess", userName)
                .then((response) => {
                    if (response["message"] === "error") {
                        setMessagegagal(response["error"]);
                        setShowAlertInfoGagal(true);
                    } else {
                        setShowAlertInfo(true);
                    }
                    fetchData();
                })
                .catch((error) => { console.error("Error updating pesanan status:", error); });
        } else if (status === "tolak") {
            updateStatusPesananRequest(id, "rejected", userName)
                .then((response) => {
                    if (response["message"] === "error") {
                        setMessagegagal(response["error"]);
                        setShowAlertInfoGagal(true);
                    } else {
                        setShowAlertInfo(true);
                    }
                    fetchData();
                })
                .catch((error) => { console.error("Error updating pesanan status:", error); });
        }
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

    const renderDetailPesananBarang = ({ item }) => {
        return (
            <TouchableOpacity style={{ marginTop: 8, paddingVertical: 10, paddingHorizontal: 15, borderRadius: 15, backgroundColor: '#fff' }}>
                <View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontWeight: 'bold', color: "#585858" }}>K.Brg : {item.kodebarang}</Text>
                        <Text style={{ color: "#585858", fontSize: 12 }}>Tgl. Butuh: {item.tglbutuh}</Text>
                    </View>

                    <View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                            <Text>Detail : </Text>
                            <Text style={{ width: 280, textAlign: 'right' }}>{item.deskripsi}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                            <Text>Alokasi : </Text>
                            <Text style={{ width: 280, textAlign: 'right' }}>{item.alokasi}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                            <Text>Lokasi : </Text>
                            <Text style={{ width: 280, textAlign: 'right' }}>{item.lokasi}</Text>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#A0C4FF20', paddingHorizontal: 10, paddingVertical: 3, marginTop: 5, borderRadius: 10 }}>
                        <Text style={{ color: "#585858", fontSize: 12 }}>
                            {item.qtty + " " + item.satuan}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const handlePrint = async () => {
        const url = await printPesananRequest(id);
        setPdfUri(url);
        setShowAlertInfoDownload(true)
    }

    useEffect(() => {
        fetchData();
    }, [id]);

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
                    <Text style={{ fontSize: 16, fontWeight: "bold" }}> Detail Pesanan</Text>
                </View>
            </View>
            <View>
                {pesananbarang?.map((item, i) => (
                    <View key={i} style={{ padding: 10, backgroundColor: '#A0C4FF20', borderRadius: 10 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: item["statusdiset"] == "pending" ? '#FFD666' : item["statusdiset"] == "onprocess" ? '#A0C4FF' : item["statusdiset"] == "rejected" ? '#FFB6B6' : '#9DE0AD', paddingHorizontal: 10, paddingVertical: 3, marginBottom: 10 }}>
                            <Text style={{ color: "#585858", fontSize: 12, textTransform: 'capitalize' }}>
                                {(item["statusdiset"] == "pending" || item.diketahui == "pending" ? "Menunggu" : (item["statusdiset"] == null || item["statusdiset"] == "" || item["statusdiset"] == "done" ? "Selesai" : item["statusdiset"] == "rejected" ? "Ditolak" : 'Diproses'))}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text>Tanggal</Text>
                            <Text style={{ fontWeight: 'bold' }}>{item["Tgl"]}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                            <Text>Nomor Pesanan</Text>
                            <Text style={{ fontWeight: 'bold' }}>{item["NoPesanan"]}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                            <Text>Departemen</Text>
                            <Text style={{ fontWeight: 'bold' }}>{departemen}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                            <Text>Gudang</Text>
                            <Text style={{ fontWeight: 'bold' }}>{item["Gudang"]}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                            <Text>Keterangan</Text>
                            <Text style={{ fontWeight: 'bold' }}>{item["Keterangan"]}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                            <Text>Admin</Text>
                            <Text style={{ fontWeight: 'bold' }}>{item["Username"]}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                            <Text>Diketahui</Text>
                            <Text style={{ fontWeight: 'bold' }}>{userdiket == null ? "-" : userdiket}
                                {item["statusdiket"] === "onprocess" && (
                                    <Image
                                        source={require('./../assets/images/success.png')}
                                        style={{ width: 12, height: 12 }}
                                    />
                                )}

                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                            <Text>Disetujui</Text>
                            <Text style={{ fontWeight: 'bold' }}>{userdiset == null ? "-" : userdiset}
                                {item["statusdiset"] === "onprocess" && (
                                    <Image
                                        source={require('./../assets/images/success.png')}
                                        style={{ width: 12, height: 12 }}
                                    />
                                )}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            {((item["disetujui"] === userName && item["statusdiset"] === "pending") || (item["diketahui"] === userName && item["statusdiket"] === "pending")) && (
                                <React.Fragment>
                                    <TouchableOpacity style={{ flex: 1, backgroundColor: '#00C851', paddingVertical: 10, borderRadius: 10, marginRight: 5 }} onPress={() => handlePressOrderBarang("terima")}>
                                        <Text style={{ color: '#fff', textAlign: 'center' }}>Terima</Text>
                                    </TouchableOpacity >
                                    <TouchableOpacity style={{ flex: 1, backgroundColor: '#c80035', paddingVertical: 10, borderRadius: 10, marginRight: 5 }} onPress={() => handlePressOrderBarang("tolak")}>
                                        <Text style={{ color: '#fff', textAlign: 'center' }}>Tolak</Text>
                                    </TouchableOpacity>
                                </React.Fragment>
                            )}
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
                        data={pesananbarangdetail}
                        renderItem={renderDetailPesananBarang}
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
                visible={showAlert}
                title={title}
                message={message}
                icon={require('./../assets/images/question.png')}
                onClose={() => setShowAlert(false)}
                onAcc={() => { statuspass == "terima" ? handlePressOrderBarangFunc('terima') : handlePressOrderBarangFunc('tolak') }}
                onDec={() => setShowAlert(false)}
                option={option}
                textconfirmacc={textconfirmacc}
                textconfirmdec={textconfirmdec}
            />

            <CustomAlert
                visible={showAlertInfo}
                title="Sukses!"
                message="Pesanan berhasil diubah."
                icon={require('./../assets/images/success.png')}
                onClose={() => { setShowAlert(false), setShowAlertInfo(false) }}
                onAcc={() => { }}
                onDec={() => setShowAlertInfo(false)}
                option=""
                textconfirmacc=""
                textconfirmdec=""
            />

            <CustomAlert
                visible={showAlertInfoGagal}
                title="Gagal!"
                message={messagegagal}
                icon={require('./../assets/images/error.png')}
                onClose={() => { setShowAlert(false), setShowAlertInfoGagal(false) }}
                onAcc={() => { }}
                onDec={() => setShowAlertInfoGagal(false)}
                option=""
                textconfirmacc=""
                textconfirmdec=""
            />

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


export default detailPesanBarang;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        marginTop: 50,
        paddingHorizontal: 20,
    },
});
