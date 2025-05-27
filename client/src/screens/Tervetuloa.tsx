import { View, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'src/navigation/AppNavigator';
import CustomButton from 'src/components/CustomButton';
import { useTranslation } from 'react-i18next';
import ArrowRightIcon from'../../assets/images/arrow_right.svg';

import LampuBackground from 'src/components/LampuBackground';

type TervetuloaScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const Tervetuloa = ({ navigation }: { navigation: TervetuloaScreenNavigationProp }) => {
  const { t } = useTranslation();

  return (
    <LampuBackground>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 18 }}>{t('or')}</Text>
      <CustomButton 
        title={t('login')}
        onPress={() => navigation.navigate('Login')}
        iconRight={<ArrowRightIcon width={24} height={24} />}
      />
      <CustomButton 
        title={t('register')}
        onPress={() => navigation.navigate('Register')}
        iconRight={<ArrowRightIcon width={24} height={24} />}
      />
    </View>
    </LampuBackground>
  );
}

export default Tervetuloa