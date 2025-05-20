import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react'
import { useTranslation } from 'react-i18next';
import { View, Text, Button } from 'react-native'
import { auth } from 'src/utils/firebaseConfig';


const Profile = () => {
  const { t } = useTranslation();
  const logOut = async() => {
    try {
      await auth.signOut();
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
  return (
    <View style={{ flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center' }}>
      <Text>{t('language')}</Text>
      <Text>{t('profile')}</Text>
      <Text>{t('organazer')}</Text>
      <Button
        title='Log out'
        onPress={logOut}
      />
    </View>
  )
}

export default Profile
