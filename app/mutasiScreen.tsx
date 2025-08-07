import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    Modal,
    TouchableWithoutFeedback,
    Platform,
    TextInput
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { getAllMutasiRequest, getAllMutasiItemRequest, printAllRequest } from "./../func/mutasiFunc";
import { DateFormat } from "./../func/global/globalFunc";
import { Picker } from "@react-native-picker/picker";
import { Optiongudang } from './../component/optiongudang';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { router, useFocusEffect } from "expo-router";
import { WebView } from 'react-native-webview';
import CustomAlert from './../component/sweetalert';

function mutasiScreen() {
    const [mutasibarang, setMutasiBarang] = useState<any[]>([]);
    const [page, setPage] = useState(0);
    const [ketmutasi, setKetMutasi] = useState("");
    const [optionfilter, setoptionfilter] = useState("Nomor Bukti");
    const [optionfiltertanggal, setoptionfiltertanggal] = useState("Semua");
    const [optionbulan, setOptionBulan] = useState("Bulan");
    const [optionTahun, setOptionTahun] = useState("Tahun");
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedDateSampai, setSelectedDateSampai] = useState(null);
    const [limitQuery, setLimitQuery] = useState(0);
    const [darigudang, setDarigudang] = useState("");
    const [kegudang, setKegudang] = useState("");

    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [isDatePickerVisibleSampai, setDatePickerVisibilitySampai] =
        useState(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [peritem, setPeritem] = useState(false);
    const [lastStatusReq, setLastStatusReq] = useState("");
    const [statusprint, setStatusPrint] = useState("");
    const [pdfUri, setPdfUri] = useState(null);
    const [showAlertInfoDownload, setShowAlertInfoDownload] = useState(false);

    const showDatePickerDari = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePickerDari = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        setSelectedDate(date);
        hideDatePickerDari();
    };

    const showDatePickerSampai = () => {
        setDatePickerVisibilitySampai(true);
    };

    const hideDatePickerSampai = () => {
        setDatePickerVisibilitySampai(false);
    };

    const handleConfirmSampai = (date) => {
        setSelectedDateSampai(date);
        hideDatePickerSampai();
    };

    const handleDarigudang = (e: any) => {
        setDarigudang(e);
    }

    const handleKegudang = (e: any) => {
        setKegudang(e);
    }

    const handlePressOrderBarang = (itemId) => {
        router.navigate({ pathname: "detailMutasiBarang", params: { id: itemId } });
    };

    const handleDataPerItem = (status: string) => {
        if (status == "perItem") {
            fetchData(
                "",
                0,
                30,
                "Nomor PO",
                "Semua",
                "2025-01-01",
                "2025-12-31",
                optionbulan,
                optionTahun,
                "",
                "",
                "",
                "",
            );
        } else {
            fetchData(
                "",
                0,
                30,
                "Nomor PO",
                "Semua",
                "2025-01-01",
                "2025-12-31",
                optionbulan,
                optionTahun,
                "",
                "",
                "",
                "perItem"
            );
        }
    };

    const fetchData = async (
        like: string,
        limitqueryprev: number,
        limitquery: number,
        option: string,
        filter: string,
        tanggaldari: string,
        tanggalsampai: string,
        bulan: string,
        tahun: string,
        drgudang: string,
        kgudang: string,
        setReq: string,
        statusReq: string
    ) => {
        const mutasibarangitem = [];

        if (statusReq !== lastStatusReq) {
            setMutasiBarang([]);
        }

        if (statusReq === "perItem") {
            const response = await getAllMutasiItemRequest(
                like,
                limitqueryprev,
                limitquery,
                option,
                filter,
                tanggaldari,
                tanggalsampai,
                bulan,
                tahun,
                drgudang,
                kgudang
            );

            response.map((item, i) =>
                mutasibarangitem.push({
                    id: item.NoBukti + page + i + "peritem",
                    Tgl: item.Tgl,
                    NoBukti: item.NoBukti,
                    GdgAsal: item.GdgAsal,
                    GdgTujuan: item.GdgTujuan,
                    Kode: item.Kode,
                    NamaBrg: item.NamaBrg,
                    Qtty: item.Qtty,
                    HargaJual: item.HargaJual,
                })
            );
        } else {
            const response = await getAllMutasiRequest(
                like,
                limitqueryprev,
                limitquery,
                option,
                filter,
                tanggaldari,
                tanggalsampai,
                bulan,
                tahun,
                drgudang,
                kgudang
            );

            response.map((item, i) =>
                mutasibarangitem.push({
                    id: item.NoBukti + page + i,
                    nobukti: item.NoBukti,
                    detail: item.jumlahItem + " item mutasi barang",
                    tanggal: item.Tgl
                })
            );
        }

        if (setReq === "filter" || statusReq !== lastStatusReq) {
            setMutasiBarang(mutasibarangitem);
        } else {
            setMutasiBarang([...mutasibarang, ...mutasibarangitem]);
        }

        setLastStatusReq(statusReq);
    };

    let limitPage = 0;
    let nextPageAct = 0;

    const nextPage = async (statusReq: string) => {

        let tanggaldari = "2025-07-07";
        let tanggalsampai = "2025-07-07";

        if (optionfiltertanggal === "Tanggal") {
            tanggaldari = DateFormat(selectedDate, "yyyy-mm-dd");
            tanggalsampai = DateFormat(selectedDateSampai, "yyyy-mm-dd");
        }

        let jumlahdataresponse = 0;
        if (statusReq == "perItem") {
            const response = await getAllMutasiItemRequest(
                ketmutasi,
                0,
                0,
                optionfilter,
                optionfiltertanggal,
                tanggaldari,
                tanggalsampai,
                optionbulan,
                optionTahun,
                darigudang,
                kegudang
            );
            jumlahdataresponse = response;
        } else {
            const response = await getAllMutasiRequest(
                ketmutasi,
                0,
                0,
                optionfilter,
                optionfiltertanggal,
                tanggaldari,
                tanggalsampai,
                optionbulan,
                optionTahun,
                darigudang,
                kegudang
            );
            jumlahdataresponse = response.length;
        }

        limitPage = Math.ceil(jumlahdataresponse / 10);

        if (page >= limitPage) {
            setPage(limitPage);
        } else {
            setPage(page + 1);
        }

        nextPageAct = limitQuery + 30;
        setLimitQuery(nextPageAct);

        if (nextPageAct >= jumlahdataresponse) {
            nextPageAct = jumlahdataresponse;
            setLimitQuery(nextPageAct);
        }

        if (statusReq == "perItem") {
            fetchData(
                ketmutasi,
                nextPageAct,
                30,
                optionfilter,
                optionfiltertanggal,
                tanggaldari,
                tanggalsampai,
                optionbulan,
                optionTahun,
                darigudang,
                kegudang,
                "",
                "perItem"
            );
        } else {
            fetchData(
                ketmutasi,
                nextPageAct,
                30,
                optionfilter,
                optionfiltertanggal,
                tanggaldari,
                tanggalsampai,
                optionbulan,
                optionTahun,
                darigudang,
                kegudang,
                "",
                ""
            );
        }
    };

    const resetAndFetch = async (statusReq: string) => {
        let tanggaldari = "2025-07-07";
        let tanggalsampai = "2025-07-07";

        if (optionfiltertanggal === "Tanggal") {
            tanggaldari = DateFormat(selectedDate, "yyyy-mm-dd");
            tanggalsampai = DateFormat(selectedDateSampai, "yyyy-mm-dd");
        }

        if (statusprint === "") {
            if (statusReq === "perItem") {

                fetchData(
                    ketmutasi,
                    nextPageAct,
                    30,
                    optionfilter,
                    optionfiltertanggal,
                    tanggaldari,
                    tanggalsampai,
                    optionbulan,
                    optionTahun,
                    darigudang,
                    kegudang,
                    "filter",
                    "perItem"
                );

            } else {
                fetchData(
                    ketmutasi,
                    nextPageAct,
                    30,
                    optionfilter,
                    optionfiltertanggal,
                    tanggaldari,
                    tanggalsampai,
                    optionbulan,
                    optionTahun,
                    darigudang,
                    kegudang,
                    "filter",
                    ""
                );
            }
        } else {
            const url = await printAllRequest(
                ketmutasi,
                0,
                0,
                optionfilter,
                optionfiltertanggal,
                tanggaldari,
                tanggalsampai,
                optionbulan,
                optionTahun,
                darigudang,
                kegudang
            );
            setPdfUri(url);
            setShowAlertInfoDownload(true)
        }
    };

    const onRefresh = useCallback((statusReq: string) => {
        setRefreshing(true);
        if (statusReq == "perItem") {
            fetchData(
                ketmutasi,
                0,
                30,
                optionfilter,
                optionfiltertanggal,
                "2025-01-01",
                "2025-12-31",
                optionbulan,
                optionTahun,
                darigudang,
                kegudang,
                '',
                'perItem'
            );
        } else {
            fetchData(
                ketmutasi,
                0,
                30,
                optionfilter,
                optionfiltertanggal,
                "2025-01-01",
                "2025-12-31",
                optionbulan,
                optionTahun,
                darigudang,
                kegudang,
                '',
                ''
            );
        }

        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    useEffect(() => {
        fetchData(
            ketmutasi,
            0,
            30,
            optionfilter,
            optionfiltertanggal,
            "2025-01-01",
            "2025-12-31",
            optionbulan,
            optionTahun,
            darigudang,
            kegudang,
            '',
            '',
        );
    }, []);

    const renderMutasiBarang = ({ item }) => {
        return (
            <TouchableOpacity
                style={{
                    marginTop: 8,
                    paddingVertical: 10,
                    paddingHorizontal: 15,
                    borderRadius: 15,
                    backgroundColor: "#fff",
                }}
                onPress={() => handlePressOrderBarang(item.nobukti)}
            >
                <View>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Text style={{ fontWeight: "bold", color: "#585858" }}>
                            {item.nobukti}
                        </Text>
                        <Text style={{ color: "#585858", fontSize: 12 }}>
                            {item.tanggal}
                        </Text>
                    </View>

                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Text style={{ marginTop: 5 }}>{item.detail}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const renderMutasiItemBarang = ({ item }) => {
        return (
            <TouchableOpacity
                style={{
                    marginTop: 8,
                    paddingVertical: 10,
                    paddingHorizontal: 15,
                    borderRadius: 15,
                    backgroundColor: "#fff",
                }}
                onPress={() => console.log(item.noinv)}
            >
                <View>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Text style={{ fontWeight: "bold", color: "#585858" }}>
                            Nomor Bukti : {item.NoBukti}
                        </Text>
                    </View>

                    <View>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                marginTop: 5,
                                paddingVertical: 5,
                                borderBottomWidth: 0.3,
                                borderStyle: "dashed"
                            }}
                        >
                            <Text>Tgl : </Text>
                            <Text style={{ textAlign: "right" }}>
                                {item.Tgl}
                            </Text>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                marginTop: 5,
                                borderBottomWidth: 0.3,
                                paddingVertical: 5,
                                borderStyle: "dashed"
                            }}
                        >
                            <Text>Dari Gudang : </Text>
                            <Text style={{ textAlign: "right" }}>
                                {item.GdgAsal}
                            </Text>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                marginTop: 5,
                                borderBottomWidth: 0.3,
                                paddingVertical: 5,
                                borderStyle: "dashed"
                            }}
                        >
                            <Text>Gudang Tujuan : </Text>
                            <Text style={{ textAlign: "right" }}>
                                {item.GdgTujuan}
                            </Text>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                marginTop: 5,
                                borderBottomWidth: 0.3,
                                paddingVertical: 5,
                                borderStyle: "dashed"
                            }}
                        >
                            <Text>Barang : </Text>
                            <Text style={{ width: 270, textAlign: "right" }}>
                                {item.NamaBrg}
                            </Text>
                        </View>

                    </View>

                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            backgroundColor: "#A0C4FF20",
                            paddingHorizontal: 10,
                            paddingVertical: 3,
                            marginTop: 5,
                            borderRadius: 10,
                        }}
                    >
                        <Text style={{ color: "#585858", fontSize: 12 }}>
                            {"Qtty : " +
                                item.Qtty +
                                " | Harga : " + item.HargaJual}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    return (
        <View style={styles.container}>

            <Text
                style={{
                    color: "#585858",
                    fontWeight: "bold",
                    fontSize: 18,
                    marginBottom: 5,
                    marginTop: 15,
                }}
            >
                Mutasi Barang
            </Text>

            <View style={styles.containerfilter}>
                <TouchableOpacity
                    style={{
                        backgroundColor: "#0085c8",
                        paddingHorizontal: 5,
                        paddingVertical: 5,
                        borderRadius: 5,
                        marginRight: 8,
                    }}
                    onPress={() => { setStatusPrint(""), setModalVisible(true) }}
                >
                    <MaterialCommunityIcons
                        name="filter-variant"
                        size={26}
                        color="#fff"
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                        backgroundColor: "#0085c8",
                        paddingHorizontal: 5,
                        paddingVertical: 5,
                        borderRadius: 5,
                        marginRight: 8,
                    }}
                    onPress={() => { setStatusPrint("print"), setModalVisible(true) }}
                >
                    <MaterialCommunityIcons
                        name="printer"
                        size={26}
                        color="#fff"
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                        backgroundColor: peritem == false ? "#ecececff" : "#0085c8",
                        paddingHorizontal: 10,
                        display: "flex",
                        justifyContent: "center",
                        alignContent: "center",
                        borderRadius: 5,
                        marginRight: 8,
                    }}
                    onPress={() => {
                        setPeritem(!peritem),
                            peritem == false
                                ? handleDataPerItem("")
                                : handleDataPerItem("perItem");
                    }}
                >
                    <Text style={{ color: peritem ? "#fff" : "#000" }}>
                        {peritem == false
                            ? "Lihat PerItem"
                            : "Kembali PerNomor Bukti"}
                    </Text>
                </TouchableOpacity>
            </View>

            <View>
                <FlatList
                    data={mutasibarang}
                    renderItem={peritem == false ? renderMutasiBarang : renderMutasiItemBarang}
                    keyExtractor={(item) => item.id}
                    onEndReached={() => {
                        peritem == false ? nextPage("") : nextPage("perItem");
                    }}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={loading && <ActivityIndicator size="large" />}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => {
                                peritem == false ? onRefresh("") : onRefresh("perItem");
                            }}
                            colors={["#9Bd35A", "#689F38"]}
                        />
                    }
                    style={{ marginBottom: 120 }}
                />
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View style={styles.modalOverlay} />
                </TouchableWithoutFeedback>

                <View style={styles.bottomModal}>
                    <View>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={optionfiltertanggal}
                                style={styles.picker}
                                onValueChange={(itemValue) => setoptionfiltertanggal(itemValue)}
                            >
                                <Picker.Item label="Semua" value="Semua" />
                                <Picker.Item label="Tanggal" value="Tanggal" />
                                <Picker.Item label="Bulan" value="Bulan" />
                                <Picker.Item label="Tahun" value="Tahun" />
                            </Picker>
                        </View>

                        {/* by tgl */}
                        {optionfiltertanggal == "Tanggal" || optionfiltertanggal == "" ? (
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    marginTop: 10,
                                }}
                            >
                                <View style={{ flex: 1, marginRight: 5 }}>
                                    <Text style={{ fontSize: 17, marginBottom: 5 }}>
                                        Tanggal Dari
                                    </Text>
                                    <TouchableOpacity
                                        style={[
                                            styles.pickerContainer,
                                            {
                                                height: 50,
                                                display: "flex",
                                                justifyContent: "center",
                                                paddingHorizontal: 10,
                                            },
                                        ]}
                                        onPress={showDatePickerDari}
                                    >
                                        <Text style={{ fontSize: 17 }}>
                                            {selectedDate
                                                ? selectedDate.toLocaleDateString()
                                                : "Pilih tanggal"}
                                        </Text>
                                    </TouchableOpacity>
                                    <DateTimePickerModal
                                        isVisible={isDatePickerVisible}
                                        mode="date"
                                        onConfirm={handleConfirm}
                                        onCancel={hideDatePickerDari}
                                    />
                                </View>

                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 17, marginBottom: 5 }}>
                                        Tanggal Sampai
                                    </Text>
                                    <TouchableOpacity
                                        style={[
                                            styles.pickerContainer,
                                            {
                                                height: 50,
                                                display: "flex",
                                                justifyContent: "center",
                                                paddingHorizontal: 10,
                                            },
                                        ]}
                                        onPress={showDatePickerSampai}
                                    >
                                        <Text style={{ fontSize: 17 }}>
                                            {selectedDateSampai
                                                ? selectedDateSampai.toLocaleDateString()
                                                : "Pilih tanggal"}
                                        </Text>
                                    </TouchableOpacity>
                                    <DateTimePickerModal
                                        isVisible={isDatePickerVisibleSampai}
                                        mode="date"
                                        onConfirm={handleConfirmSampai}
                                        onCancel={hideDatePickerSampai}
                                    />
                                </View>
                            </View>
                        ) : optionfiltertanggal == "Bulan" ? (
                            <View>
                                <View style={{ marginTop: 10 }}>
                                    <Text style={{ fontSize: 17, marginBottom: 5 }}>Bulan</Text>
                                    <View style={styles.pickerContainer}>
                                        <Picker
                                            selectedValue={optionbulan}
                                            style={styles.picker}
                                            onValueChange={(itemValue) => setOptionBulan(itemValue)}
                                        >
                                            <Picker.Item label="Pilih Bulan" value="Pilih Bulan" />
                                            <Picker.Item label="01" value="01" />
                                            <Picker.Item label="02" value="02" />
                                            <Picker.Item label="03" value="03" />
                                            <Picker.Item label="04" value="04" />
                                            <Picker.Item label="05" value="05" />
                                            <Picker.Item label="06" value="06" />
                                            <Picker.Item label="07" value="07" />
                                            <Picker.Item label="08" value="08" />
                                            <Picker.Item label="09" value="09" />
                                            <Picker.Item label="10" value="10" />
                                            <Picker.Item label="11" value="11" />
                                            <Picker.Item label="12" value="12" />
                                        </Picker>
                                    </View>
                                </View>

                                <View style={{ marginTop: 10 }}>
                                    <Text style={{ fontSize: 17, marginBottom: 5 }}>Tahun</Text>
                                    <View style={styles.pickerContainer}>
                                        <Picker
                                            selectedValue={optionTahun}
                                            style={styles.picker}
                                            onValueChange={(itemValue) => setOptionTahun(itemValue)}
                                        >
                                            <Picker.Item label="Pilih Tahun" value="Pilih Tahun" />
                                            {Array.from({ length: 20 }).map((_, i) => {
                                                const year = new Date().getFullYear() - i;
                                                return (
                                                    <Picker.Item
                                                        key={year}
                                                        label={year.toString()}
                                                        value={year.toString()}
                                                    />
                                                );
                                            })}
                                        </Picker>
                                    </View>
                                </View>
                            </View>
                        ) : optionfiltertanggal == "Tahun" ? (
                            <View style={{ marginTop: 10 }}>
                                <Text style={{ fontSize: 17, marginBottom: 5 }}>Tahun</Text>
                                <View style={styles.pickerContainer}>
                                    <Picker
                                        selectedValue={optionTahun}
                                        style={styles.picker}
                                        onValueChange={(itemValue) => { setOptionTahun(itemValue) }
                                        }
                                    >
                                        <Picker.Item key="xnxx" label="Pilih Tahun" value="Pilih Tahun" />
                                        {Array.from({ length: 20 }).map((_, i) => {
                                            const year = new Date().getFullYear() - i;
                                            return (
                                                <Picker.Item
                                                    key={year}
                                                    label={year.toString()}
                                                    value={year.toString()}
                                                />
                                            );
                                        })}
                                    </Picker>
                                </View>
                            </View>
                        ) : (
                            ""
                        )}

                        <View style={{ marginTop: 10 }}>
                            <Text style={{ fontSize: 17, marginBottom: 5 }}>Berdasarkan</Text>

                            {
                                peritem == false ? (<View style={styles.pickerContainer}>
                                    <Picker
                                        selectedValue={optionfilter}
                                        style={styles.picker}
                                        onValueChange={(itemValue) => setoptionfilter(itemValue)}
                                    >
                                        <Picker.Item label="Nomor Bukti" value="Nomor Bukti" />
                                    </Picker>
                                </View>) : (<View style={styles.pickerContainer}>
                                    <Picker
                                        selectedValue={optionfilter}
                                        style={styles.picker}
                                        onValueChange={(itemValue) => setoptionfilter(itemValue)}
                                    >
                                        <Picker.Item label="Nomor Bukti" value="Nomor Bukti" />
                                        <Picker.Item label="Kode Barang" value="Kode Barang" />
                                        <Picker.Item label="Nama Barang" value="Nama Barang" />
                                    </Picker>
                                </View>)
                            }

                            <View style={[styles.pickerContainer, { marginTop: 5 }]}>
                                <TextInput
                                    style={{ fontSize: 17, paddingHorizontal: 10 }}
                                    placeholder={"Cari by " + optionfilter}
                                    value={ketmutasi}
                                    onChangeText={setKetMutasi}
                                />
                            </View>

                            <View style={{ marginTop: 10 }}>
                                <Text style={{ fontSize: 17, marginBottom: 5 }}>Dari Gudang</Text>
                                <Optiongudang onChange={handleDarigudang} />
                            </View>

                            <View style={{ marginTop: 10 }}>
                                <Text style={{ fontSize: 17, marginBottom: 5 }}>Ke Gudang</Text>
                                <Optiongudang onChange={handleKegudang} />
                            </View>

                            {
                                statusprint === "print" ? (
                                    <View style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        backgroundColor: "#ffe1a020",
                                        paddingHorizontal: 10,
                                        paddingVertical: 3,
                                        marginTop: 5,
                                        borderRadius: 10,
                                    }}>

                                        <Text>Mencetak laporan dengan banyak data dapat menyebabkan terjadi smartphone lambat, jika ingin mencetak banyak data harap melakukan melalui aplikasi komputer.</Text>

                                    </View>
                                ) : ""
                            }



                        </View>

                        <View
                            style={{ flexDirection: "row", justifyContent: "space-between" }}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    peritem == false ? resetAndFetch("") : resetAndFetch("perItem");
                                }}
                                style={{
                                    flex: 1,
                                    marginRight: 5,
                                    height: 50,
                                    backgroundColor: "#0085c8",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    paddingHorizontal: 20,
                                    borderRadius: 10,
                                    marginTop: 15,
                                }}
                            >
                                <Text style={[styles.buttonTextrt, { fontSize: 17 }]}>
                                    Proses
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                                style={{
                                    flex: 1,
                                    height: 50,
                                    backgroundColor: "#c80035",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    paddingHorizontal: 20,
                                    borderRadius: 10,
                                    marginTop: 15,
                                }}
                            >
                                <Text style={[styles.buttonTextrt, { fontSize: 17 }]}>
                                    Tutup
                                </Text>
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
                </View>
            </Modal>
            <CustomAlert
                visible={showAlertInfoDownload}
                title="Sukses!"
                message="Laporan berhasil digenerate, jangan tutup pesan ini sebelum status download sukses"
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

export default mutasiScreen;

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