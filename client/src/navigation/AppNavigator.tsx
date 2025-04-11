import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../screens/Home';
import Events from '../screens/event/Events';
import CreateEvent from '../screens/event/CreateEvent';
import SingleEvent from '../screens/event/SingleEvent';
import Profile from '../screens/user/Profile';
import Login from '../screens/user/Login';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Register from 'src/screens/user/Register';

export type RootStackParamList = {
  Home: undefined;
  Events: undefined;
  Event: { eventId: number };
  CreateEvent: undefined;
  Profile: undefined;
  Login: undefined;
  Register: undefined;
};

const Tab = createBottomTabNavigator<RootStackParamList>();
const Stack = createStackNavigator<RootStackParamList>();

function EventStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Events" component={Events} />
      <Stack.Screen name="Event" component={SingleEvent} options={{ title: 'Event Details' }}/>
      <Stack.Screen name="CreateEvent" component={CreateEvent} />
      <Stack.Screen name="Profile" component={Profile}/>
    </Stack.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={Register} options={{ title: 'Register' }} />
      <Stack.Screen name="Events" component={Events} options={{ title: 'Events' }} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        setIsLoggedIn(!!token);
      } catch (error) {
        console.error('Error checking login status:', error);
        setIsLoggedIn(false);
      }
    };
    checkLoginStatus();
    const interval = setInterval(checkLoginStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  if (isLoggedIn === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return isLoggedIn ? (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={EventStack} options={{ headerShown: false }} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  ) : (
    <AuthStack />
  );
}