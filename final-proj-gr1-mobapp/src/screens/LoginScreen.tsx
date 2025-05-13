import React, { useState } from 'react';
import { View, TextInput, Pressable, Text, StyleSheet } from 'react-native';
import { useGlobalContext } from '../context/globalContext';

const LoginScreen = ({ navigation }) => {
  const { setIsLoggedIn, setRole, theme } = useGlobalContext();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (email && password) {
      const userRole = email.includes('admin')
        ? 'admin'
        : email.includes('shop')
        ? 'shopkeeper'
        : 'renter';

      setRole(userRole);
      setIsLoggedIn(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />

      <Pressable style={[styles.button, { backgroundColor: theme.primary }]} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>

      <Pressable
        style={[
          styles.button,
          { backgroundColor: 'transparent', borderColor: theme.primary, borderWidth: 1 },
        ]}
        onPress={() => navigation.navigate('SignIn')}
      >
        <Text style={[styles.buttonText, { color: theme.primary }]}>No account? Sign Up</Text>
      </Pressable>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 5 },
  button: {
    backgroundColor: theme.primary,
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: { color: '#FFF', fontWeight: 'bold' },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.primary,
  },
  outlineButtonText: {
    color: theme.primary,
  },
});
