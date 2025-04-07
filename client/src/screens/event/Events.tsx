import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FlatList, View, Text, Image, TouchableOpacity } from 'react-native';
import { Event } from '../../types/events';
import cakeBoy from '../../../assets/images/cakeBoy.png';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  SingleEvent: { eventId: string };
  Events: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Events'>;

const Events: React.FC<Props> = ({ navigation }) => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    axios.get('http://192.168.1.134:3000/events/')
      .then(response => setEvents(response.data))
  }, [])

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Events</Text>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('SingleEvent', { eventId: item.id })}
          >
            <View style={{ padding: 10, borderBottomWidth: 1 }}>
              <Image
                source={item.imageUrl ? { uri: item.imageUrl } : cakeBoy}
                style={{ width: 100, height: 100 }}
              />
              <Text>{item.name}</Text>
              <Text>Date: {item.date}</Text>
              <Text>Price: ${item.price}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

export default Events