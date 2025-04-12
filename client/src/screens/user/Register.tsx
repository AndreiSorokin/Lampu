import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { createUserWithEmailAndPassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import React, { useState } from 'react'
import { auth } from 'src/utils/firebaseConfig';
import { StackNavigationProp } from '@react-navigation/stack';
import { RegisterFormData, registerSchema } from 'src/zod/zod.schemas';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { RootStackParamList } from 'src/navigation/AppNavigator';
import { UserRole } from 'src/types/users';

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

const Register = ({ navigation }: { navigation: RegisterScreenNavigationProp }) => {
  const initialValues: RegisterFormData = {
    email: '',
    password: '',
    name: '',
    dateOfBirth: '',
    instagram: '',
    telegram: '',
  };

  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleSubmit = async (
    values: RegisterFormData,
    { setSubmitting, setErrors }: { setSubmitting: (isSubmitting: boolean) => void; setErrors: (errors: any) => void }
  ) => {
    setGeneralError(null)
    try {
    const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
    const user = userCredential.user;
    const token = await user.getIdToken();

    const userData = {
      firebaseUid: user.uid,
      email: values.email,
      password: values.password,
      name: values.name || null,
      dateOfBirth:values.dateOfBirth,
      instagram: values.instagram || null,
      telegram: values.telegram || null,
      role: UserRole.USER,
    };

    await axios.post('http://192.168.1.134:3000/users', userData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    await AsyncStorage.setItem('userToken', token);
    await AsyncStorage.setItem('userData', JSON.stringify({ uid: user.uid, email: user.email }));
    
    } catch (error: any) {
      const currentUser = auth.currentUser;

      if (currentUser && values.email && values.password) {
        try {
          const credential = EmailAuthProvider.credential(
            values.email,
            values.password
          );
        
          await reauthenticateWithCredential(currentUser, credential);
          await currentUser.delete();
        } catch (deleteError) {
          console.error('Error deleting Firebase user:', deleteError);
        }
      }
      console.error('Error during registration:', error);
      if (error.code === 'auth/email-already-in-use') {
        setErrors({ email: 'This email is already registered' });
      } else if (error.code === 'auth/invalid-email') {
        setErrors({ email: 'Invalid email format' });
      } else if (error.code === 'auth/weak-password') {
        setErrors({ password: 'Password is too weak' });
      } else if (error.response?.data) {
        setErrors({ general: error.response.data.message || 'Registration failed' });
      } else {
        setErrors({ general: 'An unexpected error occurred' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <Formik
        initialValues={initialValues}
        validationSchema={toFormikValidationSchema(registerSchema)}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
          <View>
            {generalError && <Text style={styles.error}>{generalError}</Text>}
            <TextInput
              style={styles.input}
              placeholder="Email"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              autoCapitalize="none"
              editable={!isSubmitting}
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
              editable={!isSubmitting}
            />
            {touched.password && errors.password && (
              <Text style={styles.error}>{errors.password}</Text>
            )}
            <TextInput
              style={styles.input}
              placeholder="Name (optional)"
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
              editable={!isSubmitting}
            />
            {touched.name && errors.name && (
              <Text style={styles.error}>{errors.name}</Text>
            )}
            <TextInput
              style={styles.input}
              placeholder="Date of Birth (YYYY-MM-DD, optional)"
              onChangeText={handleChange('dateOfBirth')}
              onBlur={handleBlur('dateOfBirth')}
              value={values.dateOfBirth}
              editable={!isSubmitting}
            />
            {touched.dateOfBirth && errors.dateOfBirth && (
              <Text style={styles.error}>{errors.dateOfBirth}</Text>
            )}
            <TextInput
              style={styles.input}
              placeholder="Instagram (optional)"
              onChangeText={handleChange('instagram')}
              onBlur={handleBlur('instagram')}
              value={values.instagram}
              editable={!isSubmitting}
            />
            {touched.instagram && errors.instagram && (
              <Text style={styles.error}>{errors.instagram}</Text>
            )}
            <TextInput
              style={styles.input}
              placeholder="Telegram (optional)"
              onChangeText={handleChange('telegram')}
              onBlur={handleBlur('telegram')}
              value={values.telegram}
              editable={!isSubmitting}
            />
            {touched.telegram && errors.telegram && (
              <Text style={styles.error}>{errors.telegram}</Text>
            )}
            <Button
              title={isSubmitting ? 'Registering...' : 'Register'}
              onPress={() => handleSubmit()}
              disabled={isSubmitting || !!Object.keys(errors).length}
            />
            <Button
              title="Already have an account? Login"
              onPress={() => navigation.navigate('Login')}
              disabled={isSubmitting}
            />
          </View>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
   container: { flex: 1, justifyContent: 'center', padding: 20 },
   title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
   input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
   error: { color: 'red', marginBottom: 10 },
});

export default Register
