import { NavigationContainer, DefaultTheme  } from '@react-navigation/native';
import './src/locales/i18n';
import AppNavigator from './src/navigation/AppNavigator';
import Language from './src/screens/Language'
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from './src/locales/i18n';

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#FFF6E5',
  },
};

export default function App() {
  const [languageSet, setLanguageSet] = useState<boolean | null>(null);

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

if (languageSet === null) {
  return null;
}

  return (
    <NavigationContainer theme={MyTheme}>
      {languageSet ? <AppNavigator /> : <Language/>}
    </NavigationContainer>
  );
}