import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import io from 'socket.io-client';

const ArrosageManuel = ({ toggleAutomaticMode }) => {
  const [arrosageActive, setArrosageActive] = useState(false);
  const [tempsRestant, setTempsRestant] = useState(1200); // Initialisé à 1200 secondes
  const [message, setMessage] = useState('');
  const [apiErrorAlertShown, setApiErrorAlertShown] = useState(false);
  const [manuelActive, setManuelActive] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [disableButton, setDisableButton] = useState(false); // État pour désactiver le bouton

  useEffect(() => {
    const socket = io('http://192.168.5.34:3000');

    socket.on('arrosageActive', (data) => {
      setArrosageActive(data);
    });

    socket.on('tempsRestant', (data) => {
      setTempsRestant(data);
    });

    socket.on('message', (data) => {
      setMessage(data);
    });

    socket.on('apiErrorAlertShown', (data) => {
      setApiErrorAlertShown(data);
    });

    socket.on('manuelActive', (data) => {
      setManuelActive(data);
    });

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    let id = null;
    if (arrosageActive) {
      id = setInterval(() => {
        setTempsRestant((prevTempsRestant) => {
          if (prevTempsRestant <= 1) {
            clearInterval(id);
            setArrosageActive(false);
            setMessage("L'arrosage a été arrêté automatiquement");
            stopArrosage();
            setDisableButton(false); // Réactiver le bouton après la fin du minuteur
            return 1200; // Réinitialiser le minuteur à 1200 secondes
          }
          return prevTempsRestant - 1;
        });
      }, 1000);
    } else if (tempsRestant !== 1200) {
      setTempsRestant(1200); // Réinitialiser le minuteur à 1200 secondes
    }
    setIntervalId(id);
    return () => {
      if (id) {
        clearInterval(id);
      }
    };
  }, [arrosageActive, tempsRestant]);

  useEffect(() => {
    let timeoutId;
    if (message) {
      timeoutId = setTimeout(() => {
        setMessage('');
      }, 3000);
    }
    return () => clearTimeout(timeoutId);
  }, [message]);

  const activerArrosage = async () => {
    if (!timerRunning && !disableButton) { // Empêcher d'activer à nouveau avant la fin du minuteur
      setArrosageActive(true);
      setMessage("L'arrosage a été activé");
      setTimerRunning(true);
      setTimeout(() => {
        setTimerRunning(false);
        setDisableButton(false); // Réactiver le bouton après le délai d'une minute
      }, 60000); // 1 minute = 60000 millisecondes
      setDisableButton(true); // Désactiver le bouton après l'activation de l'arrosage
      try {
        await startArrosage();
      } catch (error) {
        if (!apiErrorAlertShown) {
          setApiErrorAlertShown(true);
        }
      }
    } else if (disableButton) {
      Alert.alert('Attention !', 'Veuillez attendre 1 minute avant de réactiver l\'arrosage');
    }
  };

  const arreterArrosage = async () => {
    setArrosageActive(false);
    setMessage("L'arrosage a été arrêté");
    clearInterval(intervalId);
    try {
      await stopArrosage();
    } catch (error) {
      if (!apiErrorAlertShown) {
        setApiErrorAlertShown(true);
      }
    }
  };

  const startArrosage = async () => {
    await fetch('http://192.168.5.34:3000/start', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };

  const stopArrosage = async () => {
    await fetch('http://192.168.5.34:3000/stop', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };

  const toggleManuelMode = () => {
    setManuelActive((prevManuelActive) => !prevManuelActive);
    toggleAutomaticMode(!manuelActive);

    setMessage(manuelActive ? 'Le mode manuel est désactivé' : 'Le mode manuel est activé');

    if (!manuelActive && arrosageActive) {
      arreterArrosage();
    }
  };


  return (
    <View style={styles.arrosageContainer}>
      <TouchableOpacity
        style={[
          styles.button,
          styles.manualModeButton,
          { backgroundColor: manuelActive ? 'rgb(255, 0, 0)' : 'rgb(0, 128, 0)' },
        ]}
        onPress={toggleManuelMode}
      >
        <Text style={styles.buttonText}>
          {manuelActive ? 'OFF  ' : 'ON  '}
        </Text>
      </TouchableOpacity>

      <View style={[styles.titleContainer, { marginTop: -200 }]}>
        <Text style={styles.title}>Gestion manuelle de l'arrosage</Text>
      </View>

      <View>
        <TouchableOpacity
          disabled={!manuelActive}
          style={[
            styles.button,
            arrosageActive ? styles.activeButton : styles.stopButton,
            { backgroundColor: (!manuelActive && !arrosageActive) ? 'grey' : (arrosageActive ? 'rgb(255, 0, 0)' : 'rgb(0, 128, 0)') },
            { bottom: arrosageActive ? 5 : 5 }
          ]}
          onPress={arrosageActive ? arreterArrosage : activerArrosage}
        >
          <FontAwesome5 name={arrosageActive ? 'stop' : 'tint'} size={30} color="#FFFFFF" />
          <Text style={styles.buttonText}>
            {arrosageActive ? 'Arrêter l\'arrosage' : 'Activer l\'arrosage'}
          </Text>
        </TouchableOpacity>

        {!!message && (
          <View style={[styles.messageContainer, { backgroundColor: manuelActive ? 'rgb(0, 128, 0)' : 'rgb(255, 0, 0)', marginTop: 100, marginLeft: message === "L'arrosage a été activé" ? 15 : (message === "L'arrosage a été arrêté automatiquement" ? -50 : 0) }]}>
            <Text style={styles.messageText}>{message}</Text>
          </View>
        )}

        {arrosageActive && (
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>{`${tempsRestant} sec`}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const ArrosageAutomatique = ({ automatiqueActive }) => {
  const [loading, setLoading] = useState(false);
  const [apiErrorAlertShown, setApiErrorAlertShown] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('http://192.168.5.34:3000/donnees')
      .then(response => response.json())
      .then(() => {
        setLoading(false);
      })
      .catch(() => {
        setApiErrorAlertShown(true);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const socket = io('http://192.168.5.34:3000');

    socket.on('automatiqueActive', (data) => {
      // Gérer le statut automatique actif/inactif ici
    });

    return () => socket.disconnect();
  }, []);

  return (
    <View style={styles.arrosageContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Gestion automatique de l'arrosage</Text>
      </View>

      <View style={[styles.statusMessageContainer, { backgroundColor: automatiqueActive ? 'rgb(255, 0, 0)' : 'rgb(0, 128, 0)', marginTop: 20 }]}>
        <Text style={styles.statusMessageText}>
          {automatiqueActive ? 'Le mode automatique est désactivé' : 'Le mode automatique est activé'}
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="rgb(0, 0, 255)" />
      ) : (
        <View />
      )}

      {apiErrorAlertShown && (
        <View style={[styles.alertContainer, { bottom: 40 }]}>
          <Text style={styles.alertText}>Connexion à l'API en attente...</Text>
        </View>
      )}
    </View>
  );
};

const SeparatorLine = () => (
  <View style={styles.separator} />
);

const GestionArrosage = () => {
  const [automatiqueActive, setAutomatiqueActive] = useState(false);
  const [manuelActive, setManuelActive] = useState(false);

  const toggleAutomaticMode = (newValue) => {
    setAutomatiqueActive(newValue);
    setManuelActive(!newValue);
  };

  return (
    <View style={styles.container}>
      <ArrosageAutomatique automatiqueActive={automatiqueActive} />
      <SeparatorLine />
      <ArrosageManuel toggleAutomaticMode={toggleAutomaticMode} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrosageContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    borderWidth: 2,
    borderColor: '#000000',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000000',
  },
  button: {
    backgroundColor: 'rgba(76, 175, 80, 0.7)',
    padding: 18,
    margin: 15,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  activeButton: {
    backgroundColor: 'rgb(255, 0, 0)',
  },
  stopButton: {
    backgroundColor: 'rgb(255, 0, 0)',
  },
  timerContainer: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    marginBottom: -130,
    marginLeft: 50,
  },
  timerText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  messageContainer: {
    position: 'absolute',
    marginBottom: 15,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  separator: {
    width: '100%',
    height: 2,
    backgroundColor: 'black',
    marginVertical: 10,
  },
  alertContainer: {
    position: 'absolute',
    bottom: 70,
    backgroundColor: 'rgba(255, 0, 0, 0.9)',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#000000',
  },
  alertText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  manualModeButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: '#3F51B8',
    padding: 12,
    borderRadius: 15,
  },
  statusMessageContainer: {
    padding: 5,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  statusMessageText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default GestionArrosage;
