import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { EventStackParamList } from '../types/navigation';

type NavigationProp = NativeStackNavigationProp<EventStackParamList>;

export default function Home() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to the Home Screen!</Text>
      <Button
        title="Go to Event List"
        onPress={() => navigation.navigate('Events')}
      />
      <Button
        title="Create New Event"
        onPress={() => navigation.navigate('Create event')}
      />
    </View>
  );
}