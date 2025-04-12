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
      borderRadius: 8,
      alignItems: 'center',
      marginVertical: 10,
   },
   buttonText: {
      color: '#fff',
      fontWeight: 'bold',
   },
   disabled: {
      backgroundColor: '#a0a0a0',
   },
});

export default CustomButton;