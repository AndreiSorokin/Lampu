// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { createStackNavigator } from '@react-navigation/stack';
// import Home from '../screens/Home';
// import Events from '../screens/event/Events';
// import CreateEvent from '../screens/event/CreateEvent';
// import SingleEvent from '../screens/event/SingleEvent';
// import Profile from '../screens/user/Profile';
// import Login from '../screens/user/Login';
// import { useEffect, useState } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { View, Text } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';

// const Tab = createBottomTabNavigator();
// const Stack = createStackNavigator();

// function EventStack() {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen name="Home" component={Home} />
//       <Stack.Screen name="Events" component={Events} />
//       <Stack.Screen name="SingleEvent" component={SingleEvent}/>
//       <Stack.Screen name="Create event" component={CreateEvent} />
//       <Stack.Screen name="Profile" component={Profile}/>
//     </Stack.Navigator>
//   );
// }

// export default function AppNavigator() {
//   const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

//   useEffect(() => {
//     const checkLoginStatus = async () => {
//       try {
//         const token = await AsyncStorage.getItem('userToken');
//         setIsLoggedIn(!!token);
//       } catch (error) {
//         console.error('Error checking login status:', error);
//         setIsLoggedIn(false);
//       }
//     };
//     checkLoginStatus();
//   }, []);

//   if (isLoggedIn === null) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <Text>Loading...</Text>
//       </View>
//     );
//   }

//   return (
//     <Tab.Navigator>
//       <Tab.Screen name="Home" component={EventStack} options={{ headerShown: false }} />
//       <Tab.Screen name="Login" component={Login} />
//     </Tab.Navigator>
//   );
// }

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import Home from '../screens/Home';
import Events from '../screens/event/Events';
import CreateEvent from '../screens/event/CreateEvent';
import SingleEvent from '../screens/event/SingleEvent';
import Profile from '../screens/user/Profile';
import Login from '../screens/user/Login';
import { View, Text } from 'react-native';

// Define param types for EventStack
export type EventStackParamList = {
  Home: undefined;
  Events: undefined;
  Event: { eventId: number };
  CreateEvent: undefined;
  Profile: undefined;
};

// Define param types for Login stack (when not logged in)
export type AuthStackParamList = {
  Login: undefined;
};

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator<EventStackParamList>(); // Type EventStack
const AuthStack = createStackNavigator<AuthStackParamList>(); // Type AuthStack

function EventStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Events" component={Events} />
      <Stack.Screen name="Event" component={SingleEvent} options={{ title: 'Event Details' }} />
      <Stack.Screen name="CreateEvent" component={CreateEvent} />
      <Stack.Screen name="Profile" component={Profile} />
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
    <AuthStack.Navigator>
      <AuthStack.Screen name="Login" component={Login} options={{ headerShown: false }} />
    </AuthStack.Navigator>
  );
}