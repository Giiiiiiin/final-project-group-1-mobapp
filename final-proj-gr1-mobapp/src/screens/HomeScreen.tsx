import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useGlobalContext } from '../context/globalContext';

const HomeScreen = () => {
  const { role, setIsLoggedIn } = useGlobalContext();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome, {role?.toUpperCase()}</Text>
      <Button title="Logout" onPress={() => setIsLoggedIn(false)} />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20, marginBottom: 20 },
});
