import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18next';

export const setAppLanguage = async (lang: string) => {
   await AsyncStorage.setItem('appLanguage', lang);
   i18n.changeLanguage(lang);
};

export const getAppLanguage = async () => {
   const storedLang = await AsyncStorage.getItem('appLanguage');
   return storedLang || 'en';
};
