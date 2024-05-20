import React, { useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Animated, Easing } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const Informations = () => {
  const titleAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    React.useCallback(() => {
      Animated.timing(titleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.elastic(1),
      }).start();

      return () => {
        titleAnim.setValue(0);
      };
    }, [titleAnim])
  );

  const InfoPlantes = [
    {
      id: '1',
      title: 'Choix d\'emplacement ensoleillé',
      description: 'Placez votre potager dans un endroit recevant au moins 6 à 8 heures de soleil direct par jour.',
    },
    {
      id: '2',
      title: 'Capteur d\'humidité',
      description: 'Intégrez des capteurs d\'humidité dans le système pour mesurer le niveau d\'humidité du sol. Cela permet d\'éviter l\'arrosage excessif ou insuffisant, car le système réagit en fonction des besoins réels des plantes.',
    },
    {
      id: '3',
      title: 'Arrosage au pied',
      description: 'Arrosez les plantes à la base pour éviter les maladies foliaires. Évitez l\'arrosage des feuilles.',
    },
    {
      id: '4',
      title: 'Système de récupération d\'eau de pluie',
      description: 'Si possible, connectez votre système d\'arrosage automatique à un système de récupération d\'eau de pluie. Cela contribue à économiser l\'eau potable et réduit les coûts.',
    },
    {
      id: '5',
      title: 'Compostage régulier',
      description: 'Ajoutez du compost régulièrement pour enrichir le sol en nutriments essentiels.',
    },
    {
      id: '6',
      title: 'Protection contre les ravageurs',
      description: 'Installez des filets ou des barrières physiques pour protéger vos cultures contre les ravageurs.',
    },
    {
      id: '7',
      title: 'Taille appropriée',
      description: 'Taillez régulièrement les plantes pour favoriser la croissance et la production de fruits.',
    },
    {
      id: '8',
      title: 'Choix du type d\'arroseurs',
      description: 'Sélectionnez le type d\'arroseurs en fonction de la taille et du type de plantes dans votre jardin. Les goutteurs, les arroseurs oscillants, et les arroseurs à jet sont quelques-unes des options à considérer.',
    },
    {
      id: '9',
      title: 'Arrosage régulier',
      description: 'Maintenez un calendrier d\'arrosage régulier pour assurer une croissance optimale.',
    },
    {
      id: '10',
      title: 'Protection hivernale',
      description: 'Protégez les plantes sensibles au froid avec des housses ou des paillis avant l\'hiver.',
    },
    {
      id: '11',
      title: 'Engrais naturels',
      description: 'Utilisez des engrais naturels comme le fumier ou le compost pour nourrir vos plantes de manière saine.',
    },
    {
      id: '12',
      title: 'Éviter les pesticides',
      description: 'Minimisez l\'utilisation de pesticides chimiques. Optez pour des solutions naturelles pour contrôler les ravageurs.',
    },
    {
      id: '13',
      title: 'Sélection des variétés',
      description: 'Choisissez des variétés de plantes adaptées à votre climat et à votre sol pour un meilleur rendement.',
    },
    {
      id: '14',
      title: 'Observation régulière',
      description: 'Surveillez régulièrement vos plantes pour détecter rapidement les signes de maladies ou de ravageurs.',
    },
    {
      id: '15',
      title: 'Évitez l\'arrosage aux heures chaudes',
      description: 'Programmez votre système pour éviter l\'arrosage aux heures les plus chaudes de la journée, généralement entre 10 h et 16 h. Cela réduit l\'évaporation de l\'eau et maximise son absorption par le sol.',
    },
  ];

  const renderTipItem = ({ item }) => (
    <View style={styles.tipItem}>
      <Text style={styles.tipTitle}>{item.title}</Text>
      <Text style={styles.tipDescription}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Animated.Text
          style={[
            styles.title,
            {
              transform: [
                {
                  scale: titleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1],
                  }),
                },
              ],
            },
          ]}
        >
          Informations et conseils
        </Animated.Text>
      </View>
      <FlatList
        data={InfoPlantes}
        keyExtractor={(item) => item.id}
        renderItem={renderTipItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 50,
    marginLeft: 50,
  },
  titleContainer: {
    padding: 10,
    borderWidth: 2,
    borderColor: '#004D40',
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#FFFFFF', // Fond blanc pour l'encadré
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#004D40',
    textAlign: 'center',
  },
  tipItem: {
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: {
      width: 1,
      height: 1,
    },
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2E7D32',
  },
  tipDescription: {
    color: '#616161',
  },
});

export default Informations;
