import React from 'react'
import { View, Text, Button, TextInput, StyleSheet } from 'react-native'
import { LoginFormData, loginSchema } from '../../zod/zod.schemas';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Formik } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../utils/firebaseConfig';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import Input from 'src/components/Input';
import CustomButton from 'src/components/CustomButton';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const Login = ({ navigation }: { navigation: LoginScreenNavigationProp }) => {
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
            <Input
              placeholder="Email"
              value={values.email}
              onChangeText={handleChange('email')}
            />
            {touched.email && errors.email && (
              <Text style={styles.error}>{errors.email}</Text>
            )}

            <Input
              style={styles.input}
              placeholder="Password"
              onChangeText={handleChange('password')}
              value={values.password}
              secureTextEntry
            />
            {touched.password && errors.password && (
              <Text style={styles.error}>{errors.password}</Text>
            )}

            <CustomButton 
              title="Login" 
              onPress={() => handleSubmit()}
              style={{justifyContent: 'center', alignItems: 'center'}}
            />
            <CustomButton
              title="Need an account? Register"
              onPress={() => navigation.navigate('Register')}
              style={{justifyContent: 'center', alignItems: 'center'}}
            />
          </View>
        )}
      </Formik>
    </View>
  );
}

export default Login