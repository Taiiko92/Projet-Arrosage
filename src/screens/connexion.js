import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { AntDesign } from '@expo/vector-icons'; // Import des icônes AntDesign

export default function EcranConnexion() {
    const navigation = useNavigation();
    const [showPassword, setShowPassword] = useState(false);
    const [identifiant, setIdentifiant] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Fonction de connexion
    const handleLogin = async () => {
        if (!identifiant || !password) {
            setError('Veuillez remplir tous les champs');
            return;
        }
    
        const url = 'http://192.168.44.54:3000/connexion';
    
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Identifiant: identifiant,
                    MotDePasse: password,
                }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                navigation.navigate('Accueil');
            } else {
                setError(data.message || 'Une erreur est survenue lors de la connexion');
            }
        } catch (err) {
            console.error('Erreur lors de la connexion :', err);
            setError('Une erreur est survenue lors de la connexion');
        }
    };
    
    return (
        <View style={{ flex: 1 }}>
            <StatusBar style="light" />
            {/* Votre image de fond */}
            <Image
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', resizeMode: 'cover' }}
                source={require('/home/theo/Théo/ReactNative/ProjetArrosage/assets/images/fond.png')}
            />

            {/* Images de lampe avec animation FadeInUp */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', position: 'absolute', top: 0, width: '100%' }}>
                <Animated.Image
                    entering={FadeInUp.delay(200).duration(1000).springify()}
                    source={require('/home/theo/Théo/ReactNative/ProjetArrosage/assets/images/lampe.png')}
                    style={{ height: 225, width: 90 }}
                />
                <Animated.Image
                    entering={FadeInUp.delay(400).duration(1000).springify()}
                    source={require('/home/theo/Théo/ReactNative/ProjetArrosage/assets/images/lampe.png')}
                    style={{ height: 160, width: 65 }}
                />
            </View>

            {/* Formulaire de connexion */}
            <View style={{ justifyContent: 'space-around', flex: 1, paddingVertical: 40, paddingHorizontal: 20, marginTop: 350 }}>
                <View style={[styles.formContainer, styles.keyboardAvoid]}>

                    {/* Champ Identifiant */}
                    <Animated.View
                        entering={FadeInDown.duration(1000).springify()}
                        style={styles.inputContainer}
                    >
                        <AntDesign name="user" size={24} color="gray" />
                        <TextInput
                            placeholder="Identifiant"
                            placeholderTextColor={'gray'}
                            onChangeText={text => setIdentifiant(text.replace(/\s+/g, ''))}
                            style={styles.input}
                        />

                    </Animated.View>

                    {/* Champ Mot de passe */}
                    <Animated.View
                        entering={FadeInDown.delay(200).duration(1000).springify()}
                        style={styles.inputContainer}
                    >
                        <AntDesign name="lock" size={24} color="gray" />
                        <TextInput
                            placeholder="Mot de passe"
                            placeholderTextColor={'gray'}
                            secureTextEntry={!showPassword}
                            onChangeText={text => setPassword(text.replace(/\s+/g, ''))}
                            style={styles.input}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <AntDesign name={showPassword ? 'eye' : 'eyeo'} size={24} color="gray" />
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Affichage de l'erreur */}
                    {error ? (
                        <Animated.Text
                            entering={FadeInDown.delay(200).duration(1000).springify()}
                            style={styles.errorText}
                        >
                            {error}
                        </Animated.Text>
                    ) : null}

                    {/* Bouton Se connecter */}
                    <Animated.View
                        entering={FadeInDown.delay(400).duration(1000).springify()}
                        style={styles.buttonContainer}
                    >
                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleLogin}
                        >
                            <Text style={styles.buttonText}>Se connecter</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
   formContainer: {
       alignItems: 'center',
       marginHorizontal: 5,
       marginTop: 675,
   },
   keyboardAvoid: {
       marginTop: 0,
   },
   inputContainer: {
       flexDirection: 'row',
       alignItems: 'center',
       backgroundColor: 'rgba(0,0,0,0.2)',
       padding: 20,
       borderRadius: 10,
       width: '100%',
       marginBottom: 20,
   },
   input: {
       marginLeft: 10,
       flex: 1,
   },
   errorText: {
       color: 'red',
       marginBottom: 10,
   },
   buttonContainer: {
       width: '100%',
   },
   button: {
       backgroundColor: '#00BFFF',
       padding: 15,
       borderRadius: 10,
       marginBottom: 20,
   },
   buttonText: {
       color: 'white',
       fontWeight: 'bold',
       fontSize: 20,
       textAlign: 'center',
   },
   signInLinkContainer: {
       flexDirection: 'row',
       justifyContent: 'center',
   },
   signInText: {
       color: 'gray',
       marginRight: 5,
   },
   signInLink: {
       color: '#00BFFF',
   },
});

