import React from 'react';
import { TextInput, StyleSheet, TextInputProps, ViewStyle } from 'react-native';

interface InputProp {
   placeholder: string;
   style?: ViewStyle;
   onChangeText: (text: string) => void;
   value: string | undefined;
   secureTextEntry?: boolean;
   editable?: boolean;
}

const Input: React.FC<InputProp> = ({
   placeholder,
   style,
   onChangeText,
   value,
   secureTextEntry = false,
   editable = true,
}) => {
   return (
      <TextInput
         style={[styles.input, style]}
         placeholder={placeholder}
         onChangeText={onChangeText}
         value={value}
         secureTextEntry={secureTextEntry}
         editable={editable}
         placeholderTextColor="#aaa"
      />
   );
}

const styles = StyleSheet.create({
   input: {
      height: 50,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 12,
      marginVertical: 8,
      fontSize: 16,
      fontFamily: 'Montserrat-VariableFont',
   },
});

export default Input;