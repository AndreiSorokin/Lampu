import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FlatList, View, Text, Image, TouchableOpacity } from 'react-native';
import { Event } from '../../types/events';
import cakeBoy from '../../../assets/images/cakeBoy.png';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Search from 'src/components/Search';

type RootStackParamList = {
  SingleEvent: { eventId: string };
  Events: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Events'>;

const Events: React.FC<Props> = ({ navigation }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    axios.get('http://192.168.101.101:3000/events/')
      .then(response => setEvents(response.data))
  }, [])

  return (
    <View style={{ flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center' }}>
      <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Events</Text>
      <FlatList
        style={{ width: 300 }}
        data={events}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('SingleEvent', { eventId: item.id })}
          >
            <View style={{ padding: 10, alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <View>
                <Image
                  source={item.imageUrl ? { uri: item.imageUrl } : cakeBoy}
                  style={{ width: 200, height: 200 }}
                />
                <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
                <Text>Date: {item.date}</Text>
                <Text style={{ fontWeight: 'bold' }}>Price: ${item.price}</Text>
              </View>
              <View style={{ position: 'absolute', bottom: 0, right: 0, flexDirection: 'row', gap: 10 }}>
                <Text>Repost</Text>
                <Text>Like</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

export default Events