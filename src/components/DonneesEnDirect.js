import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { ProgressBar } from 'react-native-paper'; 
import io from 'socket.io-client';

const CLE_API = '160f085a54215559900e937e77735cf0';
const NOM_VILLE = 'Clichy';
const URL_API_METEO = `https://api.openweathermap.org/data/2.5/forecast?q=${NOM_VILLE}&appid=${CLE_API}&lang=fr`;
const SOCKET_URL = 'http://192.168.5.34:3000';

const PrevisionsMeteo = () => {
  const [donneesMeteo, setDonneesMeteo] = useState(null);
  const [derniereValeurHum, setDerniereValeurHum] = useState(null);
  const [derniereValeurCuve, setDerniereValeurCuve] = useState(null);
  const [socket, setSocket] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('humidite', (data) => {
      console.log('Données d\'humidité reçues :', data);
      setDerniereValeurHum(data.humidite);
    });

    newSocket.on('eau', (data) => {
      console.log('Données de niveau d\'eau reçues :', data);
      setDerniereValeurCuve(data.niveauEau);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchDataMeteo = async () => {
      try {
        const reponse = await fetch(URL_API_METEO);
        const donnees = await reponse.json();
        setDonneesMeteo(donnees);
      } catch (erreur) {
        console.error('Erreur lors de la récupération des données météo :', erreur);
      }
    };

    fetchDataMeteo();
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const convertirEnCelsius = (tempKelvin) => Math.round(tempKelvin - 273.15).toString();

  const choisirIconeMeteo = (description) => {
    switch (description.toLowerCase()) {
      case 'ciel dégagé':
      case 'ensoileillé':
        return 'sun';
      case 'quelques nuages':
      case 'nuages épars':
      case 'nuages fragmentés':
      case 'partiellement nuageux':
      case 'peu nuageux':
      case 'éclaircies':
        return 'cloud-sun';
      case 'très nuageux':
      case 'nuageux':
      case 'couvert':
        return 'cloud';
      case 'légère pluie':
      case 'pluie':
      case 'pluie modérée':
      case 'pluie et bruine':
      case 'pluie forte et bruine':
      case 'bruine pluvieuse':
        return 'cloud-rain';
      case 'averses de pluie':
      case 'averses':
      case 'averse légère':
      case 'averse forte':
      case 'averse déchiquetée':
        return 'cloud-showers-heavy';
      case 'neige':
      case 'neige légère':
      case 'neige forte':
        return 'snowflake';
      case 'orage':
        return 'cloud-bolt';
      case 'brume':
      case 'brouillard':
        return 'bars-staggered';
      case 'bruine forte':
      case 'bruine légère pluvieuse':
      case 'bruine forte pluvieuse':
        return 'cloud-drizzle';
      case 'neige fondue':
      case 'légère averse de neige fondue':
      case 'averse de neige fondue':
        return 'cloud-sleet';
      case 'légère pluie et neige':
      case 'pluie et neige':
      case 'légère averse de neige':
      case 'averse de neige':
      case 'averse de neige forte':
        return 'cloud-snow';
      case 'brume sèche':
        return 'dust';
      case 'fumée':
        return 'smoke';
      case 'tourbillons de sable/poussière':
      case 'poussière':
        return 'dust';
      case 'sable':
        return 'sandstorm';
      case 'cendres volcaniques':
        return 'volcano';
      case 'bourrasques':
        return 'windy';
      case 'tornade':
        return 'tornado';
      default:
        return 'question';
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const responseHumidite = await fetch('http://192.168.5.34:3000/donnees/humidite');
        const dataHumidite = await responseHumidite.json();
        if (dataHumidite.length > 0) {
          const humidite = dataHumidite[0].Taux;
          setDerniereValeurHum(humidite);
        }
      } catch (error) {
        //console.error('Erreur lors de la récupération des données d\'humidité:', error);
      }

      try {
        const responseCuve = await fetch('http://192.168.5.34:3000/donnees/niveauEau');
        const dataCuve = await responseCuve.json();
        if (dataCuve.length > 0) {
          const niveauEau = dataCuve[0].Distance;
          setDerniereValeurCuve(niveauEau);
        }
      } catch (error) {
        //console.error('Erreur lors de la récupération des données de niveau d\'eau:', error);
      }
    };

    init();
  }, []);

  const determinerDirectionVent = (degres) => {
    if (degres >= 0 && degres < 22.5) {
      return 'N';
    } else if (degres >= 22.5 && degres < 67.5) {
      return 'N-E';
    } else if (degres >= 67.5 && degres < 112.5) {
      return 'E';
    } else if (degres >= 112.5 && degres < 157.5) {
      return 'S-E';
    } else if (degres >= 157.5 && degres < 202.5) {
      return 'S';
    } else if (degres >= 202.5 && degres < 247.5) {
      return 'S-O';
    } else if (degres >= 247.5 && degres < 292.5) {
      return 'O';
    } else if (degres >= 292.5 && degres < 337.5) {
      return 'N-O';
    } else if (degres >= 337.5 && degres <= 360) {
      return 'N';
    } else {
      return 'Inconnue';
    }
  };

  const convertirEnKmH = (vitesseMs) => Math.round(vitesseMs * 3.6);


  const afficherPrevisions = () => {
    if (!donneesMeteo || !donneesMeteo.list) {
      return <Text>Chargement...</Text>;
    }

    const timestampActuel = Math.floor(Date.now() / 1000);
    let indiceDebut = 0;
    while (indiceDebut < donneesMeteo.list.length && donneesMeteo.list[indiceDebut].dt < timestampActuel) {
      indiceDebut++;
    }

    const previsions12ProchainesHeures = donneesMeteo.list.slice(indiceDebut, indiceDebut + 12);

    return (
      <ScrollView horizontal contentContainerStyle={styles.scrollView}>
        {previsions12ProchainesHeures.map((prevision) => (
          <View key={prevision.dt} style={styles.itemPrevision}>
            <Text style={styles.date}>
              {new Date(prevision.dt * 1000).toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit' })}
            </Text>
            <Text style={styles.heure}>
              {new Date(prevision.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
            <Icon name={choisirIconeMeteo(prevision.weather[0].description)} size={30} color="#000" />
            <Text style={styles.temperature}>{convertirEnCelsius(prevision.main.temp)}°C</Text>
            <View style={styles.pluieContainer}>
              <View style={styles.pourcentagePluieContainer}>
                <Icon name="umbrella" size={20} color="#000" />
                <Text style={styles.pourcentagePluie}> {parseFloat((prevision.pop * 100).toFixed(0))}%</Text>
              </View>
              <View style={styles.quantitePluieContainer}>
                <Icon name="ruler" size={20} color="#000" />
                <Text style={styles.quantitePluie}> {prevision.rain ? prevision.rain['3h'] : 0} mm</Text>
              </View>
            </View>
            <View style={styles.ventContainer}>
              <Icon name="wind" size={20} color="#000" />
              <Text style={styles.vitesseVent}>{convertirEnKmH(prevision.wind.speed)} km/h</Text>
              <View style={styles.directionVent}>
                <Icon name="compass" size={20} color="#000" style={{ marginRight: 5 }} />
                <Text>{prevision.wind.deg}° {determinerDirectionVent(prevision.wind.deg)}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.titreContainer}>
        <Text style={styles.titre}>Données en temps réel</Text>
      </View>
      <View style={styles.donneesContainer}>
        <Text>
          {derniereValeurHum !== null ? `Le taux d'humidité du sol est de : ${derniereValeurHum}%` : 'Taux d\'humidité du sol en attente...'}
        </Text>
        {derniereValeurHum !== null && (
          <View style={styles.progressBarContainer}>
            <ProgressBar progress={(derniereValeurHum / 100)} color={'green'} style={styles.progressBar} />
          </View>
        )}
      </View>
      <View style={styles.donneesContainer}>
        <Text>
          {derniereValeurCuve !== null ? `La quantité d'eau dans la cuve est de : ${Math.round((derniereValeurCuve / 833) * 100)}%` : 'Quantité d\'eau dans la cuve en attente...'}
        </Text>
        {derniereValeurCuve !== null && (
          <View style={styles.progressBarContainer}>
            <ProgressBar progress={(derniereValeurCuve / 833)} color={'blue'} style={styles.progressBar} />
          </View>
        )}
      </View>
      {afficherPrevisions()}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  titreContainer: {
    borderWidth: 2,
    borderColor: '#000000',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#ffffff',
  },
  titre: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  scrollView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemPrevision: {
    marginTop: -40,
    marginRight: 10,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
  },
  date: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  heure: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 10,
  },
  temperature: {
    fontSize: 18,
    marginTop: 10,
    marginBottom: 5,
  },
  donneesContainer: {
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f0f0f0',
  },
  pluieContainer: {
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f0f0f0',
    flexDirection: 'column',
    alignItems: 'center',
  },
  pourcentagePluieContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantitePluieContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  pourcentagePluie: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  quantitePluie: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  ventContainer: {
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f0f0f0',
    flexDirection: 'column',
    alignItems: 'center',
  },
  vitesseVent: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  directionVent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Ajout de la justification centrée horizontalement
    marginTop: 5,
},
  progressBarContainer: {
    marginTop: 10,
    position: 'relative',
  },
  progressBar: {
    height: 10,
    borderRadius: 10,
  },
});

export default PrevisionsMeteo;

