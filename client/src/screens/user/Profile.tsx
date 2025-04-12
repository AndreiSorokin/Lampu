import React from 'react'
import { View, Text, Button } from 'react-native'

const Profile = () => {
  const logOut = () => {
    try {
      localStorage.removeItem("userData")
      localStorage.removeItem("userToken")
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <View>
      <Text>Profile</Text>
      <Text>Membership</Text>
      <Text>Language</Text>
      <Button onPress={logOut}>Sign out</Button>
    </View>
  )
}

export default Profile
