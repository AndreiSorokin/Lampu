import { useNavigation } from '@react-navigation/native';
import React from 'react'
import { View, Text, Button, SafeAreaView, StyleSheet } from 'react-native';
import CustomButton from 'src/components/CustomButton';
import CustomButtonDark from 'src/components/CustomButtonDark';
import { setAppLanguage } from 'src/utils/language';
import EnIcon from '../../assets/images/lang/en.svg';
import FiIcon from '../../assets/images/lang/fi.svg';
import RuIcon from '../../assets/images/lang/ru.svg';
import ArrowRightIcon from'../../assets/images/arrow_right.svg';
import LampuBackground from 'src/components/LampuBackground';
import { useTranslation } from 'react-i18next';

const Language = () => {
   const navigation = useNavigation();
   const { t } = useTranslation();
   const selectLanguage = async (lang: string) => {
      await setAppLanguage(lang);
      navigation.navigate('Tervetuloa');
   };
   
  return (
      <LampuBackground>
        <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.header}>{t('welcome')}</Text>
          <Text style={styles.text}>Valitse kieli / Choose language / Выберите язык</Text>
          <CustomButton 
            title="Suomi"
            onPress={() => selectLanguage('fi')}
            iconLeft={<FiIcon width={65} height={65} />}
            iconRight={<ArrowRightIcon width={24} height={24} />}
          />
          <CustomButton 
            title="Русский"
            onPress={() => selectLanguage('ru')}
            iconLeft={<RuIcon width={65} height={65} />}
            iconRight={<ArrowRightIcon width={24} height={24} />}
          />
          <CustomButton 
            title="English"
            onPress={() => selectLanguage('en')}
            iconLeft={<EnIcon width={65} height={65} />}
            iconRight={<ArrowRightIcon width={24} height={24} />}
          />
        </View>
      </SafeAreaView>
      </LampuBackground>
  );
}

const styles = StyleSheet.create({
   container: {
     flex: 1,
   },
   content: {
     flex: 1,
     justifyContent: 'center',
     alignItems: 'center',
     padding: 20,
   },
   title: {
     fontSize: 24,
     fontWeight: 'bold',
     marginBottom: 20,
     textAlign: 'center',
   },
   text: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
   },
   header: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 20,
   }
 });

export default Language
