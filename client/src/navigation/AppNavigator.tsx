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
import EventsIcon from '../../assets/images/menu/home.svg';
import LikesIcon from '../../assets/images/menu/like.svg';
import ProfileIcon from '../../assets/images/menu/profile.svg';
import TicketsIcon from '../../assets/images/menu/ticket.svg';
import EventsIconClicked from '../../assets/images/menu/home_clicked.svg';
import LikesIconClicked from '../../assets/images/menu/like_clicked.svg';
import ProfileIconClicked from '../../assets/images/menu/profile_clicked.svg';
import TicketsIconClicked from '../../assets/images/menu/ticket_clicked.svg';




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
    <Stack.Navigator screenOptions={{ headerShown: false }}>
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
      <Stack.Screen name="Organizer"/>
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
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          switch (route.name) {
            case 'Events':
              return focused
                ? <EventsIconClicked width={24} height={24} />
                : <EventsIcon width={24} height={24} />;
            case t('likes'):
              return focused
                ? <LikesIconClicked width={24} height={24} />
                : <LikesIcon width={24} height={24} />;
            case t('tickets'):
              return focused
                ? <TicketsIconClicked width={24} height={24} />
                : <TicketsIcon width={24} height={24} fill="#FF9A42"/>;
            case t('profile'):
              return focused
                ? <ProfileIconClicked width={24} height={24} />
                : <ProfileIcon width={24} height={24} />;
          }
        },
        tabBarLabelPosition: 'below-icon',
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#000',
        tabBarStyle: {
          backgroundColor: '#FF9A42',
          borderTopWidth: 0,
        },
      })}
    >   
      <Tab.Screen name="Events" component={EventStack} options={{ headerShown: false }} />
      <Tab.Screen name={t('likes')} component={Likes} options={{ headerShown: false }} />
      <Tab.Screen name={t('tickets')} component={Enrollments} options={{ headerShown: false }} />
      <Tab.Screen name={t('profile')} component={Profile} options={{ headerShown: false }} />
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
