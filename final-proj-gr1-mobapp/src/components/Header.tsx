import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

interface HeaderProps {
  navigation?: any;
  back?: boolean;
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ navigation, back = false, title = 'HEMA Online Rental' }) => {
  return (
    <View style={styles.header}>
      {back && (
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="white" />
        </Pressable>
      )}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1B1F23',
    height: 60,
    paddingHorizontal: 15,
    justifyContent: 'center',
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  backButton: {
    position: 'absolute',
    left: 15,
  },
});