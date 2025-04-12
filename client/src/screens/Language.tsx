import { useNavigation } from '@react-navigation/native';
import React from 'react'
import { View, Text, Button } from 'react-native';
import { setAppLanguage } from 'src/utils/language';

const Language = () => {
   const navigation = useNavigation();
   const selectLanguage = async (lang: string) => {
      await setAppLanguage(lang);
      navigation.navigate('Tervetuloa');
   };
   return (
      <View>
         <Text></Text>
         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Button title="Suomi" onPress={() => selectLanguage('fi')} />
            <Button title="English" onPress={() => selectLanguage('en')} />
            <Button title="Русский" onPress={() => selectLanguage('ru')} />
         </View>
      </View>
   )
}

export default Language
