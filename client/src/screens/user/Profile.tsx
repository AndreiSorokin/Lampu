import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react'
import { View, Text, Button } from 'react-native'
import { auth } from 'src/utils/firebaseConfig';


const Profile = () => {
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
    <View>
      <Text>Profile</Text>
      <Text>Membership</Text>
      <Text>Language</Text>
      <Button
        title='Log out'
        onPress={logOut}
      />
    </View>
  )
}

export default Profile
