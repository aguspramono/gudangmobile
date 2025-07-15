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
import { getAllPesananRequest } from "./../func/pesananFunc";
import { router, useFocusEffect } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { DateFormat } from "./../func/global/globalFunc";

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
    status:string,
    setReq:string
  ) => {
    const orderbarang = [];
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
        id: item.NoPesanan + page + i,
        inv: item.NoPesanan,
        detail: item.Qtty + " item pesanan barang",
        tanggal: item.tanggal,
        statusdiset: item.statusdiset,
        statusdiket: item.statusdiket,
        disetujui: item.disetujui,
        diketahui: item.diketahui,
      })
    );

    if(setReq==="filter"){
      setPesananBarang(orderbarang);
    }else{
      setPesananBarang([...pesananbarang, ...orderbarang]);
    }
    
  };

  let limitPage = 0;
  let nextPageAct = 0;

  const nextPage = async () => {

    let tanggaldari="2025-07-07";
    let tanggalsampai="2025-07-07";

    if(optionfiltertanggal==="Tanggal"){
      tanggaldari = DateFormat(selectedDate,"yyyy-mm-dd");
      tanggalsampai = DateFormat(selectedDateSampai,"yyyy-mm-dd");
    }
    const response = await getAllPesananRequest(ketpesanan, 0, 0, optionfilter, optionfiltertanggal, tanggaldari, tanggalsampai, optionbulan, optionTahun, "");
    limitPage = Math.ceil(response.length / 10);

    if (page >= limitPage) {
      setPage(limitPage);
    } else {
      setPage(page + 1);
    }

    nextPageAct = limitQuery + 30;
    setLimitQuery(nextPageAct);

    if (nextPageAct >= response.length) {
      nextPageAct = response.length;
      setLimitQuery(nextPageAct);
    }

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
      status,
      ""
    );
  };

  const resetAndFetch = (statusb) => {
    setStatus(statusb);
      let tanggaldari="2025-07-07";
      let tanggalsampai="2025-07-07";

      if(optionfiltertanggal==="Tanggal"){
        tanggaldari = DateFormat(selectedDate,"yyyy-mm-dd");
        tanggalsampai = DateFormat(selectedDateSampai,"yyyy-mm-dd");
      }
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
      "filter"
    );
  };

  const handlePressOrderBarang = (itemId) => {
    router.navigate({ pathname: "detailPesanBarang", params: { id: itemId } });
    setSelectedOrderBarang(itemId);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
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
      ""
    );
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
                : item.statusdiset}
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
          onPress={() => setModalVisible(true)}
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
          onPress={() => setModalVisible(true)}
        >
          <MaterialCommunityIcons
            name="printer"
            size={26}
            color="#fff"
          />
        </TouchableOpacity>


        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity style={[styles.button, status===''?styles.activeButton:null]}>
            <Text style={[styles.buttonText, status===''?styles.activeText:null]} onPress={()=>{resetAndFetch("")}}>Semua</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, status==='done'?styles.activeButton:null]} onPress={()=>{resetAndFetch("done")}}>
            <Text style={[styles.buttonText, status==='done'?styles.activeText:null]}>Disetujui</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, status==='onprocess'?styles.activeButton:null]} onPress={()=>{resetAndFetch("onprocess")}}>
            <Text style={[styles.buttonText, status==='onprocess'?styles.activeText:null]}>Onprocess</Text>
          </TouchableOpacity>
           <TouchableOpacity style={[styles.button, status==='pending'?styles.activeButton:null]} onPress={()=>{resetAndFetch("pending")}}>
            <Text style={[styles.buttonText, status==='pending'?styles.activeText:null]}>Menunggu</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <View>
        <FlatList
          data={pesananbarang}
          renderItem={renderOrderBarang}
          keyExtractor={(item) => item.id}
          onEndReached={() => {
            nextPage();
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loading && <ActivityIndicator size="large" />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#9Bd35A", "#689F38"]}
            />
          }
          style={{ marginBottom: 20 }}
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
                    selectedValue={optionfiltertanggal}
                    style={styles.picker}
                    onValueChange={(itemValue) =>
                      setOptionTahun(itemValue)
                    }
                  >
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
                  <Picker.Item label="Nomor Pesanan" value="Nomor Pesanan" />
                  <Picker.Item label="Departemen" value="Departemen" />
                </Picker>
              </View>

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
                  resetAndFetch("")
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
            </View>
          </View>
        </View>
      </Modal>
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
    justifyContent: "space-between",
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
