import { useNavigation } from '@react-navigation/native';
import React from 'react'
import { View, Text, Button, SafeAreaView, StyleSheet } from 'react-native';
import CustomButton from 'src/components/CustomButton';
import CustomButtonDark from 'src/components/CustomButtonDark';
import { setAppLanguage } from 'src/utils/language';

const Language = () => {
   const navigation = useNavigation();
   const selectLanguage = async (lang: string) => {
      await setAppLanguage(lang);
      navigation.navigate('Tervetuloa');
   };
   
   return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Select Language</Text>
          <CustomButtonDark 
            title="Suomi"
            onPress={() => selectLanguage('fi')}
          />
          <CustomButton 
            title="Русский"
            onPress={() => selectLanguage('ru')}
          />
          <CustomButton 
            title="English"
            onPress={() => selectLanguage('en')}
          />
        </View>
      </SafeAreaView>
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
 });

export default Language
