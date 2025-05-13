import React from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { useGlobalContext } from '../context/globalContext';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const { currentUser, setIsLoggedIn, theme } = useGlobalContext();
  const navigation = useNavigation();

  if (!currentUser) {
    // This should not happen unless context is broken
    Alert.alert('Error', 'User not found. Please log in again.');
    setIsLoggedIn(false);
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    return null;
  }

  const { role, email } = currentUser;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.text, { color: theme.text }]}>Welcome, {role.toUpperCase()}</Text>
      <Text style={{ color: theme.textSecondary, marginBottom: 20 }}>Logged in as: {email}</Text>
      <Pressable
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={() => setIsLoggedIn(false)}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </Pressable>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    marginBottom: 10,
  },
  button: {
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});