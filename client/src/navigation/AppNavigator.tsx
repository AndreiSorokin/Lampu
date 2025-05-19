import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Tervetuloa from '../screens/Tervetuloa';
import Events from '../screens/event/Events';
import CreateEvent from '../screens/event/CreateEvent';
import SingleEvent from '../screens/event/SingleEvent';
import Profile from '../screens/user/Profile';
import Login from '../screens/user/Login';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text } from 'react-native';
import Register from 'src/screens/user/Register';
import Enrollments from 'src/screens/event/Enrollments';
import Language from 'src/screens/Language';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from 'src/utils/firebaseConfig';
import { useTranslation } from 'react-i18next';
import Likes from 'src/screens/user/Likes';


export type RootStackParamList = {
  Events: undefined;
  SingleEvent: { eventId: number };
  CreateEvent: undefined;
  Profile: undefined;
  Login: undefined;
  Register: undefined;
  Enrollments: undefined;
  Tervetuloa: undefined
  Language: undefined;
};

const Tab = createBottomTabNavigator<RootStackParamList>();
const Stack = createStackNavigator<RootStackParamList>();

function EventStack() {
  return (
    <Stack.Navigator 
    >
      <Stack.Screen name="Events" component={Events} />
      <Stack.Screen name="SingleEvent" component={SingleEvent}/>
      <Stack.Screen name="CreateEvent" component={CreateEvent} />
      <Stack.Screen name="Profile" component={Profile}/>
      <Stack.Screen name="Enrollments" component={Enrollments}/>
      <Stack.Screen name="Likes" component={Likes}/>
      <Stack.Screen name="Tervetuloa" component={Tervetuloa}/>
      <Stack.Screen name="Language" component={Language}/>
    </Stack.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="Language">
      <Stack.Screen name="Language" component={Language} options={{ headerShown: false }}/>
      <Stack.Screen name="Tervetuloa" component={Tervetuloa} options={{ headerShown: false }}/>
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}/>
      <Stack.Screen name="Register" component={Register} options={{ headerShown: false }}/>
      <Stack.Screen name="Events" component={Events} options={{ headerShown: false }}/>
      <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
}

// function AuthStack() {
//   return (
//     <Stack.Navigator initialRouteName="Language">
//       <Stack.Screen name="Language" component={Language} options={{ headerShown: false }} />
//     </Stack.Navigator>
//   );
// }


export default function AppNavigator() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const { t } = useTranslation();


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

  return  (
    <Tab.Navigator >
      <Tab.Screen name="Events" component={EventStack} options={{ headerShown: false }} />
      <Tab.Screen name={t('likes')} component={Likes} options={{ headerShown: false }}/>
      <Tab.Screen name={t('tickets')} component={Enrollments}/>
      <Tab.Screen name={t('profile')} component={Profile} />
    </Tab.Navigator>
  )

  // return isLoggedIn ? (
  //   <Tab.Navigator >
  //     <Tab.Screen name="Events" component={EventStack} options={{ headerShown: false }} />
  //     <Tab.Screen name={t('likes')} component={Likes} options={{ headerShown: false }}/>
  //     <Tab.Screen name={t('tickets')} component={Enrollments}/>
  //     <Tab.Screen name={t('profile')} component={Profile} />
  //   </Tab.Navigator>
  // ) : (
  //   <AuthStack />
  // );
}

// import { createStackNavigator } from '@react-navigation/stack';
// import { View, Text } from 'react-native';
// import React from 'react';

// const Stack = createStackNavigator();

// function DummyScreen() {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>Hello World</Text>
//     </View>
//   );
// }

// export default function AppNavigator() {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen name="Home" component={DummyScreen} />
//     </Stack.Navigator>
//   );
// }
