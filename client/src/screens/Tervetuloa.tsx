import { View, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'src/navigation/AppNavigator';
import CustomButton from 'src/components/CustomButton';

type TervetuloaScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const Tervetuloa = ({ navigation }: { navigation: TervetuloaScreenNavigationProp }) => {

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome!</Text>
      <CustomButton 
        title='Log in'
        onPress={() => navigation.navigate('Login')}
      />
      <CustomButton 
        title='Sign up'
        onPress={() => navigation.navigate('Register')}
      />
    </View>
  );
}

export default Tervetuloa