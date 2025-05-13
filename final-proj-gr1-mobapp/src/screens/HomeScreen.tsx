import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useGlobalContext } from '../context/globalContext';

const HomeScreen = () => {
    const { role, setIsLoggedIn, theme } = useGlobalContext();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome, {role?.toUpperCase()}</Text>
      <Pressable style={[styles.button, { backgroundColor: theme.primary }]} onPress={() => setIsLoggedIn(false)}>
        <Text style={styles.buttonText}>Logout</Text>
      </Pressable>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20, marginBottom: 20 },
  button: {
    backgroundColor: '#4B3E2E',
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});
