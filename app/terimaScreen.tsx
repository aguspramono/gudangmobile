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
  getAllTerimaRequest,
  getAllTerimaPerItemRequest,
  printAllRequest
} from "./../func/terimaFunc";
import { router, useFocusEffect } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { formatNumber,DateFormat } from './../func/global/globalFunc';
import { RadioButton } from 'react-native-paper';
import { WebView } from 'react-native-webview';
import CustomAlert from './../component/sweetalert';


export default function terimaScreen() {
  const [terimabarang, setTerimaBarang] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [peritem, setPeritem] = useState(false);

  const [ketTerima, setKetTerima] = useState("");
  const [optionfilter, setoptionfilter] = useState("Nomor Invoice");
  const [optionfiltertanggal, setoptionfiltertanggal] = useState("Semua");
  const [optionbulan, setOptionBulan] = useState("Bulan");
  const [optionTahun, setOptionTahun] = useState("Tahun");
  const [pilihan, setPilihan] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateSampai, setSelectedDateSampai] = useState(null);
  const [limitQuery, setLimitQuery] = useState(0);

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastStatusReq, setLastStatusReq] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [statusprint, setStatusPrint] = useState("");
  const [pdfUri, setPdfUri] = useState(null);
  const [showAlertInfoDownload, setShowAlertInfoDownload] = useState(false);

  const [isDatePickerVisibleSampai, setDatePickerVisibilitySampai] =
    useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

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

  const handlePressTerimaBarang = (itemId) => {
    router.navigate({ pathname: "detailTerimaBarang", params: { id: itemId } });
  };

  let limitPage = 0;
  let nextPageAct = 0;

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
    setReq: string,
    statusReq: string
  ) => {
    const terimabarangitem = [];

    if (statusReq !== lastStatusReq) {
      setTerimaBarang([]);
    }

    if (statusReq === "perItem") {
      const response = await getAllTerimaPerItemRequest(
        like,
        limitqueryprev,
        limitquery,
        option,
        filter,
        tanggaldari,
        tanggalsampai,
        bulan,
        tahun
      );

      response.map((item, i) => {
        let total = 0;
        total = parseFloat(item.Qtty) * parseFloat(item.Harga);
        let jumlahgrandvaldiskon = 0;
        let jumlahgrandvalppn = 0;
        let diskonGrand = parseFloat(item.Disc);
        let ppngrand = parseFloat(item.PPn);
        let nominaldiskongrand = parseFloat(item.NominalDisc);
        let nominalppngrand = parseFloat(item.NominalPPn);
        if (isNaN(item.Disc) || item.Disc == null || item.Disc == "") {
          diskonGrand = 0;
        }

        if (isNaN(item.PPn) || item.PPn == null || item.PPn == "") {
          ppngrand = 0
        }

        if (isNaN(item.NominalDisc) || item.NominalDisc == null || item.NominalDisc == "") {
          nominalppngrand = 0;
        }

        if (isNaN(item.NominalDisc) || item.NominalDisc == null || item.NominalDisc == "") {
          nominaldiskongrand = 0;
        }

        jumlahgrandvaldiskon = total - (total * diskonGrand) / 100;
        jumlahgrandvalppn =
          jumlahgrandvaldiskon + (jumlahgrandvaldiskon * ppngrand) / 100;

        jumlahgrandvalppn =
          jumlahgrandvalppn + nominalppngrand - nominaldiskongrand;

        terimabarangitem.push({
          id: item.InvNum + page + i + "peritem",
          noinv: item.InvNum,
          detail: item.Qtty + " item terima barang",
          tanggal: item.Tgl,
          namasupplier: item.namaSupplier,
          nopo: item.NoPo,
          namaproduk: item.namaProduct,
          qtty: item.Qtty,
          harga: item.Harga,
          disc: item.Disc,
          ppn: item.PPn,
          gudang: item.Gudang,
          total: jumlahgrandvalppn,
        });
      });
    } else {
      const response = await getAllTerimaRequest(
        like,
        limitqueryprev,
        limitquery,
        option,
        filter,
        tanggaldari,
        tanggalsampai,
        bulan,
        tahun
      );

      response.map((item, i) =>
        terimabarangitem.push({
          id: item.NoInvoice + page + i + "noitem",
          noinv: item.NoInvoice,
          detail: item.Qtty + " item terima barang",
          tanggal: item.Tanggal,
        })
      );
    }


    if (setReq === "filter" || statusReq !== lastStatusReq) {
      setTerimaBarang(terimabarangitem);
    } else {
      setTerimaBarang([...terimabarang, ...terimabarangitem]);
    }

    setLastStatusReq(statusReq);
  };

  const nextPage = async (statusReq: string) => {
    let tanggaldari = "2025-07-07";
    let tanggalsampai = "2025-07-07";

    if (optionfiltertanggal === "Tanggal") {
      tanggaldari = DateFormat(selectedDate, "yyyy-mm-dd");
      tanggalsampai = DateFormat(selectedDateSampai, "yyyy-mm-dd");
    }

    let jumlahdataresponse = 0;
    if (statusReq == "perItem") {
      const response = await getAllTerimaPerItemRequest(
        ketTerima,
        0,
        0,
        optionfilter,
        optionfiltertanggal,
        tanggaldari,
        tanggalsampai,
        optionbulan,
        optionTahun
      );
      jumlahdataresponse = response.length;
    } else {
      const response = await getAllTerimaRequest(
        ketTerima,
        0,
        0,
        optionfilter,
        optionfiltertanggal,
        tanggaldari,
        tanggalsampai,
        optionbulan,
        optionTahun
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
        ketTerima,
        nextPageAct,
        30,
        optionfilter,
        optionfiltertanggal,
        tanggaldari,
        tanggalsampai,
        optionbulan,
        optionTahun,
        "",
        "perItem"
      );
    } else {
      fetchData(
        ketTerima,
        nextPageAct,
        30,
        optionfilter,
        optionfiltertanggal,
        tanggaldari,
        tanggalsampai,
        optionbulan,
        optionTahun,
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
          ketTerima,
          nextPageAct,
          30,
          optionfilter,
          optionfiltertanggal,
          tanggaldari,
          tanggalsampai,
          optionbulan,
          optionTahun,
          "filter",
          "perItem"
        );
      } else {
        fetchData(
          ketTerima,
          nextPageAct,
          30,
          optionfilter,
          optionfiltertanggal,
          tanggaldari,
          tanggalsampai,
          optionbulan,
          optionTahun,
          "filter",
          ""
        );
      }

    } else {
      const url = await printAllRequest(
        ketTerima,
        0,
        0,
        optionfilter,
        optionfiltertanggal,
        tanggaldari,
        tanggalsampai,
        optionbulan,
        optionTahun,
        pilihan
      );
      setPdfUri(url);
      setShowAlertInfoDownload(true)
    }

  };

  const onRefresh = useCallback((statusReq: string) => {
    setRefreshing(true);
    if (statusReq == "perItem") {
      fetchData(
        ketTerima,
        0,
        30,
        optionfilter,
        optionfiltertanggal,
        "2025-01-01",
        "2025-12-31",
        optionbulan,
        optionTahun,
        "",
        "perItem"
      );
    } else {
      fetchData(
        ketTerima,
        0,
        30,
        optionfilter,
        optionfiltertanggal,
        "2025-01-01",
        "2025-12-31",
        optionbulan,
        optionTahun,
        "",
        ""
      );
    }

    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleDataPerItem = (status: string) => {
    setoptionfiltertanggal("Semua");
    //console.log(!peritem)
    if (status == "perItem") {
      fetchData(
        ketTerima,
        0,
        30,
        optionfilter,
        optionfiltertanggal,
        "2025-01-01",
        "2025-12-31",
        optionbulan,
        optionTahun,
        "",
        ""
      );
    } else {
      fetchData(
        ketTerima,
        0,
        30,
        optionfilter,
        optionfiltertanggal,
        "2025-01-01",
        "2025-12-31",
        optionbulan,
        optionTahun,
        "",
        "perItem"
      );
    }
  };

  useEffect(() => {
    fetchData(
      ketTerima,
      0,
      30,
      optionfilter,
      optionfiltertanggal,
      "2025-01-01",
      "2025-12-31",
      optionbulan,
      optionTahun,
      "",
      ""
    );
  }, []);

  const renderTerimaBarang = ({ item }) => {
    return (
      <TouchableOpacity
        style={{
          marginTop: 8,
          paddingVertical: 10,
          paddingHorizontal: 15,
          borderRadius: 15,
          backgroundColor: "#fff",
        }}
        onPress={() => handlePressTerimaBarang(item.noinv)}
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
              {item.noinv}
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

  const renderTerimaBarangItem = ({ item }) => {
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
              Inv : {item.noinv}
            </Text>
            <Text style={{ color: "#585858", fontSize: 12 }}>
              Tgl: {item.tanggal}
            </Text>
          </View>

          <View>
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
              <Text>Supplier : </Text>
              <Text style={{ width: 280, textAlign: "right" }}>
                {item.namasupplier}
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
              <Text>No. PO : </Text>
              <Text style={{ width: 280, textAlign: "right" }}>
                {item.nopo}
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
              <Text>Produk : </Text>
              <Text style={{ width: 280, textAlign: "right" }}>
                {item.namaproduk}
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
                item.qtty +
                " | Hrga : " + formatNumber(item.harga) +
                " | Disc : " +
                item.disc +
                " | PPN : " +
                item.ppn +
                " | Jmlh : " +
                formatNumber(item.total)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Text
        style={{
          color: "#585858",
          fontWeight: "bold",
          fontSize: 18,
          marginBottom: 5,
          marginTop: 15,
        }}
      >
        Terima Barang
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
          <MaterialCommunityIcons name="printer" size={26} color="#fff" />
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
            Lihat  {peritem == false
              ? "PerItem"
              : "PerGroup"}
          </Text>
        </TouchableOpacity>
      </View>

      <View>
        <FlatList
          data={terimabarang}
          renderItem={
            peritem == false ? renderTerimaBarang : renderTerimaBarangItem
          }
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

              {
                peritem == false ? (
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={optionfilter}
                      style={styles.picker}
                      onValueChange={(itemValue) => setoptionfilter(itemValue)}
                    >

                      <Picker.Item label="Nomor Invoice" value="Nomor Invoice" />
                      <Picker.Item label="Nama Supplier" value="Nama Supplier" />
                      <Picker.Item label="Gudang" value="Gudang" />

                    </Picker>
                  </View>
                ) : (
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={optionfilter}
                      style={styles.picker}
                      onValueChange={(itemValue) => setoptionfilter(itemValue)}
                    >
                      <Picker.Item label="Nomor Invoice" value="Nomor Invoice" />
                      <Picker.Item label="Kode Supplier" value="Kode Supplier" />
                      <Picker.Item label="Nama Supplier" value="Nama Supplier" />
                      <Picker.Item label="Gudang" value="Gudang" />
                      <Picker.Item label="Kode Barang" value="Kode Barang" />
                      <Picker.Item label="Nama Barang" value="Nama Barang" />

                    </Picker>
                  </View>
                )
              }


              <View style={[styles.pickerContainer, { marginTop: 5 }]}>
                <TextInput
                  style={{ fontSize: 17, paddingHorizontal: 10 }}
                  placeholder={"Cari by " + optionfilter}
                  value={ketTerima}
                  onChangeText={setKetTerima}
                />
              </View>

              {
                statusprint === "print" ? (<View style={[styles.pickerContainer, { marginTop: 5 }]}><View>
                    <RadioButton.Group onValueChange={setPilihan} value={pilihan}>
                        <RadioButton.Item label="Cash/Kredit" value="cash" />
                        <RadioButton.Item label="Kredit" value="kredit" />
                    </RadioButton.Group>
                </View>
                </View>) : ""
            }

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
              ):""
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

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    backgroundColor: "transparent",
    marginTop: 50,
    paddingHorizontal: 20,
  },

  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  categoryWrapper: {
    alignItems: "center",
    marginBottom: 20,
  },
  categoryItem: {
    alignItems: "center",
    padding: 10,
    borderRadius: 15,
    marginHorizontal: 6.9,
    width: 80,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
    position: "relative",
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#FF3B30",
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
    minWidth: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  menuButton: {
    backgroundColor: "#F1F1F6",
    padding: 10,
    borderRadius: 25,
  },
  avatarContainer: {
    padding: 5,
    borderRadius: 10,
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 15,
  },

  headerProfile: {
    marginBottom: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    marginRight: 5,
  },
  activeButton: {
    backgroundColor: "#0066ff",
  },
  buttonText: {
    color: "#333",
    fontWeight: "500",
  },
  activeText: {
    color: "#fff",
  },
  openButton: {
    backgroundColor: "#2980b9",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  closeButton: {
    backgroundColor: "#c0392b",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 15,
  },
  buttonTextrt: {
    color: "#fff",
    fontWeight: "bold",
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
});
