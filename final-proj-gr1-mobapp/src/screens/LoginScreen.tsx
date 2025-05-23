import React, { useState } from 'react';
import {
  View,
  TextInput,
  Pressable,
  Text,
  StyleSheet,
} from 'react-native';
import { useGlobalContext } from '../context/globalContext';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';

const LoginScreen = () => {
  const { loginUser, setIsLoggedIn } = useGlobalContext();
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      showMessage({
        message: 'Missing Fields',
        description: 'Please enter both email and password.',
        type: 'warning',
      });
      return;
    }

    setIsLoading(true);

    const success = loginUser(trimmedEmail, trimmedPassword);

    if (success) {
      setIsLoggedIn(true);
      showMessage({
        message: 'Login Successful!',
        description: 'Welcome back!',
        type: 'success',
      });
    } else {
      showMessage({
        message: 'Login Failed',
        description: 'Invalid email or password.',
        type: 'danger',
      });
    }

    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <Pressable
        style={[styles.button, { backgroundColor: '#1B1F23' }]}
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Logging In...' : 'Login'}
        </Text>
      </Pressable>

      <Pressable
        style={[
          styles.button,
          { backgroundColor: 'transparent', borderColor: '#1B1F23', borderWidth: 1 },
        ]}
        onPress={() => navigation.navigate('SignIn')}
        disabled={isLoading}
      >
        <Text style={{ color: '#1B1F23' }}>No account? Sign Up</Text>
      </Pressable>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginVertical: 10,
    borderRadius: 5,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});