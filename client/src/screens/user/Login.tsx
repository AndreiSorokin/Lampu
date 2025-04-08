import React from 'react'
import { View, Text, Button, TextInput, StyleSheet } from 'react-native'
import { LoginFormData, loginSchema } from '../../navigation/zod/zod.schemas';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Formik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';

const Login = ({ navigation }) => {
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

  const handleSubmit = async (values: LoginFormData) => {
    try {
      const response = await axios.post('http://192.168.1.134:3000/auth/login', values);
      const { token, user } = response.data;
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(user));
      navigation.replace('Home');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Formik
        initialValues={initialValues}
        validationSchema={toFormikValidationSchema(loginSchema)}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View>
            <TextInput
              style={styles.input}
              placeholder="Email"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              autoCapitalize="none"
            />
            {touched.email && errors.email && (
              <Text style={styles.error}>{errors.email}</Text>
            )}

            <TextInput
              style={styles.input}
              placeholder="Password"
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              secureTextEntry
            />
            {touched.password && errors.password && (
              <Text style={styles.error}>{errors.password}</Text>
            )}

            <Button title="Login" onPress={() => handleSubmit()} />
          </View>
        )}
      </Formik>
    </View>
  );
}

export default Login