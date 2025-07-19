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
} from "./../func/terimaFunc";
import { router, useFocusEffect } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { DateFormat } from "./../func/global/globalFunc";

export default function terimaScreen() {
  const [terimabarang, setTerimaBarang] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [peritem, setPeritem] = useState(false);

  const [ketTerima, setKetTerima] = useState("");
  const [optionfilter, setoptionfilter] = useState("Nomor PO");
  const [optionfiltertanggal, setoptionfiltertanggal] = useState("Semua");
  const [optionbulan, setOptionBulan] = useState("Bulan");
  const [optionTahun, setOptionTahun] = useState("Tahun");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateSampai, setSelectedDateSampai] = useState(null);
  const [limitQuery, setLimitQuery] = useState(0);

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastStatusReq, setLastStatusReq] = useState("");

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
            let diskonGrand= parseFloat(item.Disc);
            let ppngrand= parseFloat(item.PPn);
            let nominaldiskongrand= parseFloat(item.NominalDisc);
            let nominalppngrand= parseFloat(item.NominalPPn);
            if (isNaN(item.Disc) || item.Disc==null || item.Disc=="") {
                diskonGrand=0;
            }

            if (isNaN(item.PPn) || item.PPn==null || item.PPn=="") {
                ppngrand=0
            }

            if (isNaN(item.NominalDisc) || item.NominalDisc==null || item.NominalDisc=="") {
                nominalppngrand=0;
            }

            if (isNaN(item.NominalDisc) || item.NominalDisc==null || item.NominalDisc=="") {
                nominaldiskongrand=0;
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
          harga:item.Harga,
          disc: item.Disc,
          ppn:item.PPn,
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
                " | Hrga : "+ item.harga +
                " | Disc : " +
                item.disc +
                " | PPN : " +
                item.ppn +
                " | Jmlh : " +
                item.total}
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
          onPress={() => console.log(true)}
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
          onPress={() => console.log(true)}
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
                : "PerInvoice"}
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
          style={{ marginBottom: 20 }}
        />
      </View>
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
