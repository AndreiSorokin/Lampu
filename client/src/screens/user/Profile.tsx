import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react'
import { useTranslation } from 'react-i18next';
import { View, Text, Button, Pressable } from 'react-native'
import CustomButton from 'src/components/CustomButton';
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
      <Text>{t('profile')}</Text>
      <View>
        <Text style={{ margin: 10 }}>Name</Text>
        <Button
          title={t('edit')}
        />
      </View>
      <Text>{t('language')}</Text>
      <CustomButton
        title={t('organazer')}
        onPress={() => navigation.navigate('Register')}
        style={{justifyContent: 'center', alignItems: 'center'}}
      />
      <CustomButton
        title={t('logout')}
        onPress={logOut}
        style={{justifyContent: 'center', alignItems: 'center'}}
      />
    </View>
  )
}

export default Profile
