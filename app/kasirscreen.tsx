import React, { useState } from "react";
import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    useWindowDimensions,
    SafeAreaView,
    TextInput,
    Modal
} from "react-native";
import { StatusBar } from "expo-status-bar";

const foods = [
    { id: "1", name: "Bakmi Spesial", price: 25455, category: "Ayam", image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500" },
    { id: "2", name: "Bakmi Komplit Special", price: 31818, category: "Ayam", image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500" },
    { id: "3", name: "Bakmi Ayam Teriyaki", price: 29091, category: "Ayam", image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500" },
    { id: "4", name: "Bakmi Kuah Sapi", price: 27273, category: "Sapi", image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500" },
    { id: "5", name: "Bakmi Sapi Lada Hitam", price: 31818, category: "Sapi", image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500" },
    { id: "6", name: "Bakmi Seafood Pedas", price: 32727, category: "Seafood", image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500" },
    { id: "7", name: "Bakmi Goreng Ayam", price: 29091, category: "Ayam", image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500" },
    { id: "8", name: "Bakmi Goreng Seafood", price: 32727, category: "Seafood", image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500" },
    { id: "9", name: "Bakmi Capcay", price: 31818, category: "Sayur", image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500" },
];

export default function kasirscreen() {
    const [cart, setCart] = useState([]);
    const [collapsed, setCollapsed] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [discount, setDiscount] = useState(0); // nilai diskon (misal 0.1 = 10%)
    const [discountModal, setDiscountModal] = useState(false);

    //state pelanggan
    const [customer, setCustomer] = useState("Guest");
    const [customerModal, setCustomerModal] = useState(false);
    const [customers, setCustomers] = useState(["Guest", "Andi", "Budi", "Citra"]);
    const [newCustomer, setNewCustomer] = useState("");
    const [searchCustomer, setSearchCustomer] = useState("");

    // State bayar
    const [checkoutModal, setCheckoutModal] = useState(false);
    const [orderType, setOrderType] = useState("Dine In"); // default
    const [paymentType, setPaymentType] = useState("Tunai"); // default
    const [tableNumber, setTableNumber] = useState(""); // nomor meja
    const [notes, setNotes] = useState(""); // catatan tambahan


    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;

    const categories = ["All", "Ayam", "Sapi", "Seafood", "Sayur"];

    const addToCart = (item) => {
        setCart((prev) => {
            const found = prev.find((x) => x.id === item.id);
            if (found) {
                return prev.map((x) =>
                    x.id === item.id ? { ...x, qty: x.qty + 1 } : x
                );
            }
            return [...prev, { ...item, qty: 1 }];
        });
    };

    const removeFromCart = (id) => {
        setCart((prev) => prev.filter((x) => x.id !== id));
    };

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const tax = subtotal * 0.1;
    const beforeDiscount = subtotal + tax;
    const total = beforeDiscount - beforeDiscount * discount;

    const filteredFoods = foods.filter((f) => {
        const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());
        const matchCategory =
            selectedCategory === "All" || f.category === selectedCategory;
        return matchSearch && matchCategory;
    });

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => addToCart(item)}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>Rp {item.price.toLocaleString()}</Text>
        </TouchableOpacity>
    );

    return (
        <>
            <StatusBar hidden={true} />
            <SafeAreaView style={styles.container}>
                <View style={styles.row}>
                    {/* Menu List */}
                    <View style={{ flex: 1 }}>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginHorizontal: 10,
                                marginTop: 10,
                            }}
                        >
                            <Text style={{ fontWeight: "bold", fontSize: 14 }}>
                                Kasir: <Text style={{ fontWeight: "normal" }}>admin</Text>
                            </Text>
                            <Text style={{ fontWeight: "bold", fontSize: 14 }}>
                                Pelanggan: <Text style={{ fontWeight: "normal" }}>{customer}</Text>
                            </Text>
                        </View>
                        {/* 🔍 Search Bar */}
                        <TextInput
                            style={[styles.searchBar, { margin: 10 }]}
                            placeholder="Cari menu..."
                            value={search}
                            onChangeText={setSearch}
                        />

                        {/* 🔖 Category Bar */}
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.categoryBar}
                        >
                            {categories.map((cat) => (
                                <TouchableOpacity
                                    key={cat}
                                    style={[
                                        styles.categoryBtn,
                                        selectedCategory === cat && styles.categoryBtnActive,
                                    ]}
                                    onPress={() => setSelectedCategory(cat)}
                                >
                                    <Text
                                        style={[
                                            styles.categoryText,
                                            selectedCategory === cat && styles.categoryTextActive,
                                        ]}
                                    >
                                        {cat}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        <FlatList
                            data={filteredFoods}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id}
                            numColumns={isLandscape ? 3 : 2}
                            key={isLandscape ? "landscape" : "portrait"}
                            contentContainerStyle={{
                                padding: 10,
                                flexGrow: 1,
                                justifyContent: "flex-start",
                            }}
                            columnWrapperStyle={{ justifyContent: "flex-start" }}
                        />
                    </View>

                    {/* Cart - Landscape */}
                    {isLandscape && (
                        <View style={styles.cart}>
                            <Text style={styles.cartTitle}>Cart ({cart.length})</Text>
                            <ScrollView
                                style={{ flex: 1 }}
                                contentContainerStyle={{ paddingBottom: 100 }}
                            >
                                {cart.map((item) => (
                                    <View key={item.id} style={styles.cartItem}>
                                        <View>
                                            <Text style={styles.cartText}>
                                                {item.name} x {item.qty}
                                            </Text>
                                            <Text style={styles.cartSub}>
                                                Rp {(item.price * item.qty).toLocaleString()}
                                            </Text>
                                        </View>
                                        <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                                            <Text style={styles.removeBtn}>❌</Text>
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </ScrollView>

                            <View style={{ paddingBottom: 10 }}>
                                <CartSummary
                                    subtotal={subtotal}
                                    tax={tax}
                                    total={total}
                                    discount={discount}
                                    onOpenDiscount={() => setDiscountModal(true)}
                                    onOpenCustomer={() => setCustomerModal(true)} // 👉 kirim fungsi ini
                                    onOpenCheckOut={() => setCheckoutModal(true)}
                                />
                            </View>
                        </View>
                    )}
                </View>

                {/* Cart - Portrait */}
                {!isLandscape && (
                    <View
                        style={[
                            styles.cartMobile,
                            { flex: collapsed ? 0 : 1 },
                        ]}
                    >
                        <TouchableOpacity
                            style={styles.toggleBtn}
                            onPress={() => setCollapsed(!collapsed)}
                        >
                            <Text style={{ fontWeight: "700" }}>
                                {collapsed
                                    ? `Cart (${cart.length}) - Rp ${total.toLocaleString()}`
                                    : "Tutup Cart"}
                            </Text>
                        </TouchableOpacity>

                        {!collapsed && (
                            <View style={{ flex: 1, padding: 10 }}>
                                <ScrollView style={{ flex: 1 }}>
                                    {cart.map((item) => (
                                        <View key={item.id} style={styles.cartItem}>
                                            <View>
                                                <Text style={styles.cartText}>
                                                    {item.name} x {item.qty}
                                                </Text>
                                                <Text style={styles.cartSub}>
                                                    Rp {(item.price * item.qty).toLocaleString()}
                                                </Text>
                                            </View>
                                            <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                                                <Text style={styles.removeBtn}>❌</Text>
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                </ScrollView>

                                <View>
                                    <CartSummary
                                        subtotal={subtotal}
                                        tax={tax}
                                        total={total}
                                        discount={discount}
                                        onOpenDiscount={() => setDiscountModal(true)}
                                        onOpenCustomer={() => setCustomerModal(true)} // 👉 kirim fungsi ini
                                        onOpenCheckOut={() => setCheckoutModal(true)}
                                    />
                                </View>
                            </View>
                        )}
                    </View>
                )}

                {/* 🔽 Modal Diskon */}
                <Modal
                    visible={discountModal}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setDiscountModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={[styles.modalContent, { width: width, maxHeight: height * 0.6 }]}>
                            <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 10 }}>
                                Pilih Diskon
                            </Text>
                            <ScrollView>
                                {[0, 0.05, 0.1, 0.15, 0.2, 0.3, 0.5].map((d) => (
                                    <TouchableOpacity
                                        key={d}
                                        style={styles.discountOption}
                                        onPress={() => {
                                            setDiscount(d);
                                            setDiscountModal(false);
                                        }}
                                    >
                                        <Text style={{ fontSize: 16 }}>
                                            {d === 0 ? "Tanpa Diskon" : `${d * 100}%`}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                </Modal>

                {/* 🔽 Modal Pilih Pelanggan */}
                <Modal
                    visible={customerModal}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setCustomerModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={[styles.modalContent, { width: width, maxHeight: height * 1 }]}>
                            <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 10 }}>
                                Pilih Pelanggan
                            </Text>

                            {/* 🔍 Search Customer */}
                            <TextInput
                                style={styles.searchBar}
                                placeholder="Cari pelanggan..."
                                value={searchCustomer}
                                onChangeText={setSearchCustomer}
                            />

                            {/* Daftar pelanggan hasil filter */}
                            <ScrollView style={{ flexGrow: 0 }}>
                                {customers
                                    .filter((c) =>
                                        c.toLowerCase().includes(searchCustomer.toLowerCase())
                                    )
                                    .map((c, idx) => (
                                        <TouchableOpacity
                                            key={idx}
                                            style={styles.discountOption}
                                            onPress={() => {
                                                setCustomer(c);
                                                setCustomerModal(false);
                                            }}
                                        >
                                            <Text style={{ fontSize: 14 }}>{c}</Text>
                                        </TouchableOpacity>
                                    ))}
                            </ScrollView>

                            {/* Input pelanggan baru */}
                            <Text style={{ marginTop: 15, fontWeight: "600" }}>Tambah Pelanggan Baru</Text>
                            <TextInput
                                style={styles.searchBar}
                                placeholder="Nama pelanggan..."
                                value={newCustomer}
                                onChangeText={setNewCustomer}
                            />
                            <TouchableOpacity
                                style={[styles.payBtn, { marginTop: 5 }]}
                                onPress={() => {
                                    if (newCustomer.trim() !== "") {
                                        setCustomers([...customers, newCustomer.trim()]);
                                        setCustomer(newCustomer.trim());
                                        setNewCustomer("");
                                        setCustomerModal(false);
                                    }
                                }}
                            >
                                <Text style={styles.payText}>SIMPAN</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>


                {/* 🔽 Modal Checkout */}
                <Modal
                    visible={checkoutModal}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setCheckoutModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={[styles.modalContent, { width: width, maxHeight: height * 0.9 }]}>
                            <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 10 }}>
                                Checkout
                            </Text>

                            {/* 1️⃣ Tipe Pembelian */}
                            <Text style={{ fontWeight: "600", marginTop: 10 }}>Tipe Pembelian</Text>
                            <View style={{ flexDirection: "row", marginTop: 5 }}>
                                {["Dine In", "Take Away"].map((t) => (
                                    <TouchableOpacity
                                        key={t}
                                        style={[
                                            styles.optionBtn,
                                            orderType === t && styles.optionBtnActive,
                                        ]}
                                        onPress={() => setOrderType(t)}
                                    >
                                        <Text
                                            style={[
                                                styles.optionText,
                                                orderType === t && styles.optionTextActive,
                                            ]}
                                        >
                                            {t}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* 2️⃣ Tipe Pembayaran */}
                            <Text style={{ fontWeight: "600", marginTop: 15 }}>Tipe Pembayaran</Text>
                            <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 5 }}>
                                {["Bayar Nanti", "Tunai", "Qris", "Card"].map((p) => (
                                    <TouchableOpacity
                                        key={p}
                                        style={[
                                            styles.optionBtn,
                                            paymentType === p && styles.optionBtnActive,
                                        ]}
                                        onPress={() => setPaymentType(p)}
                                    >
                                        <Text
                                            style={[
                                                styles.optionText,
                                                paymentType === p && styles.optionTextActive,
                                            ]}
                                        >
                                            {p}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* 3️⃣ Nomor Meja dan Catatan */}
                            <View style={{ marginTop: 15 }}>
                                <Text style={{ fontWeight: "600", marginBottom: 5 }}>Nomor Meja (opsional)</Text>
                                <TextInput
                                    style={styles.searchBar}
                                    placeholder="Contoh: 5 / A1"
                                    value={tableNumber}
                                    onChangeText={setTableNumber}
                                />

                                <Text style={{ fontWeight: "600", marginVertical: 5 }}>Catatan (opsional)</Text>
                                <TextInput
                                    style={styles.searchBar}
                                    placeholder="Contoh: Kurangi garam / Tambah sambal"
                                    value={notes}
                                    onChangeText={setNotes}
                                />
                            </View>

                            {/* 4️⃣ Total */}
                            <View style={{ marginTop: 20, padding: 10, backgroundColor: "#f9f9f9", borderRadius: 8 }}>
                                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                                    Total Dibayar:
                                </Text>
                                <Text style={{ fontSize: 18, fontWeight: "bold", color: "#007bff" }}>
                                    Rp {total.toLocaleString()}
                                </Text>
                            </View>

                            {/* 5️⃣ Tombol Proses */}
                            <TouchableOpacity
                                style={[styles.payBtn, { marginTop: 20 }]}
                                onPress={() => {
                                    const lineLength = 30;

                                    let itemsStr = "";
                                    cart.forEach((item) => {
                                        const itemName = `${item.name} x${item.qty}`;
                                        const itemPrice = `Rp ${(item.price * item.qty).toLocaleString()}`;
                                        const spaces = " ".repeat(Math.max(0, lineLength - itemName.length - itemPrice.length));
                                        itemsStr += itemName + spaces + itemPrice + "\n";
                                    });

                                    const subStr = (label, value) => {
                                        const valStr = `Rp ${value.toLocaleString()}`;
                                        const spaces = " ".repeat(Math.max(0, lineLength - label.length - valStr.length));
                                        return label + spaces + valStr + "\n";
                                    };

                                    const receipt = `
==============================
        STRUK PEMBELIAN
==============================
Tipe Order   : ${orderType}
Pembayaran   : ${paymentType}
Pelanggan    : ${customer}
${tableNumber ? `Nomor Meja   : ${tableNumber}` : ""}
${notes ? `Catatan      : ${notes}` : ""}

${itemsStr}------------------------------
${subStr("Subtotal", subtotal)}
${subStr("Pajak (10%)", tax)}
${discount > 0 ? subStr(`Diskon (${discount * 100}%)`, (subtotal + tax) * discount) : ""}------------------------------
${subStr("TOTAL BAYAR", total)}
==============================
       Terima kasih 🙏
                    `;

                                    alert(receipt);
                                    setCheckoutModal(false);
                                }}
                            >
                                <Text style={styles.payText}>PROSES</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>




            </SafeAreaView>
        </>
    );
}

function CartSummary({ subtotal, tax, total, discount, onOpenDiscount, onOpenCustomer, onOpenCheckOut }) {
    return (
        <View style={styles.summary}>
            <View style={styles.rowBetween}>
                <Text style={styles.label}>Subtotal:</Text>
                <Text style={styles.value}>Rp {subtotal.toLocaleString()}</Text>
            </View>
            <View style={styles.rowBetween}>
                <Text style={styles.label}>Pajak 10%:</Text>
                <Text style={styles.value}>Rp {tax.toLocaleString()}</Text>
            </View>
            {discount > 0 && (
                <View style={styles.rowBetween}>
                    <Text style={styles.label}>Diskon ({discount * 100}%):</Text>
                    <Text style={styles.value}>- Rp {((subtotal + tax) * discount).toLocaleString()}</Text>
                </View>
            )}
            <View style={[styles.rowBetween, { marginTop: 8 }]}>
                <Text style={styles.totalLabel}>Total:</Text>
                <Text style={styles.totalValue}>Rp {total.toLocaleString()}</Text>
            </View>

            {/* Tombol Aksi */}
            <View style={{ flexDirection: "row", marginTop: 10 }}>
                <TouchableOpacity style={styles.diskonBtn} onPress={onOpenDiscount}>
                    <Text style={{ color: "#fff", fontWeight: "bold" }}>%</Text>
                </TouchableOpacity>

                {/* 👉 Tombol Pilih Pelanggan */}
                <TouchableOpacity style={styles.userBtn} onPress={onOpenCustomer}>
                    <Text style={{ color: "#000", fontWeight: "bold", fontSize: 16 }}>👤</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.payBtn, { flex: 1 }]}
                    onPress={onOpenCheckOut} // 🔥 buka modal checkout
                >
                    <Text style={styles.payText}>BAYAR</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f5f5f5" },
    row: { flex: 1, flexDirection: "row" },
    list: { padding: 10 },
    card: {
        flex: 1,
        backgroundColor: "#fff",
        margin: 5,
        borderRadius: 10,
        padding: 10,
        alignItems: "center",
        elevation: 0.5,
    },
    image: { width: 120, height: 80, borderRadius: 8 },
    name: { marginTop: 5, fontWeight: "bold", textAlign: "center" },
    price: { color: "#555", marginTop: 3 },

    searchBar: {
        backgroundColor: "#fff",
        padding: 5,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ddd",
    },

    categoryBar: { paddingHorizontal: 10, marginBottom: 5, height: 55 },
    categoryBtn: {
        backgroundColor: "#eee",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginRight: 8,
        height: 35
    },
    categoryBtnActive: { backgroundColor: "#007bff" },
    categoryText: { color: "#333", fontWeight: "600" },
    categoryTextActive: { color: "#fff" },

    cart: {
        width: 280,
        backgroundColor: "#fff",
        padding: 10,
        borderLeftWidth: 1,
        borderLeftColor: "#ddd",
    },
    cartTitle: { fontWeight: "bold", fontSize: 16, marginBottom: 5 },
    cartItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
        borderBottomWidth: 0.5,
        borderBottomColor: "#eee",
        paddingBottom: 5,
    },
    cartText: { fontSize: 14, fontWeight: "600" },
    cartSub: { fontSize: 13, color: "#666" },
    removeBtn: { fontSize: 10, marginLeft: 10 },

    cartMobile: {
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#ddd",
        paddingBottom: 25
    },
    toggleBtn: {
        padding: 12,
        backgroundColor: "#eee",
        alignItems: "center",
    },

    summary: {
        backgroundColor: "#fff",
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: "#ddd",
    },
    rowBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 4,
    },
    label: { fontSize: 14, color: "#333" },
    value: { fontSize: 14, fontWeight: "500" },
    totalLabel: { fontSize: 16, fontWeight: "bold" },
    totalValue: { fontSize: 16, fontWeight: "bold", color: "#000" },
    payBtn: {
        backgroundColor: "#007bff",
        padding: 14,
        borderRadius: 8,
        marginTop: 10,
        alignItems: "center",
    },
    payText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
    diskonBtn: {
        backgroundColor: "#28a745",
        padding: 14,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
        marginRight: 5
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "flex-start",
        backgroundColor: "rgba(0,0,0,0.5)",
        alignItems: 'center',
        alignContent: 'center'
    },

    modalContent: {
        backgroundColor: "#fff",
        padding: 20,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
    },

    discountOption: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    userBtn: {
        backgroundColor: "#dfdfdfff", // abu-abu elegan
        padding: 14,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
        marginRight: 5
    },

    optionBtn: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ddd",
        marginRight: 8,
        marginBottom: 8,
        backgroundColor: "#fff",
    },
    optionBtnActive: {
        backgroundColor: "#007bff",
        borderColor: "#007bff",
    },
    optionText: {
        fontSize: 14,
        color: "#333",
    },
    optionTextActive: {
        color: "#fff",
        fontWeight: "bold",
    },

});
