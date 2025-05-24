import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FlatList, View, Text, Image, Linking, TouchableOpacity } from 'react-native';
import { Share } from 'react-native';

import { Event } from '../../types/events';
import cakeBoy from '../../../assets/images/cakeBoy.png';
import LampuIcon from '../../../assets/images/Lampu.svg';
import InstagramIcon from '../../../assets/images/socialMedia/insta.svg';
import TelegramIcon from '../../../assets/images/socialMedia/telegram.svg';
import LinkedInIcon from '../../../assets/images/socialMedia/linkedIn.svg';
import TikTokIcon from '../../../assets/images/socialMedia/tikTok.svg';
import ShareIcon from '../../../assets/images/events/share.svg';
import LikeIcon from '../../../assets/images/events/like.svg';
import LikeClickedIcon from '../../../assets/images/events/like_clicked.svg';


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
  const [likedItems, setLikedItems] = useState([]);

  useEffect(() => {
    axios.get('http://192.168.101.101:3000/events/')
      .then(response => setEvents(response.data))
  }, [])

  const handleShare = async (event) => {
  try {
    await Share.share({
      message: `Check out this event: ${event.name} on ${event.date}\n${event.link || 'eventURL' + event.id}`,
    });
  } catch (error) {
    console.log('Error sharing event:', error.message);
  }
};

  const toggleLike = (eventId) => {
    setLikedItems((prev) =>
      prev.includes(eventId) ? prev.filter(id => id !== eventId) : [...prev, eventId]
    );
  };

  return (
    <View style={{ flex: 1, padding: 20, marginTop: 30, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20 }}>
        <LampuIcon width={180} height={60} />
        <View style={{
          flexDirection: 'row',
          marginLeft: 10,
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          marginTop: 10,
        }}>
          <TouchableOpacity onPress={() => Linking.openURL('https://www.instagram.com')}>
            <InstagramIcon width={60} height={60} style={{ marginRight: -10 }}/>
          </TouchableOpacity>
      
          <TouchableOpacity onPress={() => Linking.openURL('https://t.me')}>
            <TelegramIcon width={36} height={36} />
          </TouchableOpacity>
      
          <TouchableOpacity onPress={() => Linking.openURL('https://www.tiktok.com')}>
            <TikTokIcon width={36} height={36} />
          </TouchableOpacity>
      
          <TouchableOpacity onPress={() => Linking.openURL('https://www.linkedin.com')}>
            <LinkedInIcon width={36} height={36} />
          </TouchableOpacity>
        </View>
      </View>

      <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <FlatList
        style={{ width: 380, padding: 20 }}
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
                  style={{ width: 380, height: 180, borderRadius: 8 }}
                />
                <View style={{ padding: 10 }}>
                  <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
                  <Text>Date: {item.date}</Text>
                  <Text style={{ fontWeight: 'bold' }}>{item.price}€</Text>
                </View>
              </View>
              <View style={{ position: 'absolute', bottom: 50, right: 0, flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity onPress={() => handleShare(item)}>
                <ShareIcon width={24} height={24} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => toggleLike(item.id)}>
                {likedItems.includes(item.id) ? (
                  <LikeClickedIcon width={24} height={24} />
                ) : (
                  <LikeIcon width={24} height={24} />
                )}
              </TouchableOpacity>
            </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

export default Events