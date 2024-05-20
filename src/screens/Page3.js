import React, { useState, useEffect, useRef } from 'react';
import { View, ImageBackground, StyleSheet, Modal, Text, TouchableOpacity, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

import DonneesEnDirect from '../components/DonneesEnDirect.js';

const Page3 = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-1000)).current;

  useEffect(() => {
    // Logique pour le useEffect, si nécessaire
  }, []);

  const openModal = () => {
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: -1000,
      duration: 350,
      useNativeDriver: false,
    }).start(() => setModalVisible(false));
  };

  const navigateTo = (screen) => {
    closeModal();
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('/home/theo/Théo/ReactNative/ProjetArrosage/assets/images/arrosage.jpg')}
        style={styles.backgroundImage}
      >
        <TouchableOpacity onPress={openModal} style={styles.openModalButton}>
          <Icon name="bars" size={30} color="black" />
        </TouchableOpacity>

        {/* Ajoute le composant DonneesEnDirect ici */}
        <DonneesEnDirect />

      </ImageBackground>

      <Modal transparent animationType="none" visible={modalVisible} onRequestClose={closeModal}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={closeModal}>
          <Animated.View
            style={[
              styles.modalContainer,
              {
                transform: [
                  {
                    translateX: slideAnim,
                  },
                ],
              },
            ]}
          >
            <View style={styles.modalContent}>
              <TouchableOpacity onPress={() => navigateTo('Accueil')} style={styles.modalLink}>
                <Text style={styles.linkText}>Accueil</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigateTo('Page2')} style={styles.modalLink}>
                <Text style={styles.linkText}>Informations et conseils</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigateTo('Page4')} style={styles.modalLink}>
                <Text style={styles.linkText}>Gestion de l'arrosage</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
  openModalButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
  },
  modalOverlay: {
    flex: 2.5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginTop: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 20,
    marginTop: 10,
  },
  modalLink: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: 'blue',
  },
  linkText: {
    fontSize: 18,
    color: 'green',
    textAlign: 'center',
  },
});

export default Page3;
