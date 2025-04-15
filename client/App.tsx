import { NavigationContainer, DefaultTheme  } from '@react-navigation/native';
import './src/locales/i18n';
import AppNavigator from './src/navigation/AppNavigator';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from './src/locales/i18n';
import React from 'react';
import * as Font from 'expo-font';

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#FFF6E5',
  },
};

export default function App() {
  const [languageSet, setLanguageSet] = useState<boolean | null>(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Montserrat-Variable': require('./assets/fonts/Montserrat-VariableFont_wght.ttf'),
      });
      setFontsLoaded(true);
    }

    loadFonts();
  }, []);

useEffect(() => {
  const checkLanguage = async () => {
    const lang = await AsyncStorage.getItem('appLanguage');
    if (lang) {
      i18n.changeLanguage(lang);
      setLanguageSet(true);
    } else {
      setLanguageSet(false);
    }
  };
  checkLanguage();
}, []);

return (
  <NavigationContainer theme={MyTheme}>
    <AppNavigator/>
  </NavigationContainer>
);
}