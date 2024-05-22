import React, { useState, useEffect, useRef } from 'react';
import { View, ImageBackground, StyleSheet, Modal, Text, TouchableOpacity, Animated, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Icon from 'react-native-vector-icons/FontAwesome';

const Accueil = () => {
  const navigation = useNavigation();

  // État pour gérer la visibilité du modal et l'état de connexion
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const slideAnim = useRef(new Animated.Value(-1000)).current;
  useEffect(() => {
    checkLoginStatus();
  }, []);

  // Vérifier l'état de connexion en utilisant AsyncStorage
  const checkLoginStatus = async () => {
    const value = await AsyncStorage.getItem('isLoggedIn');
    setIsLoggedIn(value === 'true');
  };

  // Ouvrir le modal
  const openModal = () => {
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  // Fermer le modal
  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: -1000,
      duration: 350,
      useNativeDriver: false,
    }).start(() => setModalVisible(false));
  };

  // Naviguer vers une page spécifique
  const navigateTo = (screen) => {
    closeModal();
    navigation.navigate(screen);
  };

  // Fonction pour ouvrir le compte Instagram
  const openInstagram = () => {
    Linking.openURL('https://www.instagram.com/projet_arrosage_snir/');
  };

  // Fonction pour ouvrir la messagerie
  const openMessage = () => {
    Linking.openURL('mailto:projet.arrosage.snir@gmail.com');
  };

  // Si l'utilisateur est connecté, afficher le contenu principal
  return (
    <View style={styles.container}>
      {/* Image de fond */}
      <ImageBackground
        source={require('/home/theo/Théo/ReactNative/ProjetArrosage/assets/images/arrosage.jpg')}
        style={styles.backgroundImage}
      >
        {/* Bouton pour ouvrir le modal */}
        <TouchableOpacity onPress={openModal} style={styles.openModalButton}>
          <Icon name="bars" size={30} color="black" />
        </TouchableOpacity>

        {/* Bouton de messagerie */}
        <TouchableOpacity onPress={openMessage} style={styles.messageButton}>
          <Icon name="envelope" size={30} color="white" />
        </TouchableOpacity>

        {/* Bloc contenant le titre */}
        <View style={styles.titleContainer}>
          <View style={styles.titleBackground}>
            <Text style={styles.projectText}>Projet d'arrosage intelligent</Text>
            <Text style={styles.emoji}>🌱💧</Text>
          </View>
        </View>

        {/* Bouton Instagram */}
        <TouchableOpacity onPress={openInstagram} style={styles.instagramButton}>
          <Icon name="instagram" size={30} color="white" />
        </TouchableOpacity>
      </ImageBackground>

      {/* Modal pour la navigation */}
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
            {/* Options de navigation dans le modal */}
            <TouchableOpacity onPress={() => navigateTo('Page2')} style={styles.modalLink}>
              <Text style={styles.linkText}>Informations et conseils</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigateTo('Page3')} style={styles.modalLink}>
              <Text style={styles.linkText}>Données en temps réel</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigateTo('Page4')} style={styles.modalLink}>
              <Text style={styles.linkText}>Gestion de l'arrosage</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
        </TouchableOpacity>

      </Modal>

      {/* Texte en bas de la page */}
      <Text style={styles.footerText}>Réalisé par Théo, Mehdi et Marc</Text>
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
  messageButton: {
    position: 'absolute',
    bottom: 15,
    left: 75,
    zIndex: 1,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleBackground: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Fond assombri avec opacité
    padding: 10,
    borderRadius: 10,
  },
  projectText: {
    fontSize: 30,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontStyle: 'italic',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
  },
  emoji: {
    fontSize: 24,
    color: 'white', // Couleur blanche pour l'emoji
    textAlign: 'center',
  },
  instagramButton: {
    position: 'absolute',
    bottom: 15,
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
  footerText: {
  position: 'absolute',
  bottom: 10,
  right: 15,
  color: 'white',
  fontSize: 16,
  fontWeight: 'bold',
  fontStyle: 'italic',
  textShadowColor: 'rgba(0, 0, 0, 0.75)',
  textShadowOffset: { width: 2, height: 2 },
  textShadowRadius: 5,
},
});

export default Accueil;

