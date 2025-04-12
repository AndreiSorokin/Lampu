import { View, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'src/navigation/AppNavigator';
import CustomButton from 'src/components/CustomButton';
import { useTranslation } from 'react-i18next';

type TervetuloaScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const Tervetuloa = ({ navigation }: { navigation: TervetuloaScreenNavigationProp }) => {
  const { t } = useTranslation();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{t('welcome')}</Text>
      <CustomButton 
        title={t('login')}
        onPress={() => navigation.navigate('Login')}
      />
      <CustomButton 
        title={t('register')}
        onPress={() => navigation.navigate('Register')}
      />
    </View>
  );
}

export default Tervetuloa