import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../screens/Home';
import Events from '../screens/event/Events';
import CreateEvent from '../screens/event/CreateEvent';
import SingleEvent from '../screens/event/SingleEvent';
import Profile from '../screens/user/Profile';
import Login from '../screens/user/Login';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function EventStack() {
   return (
     <Stack.Navigator>
       <Stack.Screen name="Home" component={Home} />
       <Stack.Screen name="Events" component={Events} />
       <Stack.Screen name="SingleEvent" component={SingleEvent}/>
       <Stack.Screen name="Create event" component={CreateEvent} />
     </Stack.Navigator>
   );
 }
 
 export default function AppNavigator() {
   return (
     <Tab.Navigator>
       <Tab.Screen name="Home" component={EventStack} options={{ headerShown: false }} />
       <Tab.Screen name="Login" component={Login} />
     </Tab.Navigator>
   );
 }