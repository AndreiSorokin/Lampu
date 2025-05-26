import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { Formik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';

import Arrow from '../../../assets/images/arrow_left.svg';
import Input from 'src/components/Input';
import CustomButton from 'src/components/CustomButton';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { updateUserSchema, UpdateUserFormData } from 'src/zod/zod.schemas'; // You’ll need this schema
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'src/navigation/AppNavigator';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'UpdateUserInfo'>;
};

const UpdateUserInfo: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const [initialValues, setInitialValues] = useState<UpdateUserFormData>({
    name: '',
    instagram: '',
    telegram: '',
    dateOfBirth: '',
  });
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('userData');
        const token = await AsyncStorage.getItem('userToken');
        if (storedUser && token) {
          const { uid } = JSON.parse(storedUser);
          const response = await axios.get(`http://192.168.101.101:3000/users/${uid}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const { name, instagram, telegram, dateOfBirth } = response.data;
          setInitialValues({
            name: name || '',
            instagram: instagram || '',
            telegram: telegram || '',
            dateOfBirth: dateOfBirth || '',
          });
        }
      } catch (err) {
        console.error('Failed to load user data:', err);
      }
    };

    fetchUserData();
  }, []);

  const handleConfirm = (date: Date, setFieldValue: any) => {
    setFieldValue('dateOfBirth', format(date, 'yyyy-MM-dd'));
    setDatePickerVisibility(false);
  };

  const handleSubmit = async (values: UpdateUserFormData, { setSubmitting }: any) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      await axios.put('http://192.168.101.101:3000/users/update', values, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert(t('success'), t('updateSuccess'));
      navigation.goBack();
    } catch (err: any) {
      console.error('Update failed:', err);
      Alert.alert(t('error'), t('updateFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
          <Arrow width={36} height={36} style={{ left: -130, margin: 10 }} />
        </TouchableOpacity>
      <View style={styles.header}>
        <Text style={styles.title}>{t('edit')}</Text>
      </View>

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={toFormikValidationSchema(updateUserSchema)}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleSubmit, values, errors, touched, isSubmitting, setFieldValue }) => (
          <View>
            <Input
              placeholder={t('name')}
              value={values.name}
              onChangeText={handleChange('name')}
              editable={!isSubmitting}
              style={styles.input}
            />
            {touched.name && errors.name && <Text style={styles.error}>{errors.name}</Text>}

            <Input
              placeholder='Instagram'
              value={values.instagram}
              onChangeText={handleChange('instagram')}
              editable={!isSubmitting}
              style={styles.input}
            />
            {touched.instagram && errors.instagram && (
              <Text style={styles.error}>{errors.instagram}</Text>
            )}

            <Input
              placeholder='telegram'
              value={values.telegram}
              onChangeText={handleChange('telegram')}
              editable={!isSubmitting}
              style={styles.input}
            />
            {touched.telegram && errors.telegram && (
              <Text style={styles.error}>{errors.telegram}</Text>
            )}

            <TouchableOpacity onPress={() => setDatePickerVisibility(true)} style={styles.input}>
              <Text>
                {values.dateOfBirth ? format(new Date(values.dateOfBirth), 'yyyy-MM-dd') : t('dateOfBirth')}
              </Text>
            </TouchableOpacity>
            {touched.dateOfBirth && errors.dateOfBirth && (
              <Text style={styles.error}>{errors.dateOfBirth}</Text>
            )}

            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={(date) => handleConfirm(date, setFieldValue)}
              onCancel={() => setDatePickerVisibility(false)}
              maximumDate={new Date()}
            />

            <CustomButton
              title={isSubmitting ? t('updating') : t('save')}
              onPress={() => handleSubmit()}
              disabled={isSubmitting}
              style={{ marginTop: 20, alignItems: 'center', justifyContent: 'center' }}
            />
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 60, alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20, left: -80 },
  title: { fontSize: 32, fontWeight: 'bold' },
  error: { color: 'red', marginBottom: 10 },
  input: { borderWidth: 1, padding: 12, borderRadius: 50, marginBottom: 10, borderColor: '#FF9A42', backgroundColor: '#fff' },
});

export default UpdateUserInfo;
