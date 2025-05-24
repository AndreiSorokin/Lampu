import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect  } from 'react'
import { useTranslation } from 'react-i18next';
import { View, Text, Switch, TouchableOpacity } from 'react-native'
import CustomButton from 'src/components/CustomButton';
import CustomButtonDark from 'src/components/CustomButtonDark';
import { auth } from 'src/utils/firebaseConfig';
import ClipIcon from '../../../assets/images/profile/clip.svg';
import DocumentIcon from '../../../assets/images/profile/document.svg';
import LangIcon from '../../../assets/images/profile/language.svg';
import NotificationIcon from '../../../assets/images/profile/notification.svg';

const NOTIFICATION_PREF_KEY = 'notificationsEnabled';

const Profile = () => {
  const { t } = useTranslation();
  const [isEnabled, setIsEnabled] = useState(false);
  useEffect(() => {
    const loadPreference = async () => {
      const value = await AsyncStorage.getItem(NOTIFICATION_PREF_KEY);
      if (value !== null) {
        setIsEnabled(value === 'true');
      }
    };
    loadPreference();
  }, []);

  const toggleSwitch = async () => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);
    await AsyncStorage.setItem(NOTIFICATION_PREF_KEY, newValue.toString());
  };

  const logOut = async() => {
    try {
      await auth.signOut();
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
  return (
    <View style={{ flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontWeight: 'bold', fontSize: 36 }}>{t('profile')}</Text>
      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', backgroundColor: '#FF9A42', width: 350, height: 100, borderRadius: 15 }}>
        <View style={{ display: 'flex', flexDirection: 'column' }}>
          <Text style={{ margin: 10 }}>Name</Text>
          <Text style={{ margin: 10 }}>Email</Text>
        </View>
        <TouchableOpacity
          onPress={() => {}}
          style={{
            backgroundColor: '#EA7108',
            width: 120,
            height: 50,
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold'}}>{t('edit')}</Text>
        </TouchableOpacity>
      </View>
      <View style={{ padding: 20, width: 350 }}>
        <TouchableOpacity
          style={[styles.row, styles.underline]}
          onPress={() => navigation.navigate('Membership')}
        >
          <ClipIcon width={24} height={24} />
          <Text style={styles.text}>{t('membership')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.row, styles.underline]}
          onPress={() => navigation.navigate('Documents')}
        >
          <DocumentIcon width={24} height={24} />
          <Text style={styles.text}>{t('documents')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.row, styles.underline]}
          onPress={() => navigation.navigate('LanguageSettings')}
        >
          <LangIcon width={24} height={24} />
          <Text style={styles.text}>{t('language')}</Text>
        </TouchableOpacity>

        <View style={[styles.row, styles.underline]}>
          <NotificationIcon width={24} height={24} />
          <Text style={styles.text}>{t('notifications')}</Text>
          <View style={{ flex: 1 }} />
          <Switch value={isEnabled} onValueChange={toggleSwitch} />
        </View>
      </View>

      <View style={{ alignItems: 'center', justifyContent: 'center', margin: 100 }}>
        <CustomButton
          title={t('organazer')}
          onPress={() => navigation.navigate('Register')}
          style={{justifyContent: 'center', alignItems: 'center', width: 180, height: 60}}
        />
        <CustomButtonDark
          title={t('logout')}
          onPress={logOut}
          style={{justifyContent: 'center', alignItems: 'center', width: 200, height: 60}}
        />
      </View>
    </View>
  )
}

const styles = {
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 10, 
  },
  text: {
    fontSize: 16,
    color: '#000',
  },
  underline: {
    borderBottomWidth: 1,
    borderBottomColor: '#FF8011',
  },
};

export default Profile
