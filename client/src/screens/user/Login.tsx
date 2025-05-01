import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { LoginFormData, loginSchema } from '../../zod/zod.schemas';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Formik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { auth } from '../../utils/firebaseConfig';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import Input from 'src/components/Input';
import CustomButton from 'src/components/CustomButton';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const Login = ({ navigation }: { navigation: LoginScreenNavigationProp }) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
    input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
    error: { color: 'red', marginBottom: 10 },
  });
  
  const initialValues: LoginFormData = {
    email: '',
    password: '',
  };

  const handleSubmit = async (values: LoginFormData, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    try {
      setSubmitting(true);
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;
      const token = await userCredential.user.getIdToken();
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify({
        uid: user.uid,
        email: user.email,
      }));
    } catch (error) {
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Formik
        initialValues={initialValues}
        validationSchema={toFormikValidationSchema(loginSchema)}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleSubmit, values, errors, touched }) => (
          <View>
            <View style={{ position: 'relative' }}>
              <Input
                placeholder={t('email')}
                value={values.email}
                onChangeText={handleChange('email')}
              />
              {isValidEmail(values.email) && (
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color="green"
                  style={{ position: 'absolute', right: 15, top: 25 }}
                />
              )}
            </View>
            {touched.email && errors.email && (
              <Text style={styles.error}>{errors.email}</Text>
            )}

            <View style={{ position: 'relative' }}>
              <Input
                style={styles.input}
                placeholder={t('password')}
                onChangeText={handleChange('password')}
                value={values.password}
                secureTextEntry={!showPassword}
              />
              <Ionicons
                name={showPassword ? 'eye-off' : 'eye'}
                size={20}
                color="gray"
                style={{ position: 'absolute', right: 15, top: 25 }}
                onPress={() => setShowPassword(!showPassword)}
              />
            </View>
            {touched.password && errors.password && (
              <Text style={styles.error}>{errors.password}</Text>
            )}

            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <CustomButton 
                title={t('login')}
                onPress={() => handleSubmit()}
                style={{justifyContent: 'center', alignItems: 'center'}}
              />
              <CustomButton
                title={t('register')}
                onPress={() => navigation.navigate('Register')}
                style={{justifyContent: 'center', alignItems: 'center'}}
              />
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
}

export default Login