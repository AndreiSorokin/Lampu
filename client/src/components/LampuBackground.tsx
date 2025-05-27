// components/LampuBackground.tsx
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Dimensions } from 'react-native';
import LampuIcon from '../../assets/images/Lampu.svg';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle; // optional style for wrapper
}

const LampuBackground: React.FC<Props> = ({ children, style }) => {
  return (
    <View style={[styles.container, style]}>
      <LampuIcon width={300} height={150} style={styles.lampu} />
      {children}
    </View>
  );
};
const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lampu: {
    position: 'absolute',
    top: height * 0.1,
    left: width * 0.15  
   },
});

export default LampuBackground;
