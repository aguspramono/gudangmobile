import React, { useEffect, useState, useCallback } from "react";
import { RefreshControl, ActivityIndicator, Platform } from "react-native";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    StatusBar,
    TextInput,
    Modal,
    TouchableOpacity,
    ScrollView,
    TouchableWithoutFeedback,
    Button,
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import {
    getAllKeluarRequest, getAllKeluarPerItemRequest, printAllRequest
} from "./../func/keluarFunc";
import { router, useFocusEffect } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { formatNumber,DateFormat } from './../func/global/globalFunc';
import CustomAlert from './../component/sweetalert';
import { WebView } from 'react-native-webview';
import { Optiongudang } from './../component/optiongudang';

function keluarScreen() {
    const [keluarbarang, setKeluarBarang] = useState<any[]>([]);
    const [page, setPage] = useState(0);
    const [ketkeluar, setKetKeluar] = useState("");
    const [optionfilter, setoptionfilter] = useState("Nomor Invoice");
    const [optionfiltertanggal, setoptionfiltertanggal] = useState("Semua");
    const [optionbulan, setOptionBulan] = useState("Bulan");
    const [optionTahun, setOptionTahun] = useState("Tahun");
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedDateSampai, setSelectedDateSampai] = useState(null);
    const [limitQuery, setLimitQuery] = useState(0);
    const [peritem, setPeritem] = useState(false);
    const [lastStatusReq, setLastStatusReq] = useState("");
    const [darigudang, setDarigudang] = useState("");
    const [kegudang, setKegudang] = useState("");

    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [isDatePickerVisibleSampai, setDatePickerVisibilitySampai] =
        useState(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

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

    const handleDataPerItem = (status: string) => {
        setoptionfiltertanggal("Semua");
        if (status == "perItem") {
            fetchData(
                "",
                0,
                30,
                "Nomor Invoice",
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
                "Nomor Invoice",
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


    const handlePressKeluarBarang = (itemId) => {
        router.navigate({ pathname: "detailKeluarBarang", params: { id: itemId } });
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
        const keluarbarangitem = [];

        if (statusReq !== lastStatusReq) {
            setKeluarBarang([]);
        }

        if (statusReq === "perItem") {

            const response = await getAllKeluarPerItemRequest(
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
                keluarbarangitem.push({
                    id: item.InvNum + page + i + "peritem",
                    InvNum: item.InvNum,
                    Tgl: item.Tgl,
                    Departemen: item.Departemen,
                    NamaBrg: item.NamaBrg,
                    Kode: item.Kode,
                    Gudang: item.Gudang,
                    Qtty: item.Qtty,
                    Harga: item.Harga,
                    Alokasi: item.Alokasi,
                    Merek: item.Merek,
                })
            );

        } else {
            const response = await getAllKeluarRequest(
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
                keluarbarangitem.push({
                    id: item.InvNum + page + i,
                    inv: item.InvNum,
                    detail: item.Qtty + " item keluar barang",
                    tanggal: item.Tanggal
                })
            );
        }


        if (setReq === "filter" || statusReq !== lastStatusReq) {
            setKeluarBarang(keluarbarangitem);
        } else {
            setKeluarBarang([...keluarbarang, ...keluarbarangitem]);
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
            const response = await getAllKeluarPerItemRequest(
                ketkeluar,
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

            //console.log(response);

        } else {

            const response = await getAllKeluarRequest(
                ketkeluar,
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
                ketkeluar,
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
                ketkeluar,
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
                    ketkeluar,
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
                    ketkeluar,
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
                ketkeluar,
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
                ketkeluar,
                0,
                30,
                optionfilter,
                optionfiltertanggal,
                "2025-01-01",
                "2025-12-31",
                optionbulan,
                optionTahun,
                '',
                '',
                '',
                'perItem'
            );
        } else {
            fetchData(
                ketkeluar,
                0,
                30,
                optionfilter,
                optionfiltertanggal,
                "2025-01-01",
                "2025-12-31",
                optionbulan,
                optionTahun,
                '',
                '',
                '',
                '',
            );
        }

        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);


    useEffect(() => {
        fetchData(
            ketkeluar,
            0,
            30,
            optionfilter,
            optionfiltertanggal,
            "2025-01-01",
            "2025-12-31",
            optionbulan,
            optionTahun,
            '',
            '',
            '',
            ''
        );
    }, []);

    const renderKeluarBarang = ({ item }) => {
        return (
            <TouchableOpacity
                style={{
                    marginTop: 8,
                    paddingVertical: 10,
                    paddingHorizontal: 15,
                    borderRadius: 15,
                    backgroundColor: "#fff",
                }}
                onPress={() => handlePressKeluarBarang(item.inv)}
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
                            {item.inv}
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


    const renderKeluarBarangItem = ({ item }) => {
        return (
            <TouchableOpacity
                style={{
                    marginTop: 8,
                    paddingVertical: 10,
                    paddingHorizontal: 15,
                    borderRadius: 15,
                    backgroundColor: "#fff",
                }}
                onPress={() => console.log(item.InvNum)}
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
                            Nomor Invoice : {item.InvNum}
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
                            <Text style={{ width: 270, textAlign: "right" }}>
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
                            <Text>Departemen / Gudang : </Text>
                            <Text style={{ width: 150, textAlign: "right" }}>
                                {item.Departemen}
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
                            <Text>Deskripsi : </Text>
                            <Text style={{ width: 270, textAlign: "right" }}>
                                {item.NamaBrg}
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
                            <Text>Gudang : </Text>
                            <Text style={{ textAlign: "right" }}>
                                {item.Gudang}
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
                            <Text>Alokasi : </Text>
                            <Text style={{ textAlign: "right" }}>
                                {item.Alokasi}
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
                            <Text>Merek : </Text>
                            <Text style={{ textAlign: "right" }}>
                                {item.Merek}
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
                                " | Harga : " + formatNumber(item.Harga)}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

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
                Keluar Barang
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
                            : "Kembali PerGroup"}
                    </Text>
                </TouchableOpacity>
            </View>

            <View>
                <FlatList
                    data={keluarbarang}
                    renderItem={peritem == false ? renderKeluarBarang : renderKeluarBarangItem}
                    keyExtractor={(item) => item.id}
                    onEndReached={() => {
                        peritem == false ? nextPage("") : nextPage("perItem");
                    }}
                    onEndReachedThreshold={0.3}
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
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={optionfilter}
                                    style={styles.picker}
                                    onValueChange={(itemValue) => setoptionfilter(itemValue)}
                                >
                                    <Picker.Item label="Nomor Invoice" value="Nomor Invoice" />
                                    <Picker.Item label="Departemen" value="Departemen" />
                                </Picker>
                            </View>

                            <View style={[styles.pickerContainer, { marginTop: 5 }]}>
                                <TextInput
                                    style={{ fontSize: 17, paddingHorizontal: 10 }}
                                    placeholder={"Cari by " + optionfilter}
                                    value={ketkeluar}
                                    onChangeText={setKetKeluar}
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

export default keluarScreen;

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
