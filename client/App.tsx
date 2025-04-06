import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';

export default function App(): JSX.Element {
  const [events, setEvents] = useState<string[]>([]);

  useEffect(() => {
    axios
      .get('http://localhost:3000/events')
      .then((response) => setEvents(response.data.map((e: any) => e.name)))
      .catch((error) => console.error(error));
  }, []);

  return (
    <View style={styles.container}>
      <Text>Events:</Text>
      {events.map((event, index) => (
        <Text key={index}>{event}</Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});