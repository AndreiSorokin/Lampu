import React from 'react';
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent, ViewStyle } from 'react-native';

interface CustomButtonProps {
   title: string;
   onPress: (event: GestureResponderEvent) => void;
   style?: ViewStyle;
   textStyle?: object;
   disabled?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
   title,
   onPress,
   style,
   textStyle,
   disabled = false,
}) => {
   return (
      <TouchableOpacity
         onPress={onPress}
         style={[styles.button, style, disabled && styles.disabled]}
         disabled={disabled}
      >
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
      </TouchableOpacity>
   );
};

const styles = StyleSheet.create({
   button: {
      backgroundColor: '#FF9A42',
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 50,
      alignItems: 'flex-start',
      justifyContent: 'center',
      marginVertical: 10,
      width: 300,
      height: 80
   },
   buttonText: {
      fontFamily: 'Montserrat-VariableFont',
      color: '#131212',
      fontWeight: 'bold',
      fontSize: 18,
   },
   disabled: {
      backgroundColor: '#a0a0a0',
   },
});

export default CustomButton;