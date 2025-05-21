// components/BottomSpacer.tsx
import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';

const BottomSpacer = () => {
  return <View style={styles.spacer} />;
};

export default BottomSpacer;

const styles = StyleSheet.create({
  spacer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80, // height of spacer
    backgroundColor: '#fff',
    zIndex: 10,
    ...(Platform.OS === 'ios' && {
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: -2 },
      shadowRadius: 6,
    }),
    ...(Platform.OS === 'android' && {
      elevation: 6,
    }),
  },
});
