import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native';
import cakeBoy from '../../../assets/images/cakeBoy.png';
import { Event } from '../../types/events';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  SingleEvent: { eventId: string };
  Events: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'SingleEvent'>;

const SingleEvent: React.FC<Props> = ({ route, navigation }) => {
  const { eventId } = route.params;
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    axios.get(`http://192.168.1.134:3000/events/${eventId}`)
      .then(res => setEvent(res.data))
  }, [])

  if (!event) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Event not found</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ marginBottom: 20 }}
      >
        <Text style={{ fontSize: 18, color: 'blue' }}>← Back to Events</Text>
      </TouchableOpacity>

      <Image
        source={event.imageUrl ? { uri: event.imageUrl } : cakeBoy}
        style={{ width: 200, height: 200, marginBottom: 20 }}
      />
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{event.name}</Text>
      <Text style={{ fontSize: 18 }}>Date: {event.date}</Text>
      <Text style={{ fontSize: 18 }}>Price: ${event.price}</Text>
      <Text>Description: {event.description}</Text>
      <Text>Address: {event.address}</Text>
      <Text>Seats left: {event.enrolledUsers.length} / {event.capacity}</Text>
    </View>
  );
}

export default SingleEvent
