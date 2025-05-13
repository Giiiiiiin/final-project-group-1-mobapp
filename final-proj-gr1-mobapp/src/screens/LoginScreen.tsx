import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { useGlobalContext } from '../context/globalContext';

const LoginScreen = ({ navigation }) => {
  const { setIsLoggedIn, setRole } = useGlobalContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Mock login
    if (email && password) {
      // Set role based on dummy data (normally fetched from DB)
      const mockRole = email.includes('admin')
        ? 'admin'
        : email.includes('shop')
        ? 'shopkeeper'
        : 'renter';

      setRole(mockRole);
      setIsLoggedIn(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />
      <Button title="Login" onPress={handleLogin} />
      <Button title="No account? Sign Up" onPress={() => navigation.navigate('SignIn')} />
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 5 },
});
