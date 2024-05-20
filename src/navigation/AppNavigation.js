import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Accueil from '../screens/Accueil.js';
import Page2 from '../screens/Page2.js';
import Page3 from '../screens/Page3.js';
import Page4 from '../screens/Page4.js';
import connexion from '../screens/connexion';

const Stack = createStackNavigator();

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName='Se connecter' screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Accueil" component={Accueil} />
      <Stack.Screen name="Page2" component={Page2} />
      <Stack.Screen name="Page3" component={Page3} />
      <Stack.Screen name="Page4" component={Page4} />
      <Stack.Screen name="Se connecter" component={connexion} />
    </Stack.Navigator>
  </NavigationContainer>
);


export default AppNavigator;
