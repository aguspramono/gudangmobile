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
import { getAllPesananRequest, getAllPesananRequestPerItem, printAllRequest } from "./../func/pesananFunc";
import { router, useFocusEffect } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { DateFormat } from "./../func/global/globalFunc";
import CustomAlert from './../component/sweetalert';
import { WebView } from 'react-native-webview';

export default function pesananScreen() {
  const [selectedOrderBarang, setSelectedOrderBarang] = useState(null);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [optionfilter, setoptionfilter] = useState("Nomor Pesanan");
  const [optionfiltertanggal, setoptionfiltertanggal] = useState("Semua");
  const [optionbulan, setOptionBulan] = useState("Bulan");
  const [optionTahun, setOptionTahun] = useState("Tahun");
  const [ketpesanan, setKetPesanan] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDatePickerVisibleSampai, setDatePickerVisibilitySampai] =
    useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateSampai, setSelectedDateSampai] = useState(null);
  const [status, setStatus] = useState("");

  const [pesananbarang, setPesananBarang] = useState<any[]>([]);
  const [limitQuery, setLimitQuery] = useState(0);
  const [peritem, setPeritem] = useState(false);
  const [lastStatusReq, setLastStatusReq] = useState("");
  const [pdfUri, setPdfUri] = useState(null);
  const [showAlertInfoDownload, setShowAlertInfoDownload] = useState(false);
  const [statusprint, setStatusPrint] = useState("");

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

  const handleDataPerItem = (status: string) => {
    if (status == "perItem") {
      fetchData(
        "",
        0,
        30,
        "Nomor Pesanan",
        "Semua",
        "2025-01-01",
        "2025-12-31",
        optionbulan,
        optionTahun,
        "",
        "",
        ""
      );
    } else {
      fetchData(
        "",
        0,
        30,
        "Nomor Pesanan",
        "Semua",
        "2025-01-01",
        "2025-12-31",
        optionbulan,
        optionTahun,
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
    status: string,
    setReq: string,
    statusReq: string
  ) => {

    const orderbarang = [];
    if (statusReq !== lastStatusReq) {
      setPesananBarang([]);
    }

    if (statusReq === "perItem") {

      const response = await getAllPesananRequestPerItem(
        like,
        limitqueryprev,
        limitquery,
        option,
        filter,
        tanggaldari,
        tanggalsampai,
        bulan,
        tahun,
      );

      response.map((item, i) =>
        orderbarang.push({
          id: item.NoPo + page + i + "peritem",
          tanggal: item.Tanggal,
          nopo: item.NoPo,
          departemen: item.Departemen,
          gudang: item.Gudang,
          tglclosing: item.TglClosing,
          nama: item.Nama,
          qtypo: item.QtyPo,
          alokasi: item.Alokasi,
          tglbutuh: item.TglButuh,
          qtypesan: item.QtyBeli,
        })
      );


    } else {

      const response = await getAllPesananRequest(
        like,
        limitqueryprev,
        limitquery,
        option,
        filter,
        tanggaldari,
        tanggalsampai,
        bulan,
        tahun,
        status
      );

      response.map((item, i) =>
        orderbarang.push({
          id: item.NoPesanan + page + i + "noitem",
          inv: item.NoPesanan,
          detail: item.Qtty + " item pesanan barang",
          tanggal: item.tanggal,
          statusdiset: item.statusdiset,
          statusdiket: item.statusdiket,
          disetujui: item.disetujui,
          diketahui: item.diketahui,
        })
      );
    }

    if (setReq === "filter" || statusReq !== lastStatusReq) {
      setPesananBarang(orderbarang);
    } else {
      setPesananBarang([...pesananbarang, ...orderbarang]);
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

      const response = await getAllPesananRequestPerItem(
        ketpesanan,
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

      const response = await getAllPesananRequest(
        ketpesanan,
        0,
        0,
        optionfilter,
        optionfiltertanggal,
        tanggaldari,
        tanggalsampai,
        optionbulan,
        optionTahun,
        ""
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
        ketpesanan,
        nextPageAct,
        30,
        optionfilter,
        optionfiltertanggal,
        tanggaldari,
        tanggalsampai,
        optionbulan,
        optionTahun,
        "",
        "",
        "perItem"
      );
    } else {
      fetchData(
        ketpesanan,
        nextPageAct,
        30,
        optionfilter,
        optionfiltertanggal,
        tanggaldari,
        tanggalsampai,
        optionbulan,
        optionTahun,
        "",
        "",
        ""
      );
    }
  };

  const resetAndFetch = async (statusb, statusReq: string) => {

    let tanggaldari = "2025-07-07";
    let tanggalsampai = "2025-07-07";

    if (optionfiltertanggal === "Tanggal") {
      tanggaldari = DateFormat(selectedDate, "yyyy-mm-dd");
      tanggalsampai = DateFormat(selectedDateSampai, "yyyy-mm-dd");
    }

    if (statusprint === "") {
      setStatus(statusb);


      if (statusReq === "perItem") {
        fetchData(
          ketpesanan,
          nextPageAct,
          30,
          optionfilter,
          optionfiltertanggal,
          tanggaldari,
          tanggalsampai,
          optionbulan,
          optionTahun,
          statusb,
          "filter",
          "perItem"
        );
      } else {
        fetchData(
          ketpesanan,
          nextPageAct,
          30,
          optionfilter,
          optionfiltertanggal,
          tanggaldari,
          tanggalsampai,
          optionbulan,
          optionTahun,
          statusb,
          "filter",
          ""
        );
      }
    } else if(statusprint==="print") {
      const url = await printAllRequest(
        ketpesanan,
        0,
        0,
        optionfilter,
        optionfiltertanggal,
        tanggaldari,
        tanggalsampai,
        optionbulan,
        optionTahun
      );
      setPdfUri(url);
      setShowAlertInfoDownload(true)
    }

  };

  const handlePressOrderBarang = (itemId) => {
    router.navigate({ pathname: "detailPesanBarang", params: { id: itemId } });
    setSelectedOrderBarang(itemId);
  };

  const onRefresh = useCallback((statusReq: string) => {
    setRefreshing(true);
    //setPesananBarang([]);
    if (statusReq == "perItem") {
      fetchData(
        ketpesanan,
        0,
        30,
        optionfilter,
        optionfiltertanggal,
        "2025-01-01",
        "2025-12-31",
        optionbulan,
        optionTahun,
        status,
        "",
        "perItem"
      );
    } else {
      fetchData(
        ketpesanan,
        0,
        30,
        optionfilter,
        optionfiltertanggal,
        "2025-01-01",
        "2025-12-31",
        optionbulan,
        optionTahun,
        status,
        "",
        ""
      );
    }

    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    fetchData(
      ketpesanan,
      0,
      30,
      optionfilter,
      optionfiltertanggal,
      "2025-01-01",
      "2025-12-31",
      optionbulan,
      optionTahun,
      status,
      "",
      ""
    );
  }, []);

  const renderOrderBarang = ({ item }) => {
    return (
      <TouchableOpacity
        style={{
          marginTop: 8,
          paddingVertical: 10,
          paddingHorizontal: 15,
          borderRadius: 15,
          backgroundColor: "#fff",
        }}
        onPress={() => handlePressOrderBarang(item.inv)}
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
            <Text
              style={{
                color: "#585858",
                fontSize: 12,
                backgroundColor:
                  item.statusdiset == "pending"
                    ? "#FFD666"
                    : item.statusdiset == "onprocess"
                      ? "#A0C4FF"
                      : item.statusdiset == "rejected"
                        ? "#FFB6B6"
                        : "#9DE0AD",
                paddingHorizontal: 10,
                paddingVertical: 3,
                marginTop: 5,
                borderRadius: 10,
              }}
            >
              {item.statusdiset == "pending" || item.diketahui == "pending"
                ? "Menunggu"
                : item.statusdiset == null || item.statusdiset == "" || item.statusdiset == "done"
                  ? "Selesai"
                  : item.statusdiset == "rejected" ? "Ditolak" : "Diproses"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };


  const renderOrderBarangItem = ({ item }) => {
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
              NoPesanan : {item.nopo}
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
                {item.tanggal}
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
                {item.nama}
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
              <Text style={{ width: 270, textAlign: "right" }}>
                {item.alokasi}
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
              <Text>Tgl. Butuh : </Text>
              <Text style={{ textAlign: "right" }}>
                {item.tglbutuh}
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
              <Text>Departemen : </Text>
              <Text style={{ textAlign: "right" }}>
                {item.departemen}
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
              {"Qtty Pesan : " +
                item.qtypesan +
                " | Qtty PO : " + item.qtypo +
                " | Tgl Closing : " +
                item.tglclosing}
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
        Pesanan Barang
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
          onPress={() => {setStatusPrint(""),setModalVisible(true)}}
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
          onPress={() =>{setStatusPrint("print"),setModalVisible(true)}}
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
              : "Kembali PerPesanan"}
          </Text>
        </TouchableOpacity>

        {
          peritem === false ? (<ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity style={[styles.button, status === '' ? styles.activeButton : null]}>
              <Text style={[styles.buttonText, status === '' ? styles.activeText : null]} onPress={() => { resetAndFetch("", peritem ? "perItem" : "") }}>Semua</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, status === 'done' ? styles.activeButton : null]} onPress={() => { resetAndFetch("done", peritem ? "perItem" : "") }}>
              <Text style={[styles.buttonText, status === 'done' ? styles.activeText : null]}>Selesai</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, status === 'onprocess' ? styles.activeButton : null]} onPress={() => { resetAndFetch("onprocess", peritem ? "perItem" : "") }}>
              <Text style={[styles.buttonText, status === 'onprocess' ? styles.activeText : null]}>Proses</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, status === 'pending' ? styles.activeButton : null]} onPress={() => { resetAndFetch("pending", peritem ? "perItem" : "") }}>
              <Text style={[styles.buttonText, status === 'pending' ? styles.activeText : null]}>Menunggu</Text>
            </TouchableOpacity>
          </ScrollView>) : ""
        }

      </View>
      <View>
        <FlatList
          data={pesananbarang}
          renderItem={peritem == false ? renderOrderBarang : renderOrderBarangItem}
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
                      onValueChange={(itemValue) => { console.log(itemValue), setOptionTahun(itemValue) }}
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
                    onValueChange={(itemValue) => { setOptionTahun(itemValue) }}

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

                      <Picker.Item label="Nomor Pesanan" value="Nomor Pesanan" />
                      <Picker.Item label="Departemen" value="Departemen" />

                    </Picker>
                  </View>
                ) : (
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={optionfilter}
                      style={styles.picker}
                      onValueChange={(itemValue) => setoptionfilter(itemValue)}
                    >
                      <Picker.Item label="Nomor Pesanan" value="Nomor Pesanan" />
                      <Picker.Item label="Departemen" value="Departemen" />
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
                  value={ketpesanan}
                  onChangeText={setKetPesanan}
                />
              </View>
            </View>

            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <TouchableOpacity
                onPress={() => {
                  peritem == false ? resetAndFetch("", "") : resetAndFetch("", "perItem");
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
    justifyContent: "flex-start",
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
