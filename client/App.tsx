import { NavigationContainer, DefaultTheme  } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#FFF6E5',
  },
};

export default function App() {
  return (
    <NavigationContainer theme={MyTheme}>
      <AppNavigator />
    </NavigationContainer>
  );
}