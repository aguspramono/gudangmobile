import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Modal from 'react-native-modal';

const CustomAlert = ({ visible, onClose,onAcc,onDec, title, message, icon, option, textconfirmacc,textconfirmdec }) => {
  return (
    <Modal isVisible={visible} animationIn="zoomIn" animationOut="zoomOut">
      <View style={styles.modalContainer}>
        <View style={styles.iconContainer}>
          <Image source={icon} style={styles.icon} />
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
        {option=="confirm" ? (
            <View style={{ flexDirection: 'row'}}>
                <TouchableOpacity onPress={onAcc} style={[styles.button,{marginRight: 10}]}>
                    <Text style={styles.buttonText}>{textconfirmacc}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onDec} style={styles.buttonDecline}>
                    <Text style={styles.buttonText}>{textconfirmdec}</Text>
                </TouchableOpacity>
            </View>
        ):(<TouchableOpacity onPress={onClose} style={styles.button}>
          <Text style={styles.buttonText}>Oke</Text>
        </TouchableOpacity>)}
       
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 15,
  },
  icon: {
    width: 60,
    height: 60,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  button: {
    backgroundColor: '#00C851',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 10,
  },
  buttonDecline: {
    backgroundColor: '#FF4444',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CustomAlert;
