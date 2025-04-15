import React from 'react';
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent, ViewStyle } from 'react-native';

interface CustomButtonDarkProps {
   title: string;
   onPress: (event: GestureResponderEvent) => void;
   style?: ViewStyle;
   textStyle?: object;
   disabled?: boolean;
}

const CustomButtonDark: React.FC<CustomButtonDarkProps> = ({
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
      backgroundColor: '#FF8011',
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
      color: '#FFF6E5',
      fontWeight: 'bold',
      fontSize: 18,
   },
   disabled: {
      backgroundColor: '#a0a0a0',
   },
});

export default CustomButtonDark;