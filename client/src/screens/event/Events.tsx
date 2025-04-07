import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FlatList, View, Text } from 'react-native'
import { Event } from '../../types/events';

const Events = () => {
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
          <View style={{ padding: 10, borderBottomWidth: 1 }}>
            <Text>{item.name}</Text>
          </View>
        )}
      />
    </View>
  );
}

export default Events