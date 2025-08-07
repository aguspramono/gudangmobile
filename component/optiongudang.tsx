import { Picker } from "@react-native-picker/picker";
import { useState, useEffect } from "react";
import { getAllDataGudang } from "./../func/gudang";
import {
    View,
    StyleSheet,
    Platform,
} from "react-native";

export const Optiongudang = (props: any) => {
    const [gudang, setGudang] = useState([]);

    async function getDataGudang() {
        const response = await getAllDataGudang();
        let gudangdata = response.map((item: any,i) => {
            return(
                <Picker.Item key={i} label={item.Gudang} value={item.Gudang} />
            );  
        });

        setGudang(gudangdata);
    }

    const [selectedOption, setSelectedOption] = useState("");

    const handleChange = (event: any) => {
        props.onChange(event);
        setSelectedOption(event);
    };

    useEffect(() => {
        getDataGudang();
    }, []);

    return (

        <View style={styles.pickerContainer}>
            <Picker
                selectedValue={selectedOption}
                style={styles.picker}
                onValueChange={(itemValue) => handleChange(itemValue)}
            >
                
                <Picker.Item label="-" value="" />
                {gudang}
            </Picker>
        </View>


        // <div>
        //   <Select
        //     defaultValue={selectedOption}
        //     onChange={handleChange}
        //     options={gudang}
        //     placeholder={"Gudang"}
        //     value={gudang.filter(function (option: any) {
        //       return option.value === props.state;
        //     })}
        //   />
        // </div>
    );
};

const styles = StyleSheet.create({
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
