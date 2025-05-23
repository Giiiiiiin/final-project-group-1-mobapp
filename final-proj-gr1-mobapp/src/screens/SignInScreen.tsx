import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useGlobalContext } from '../context/globalContext';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';

type Role = 'renter' | 'shopkeeper';

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const SignInScreen = () => {
  const { registerUser, users } = useGlobalContext();
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role>('renter');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = () => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      showMessage({
        message: 'Missing Fields',
        description: 'Please fill out all fields.',
        type: 'warning',
      });
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      showMessage({
        message: 'Invalid Email',
        description: 'Please enter a valid email address.',
        type: 'danger',
      });
      return;
    }

    const emailExists = users.some(
      (user) => user.email.trim().toLowerCase() === trimmedEmail.toLowerCase()
    );

    if (emailExists) {
      showMessage({
        message: 'Email Already Exists',
        description: 'This email is already registered.',
        type: 'danger',
      });
      return;
    }

    if (trimmedPassword.length < 6) {
      showMessage({
        message: 'Weak Password',
        description: 'Password must be at least 6 characters long.',
        type: 'danger',
      });
      return;
    }

    setIsLoading(true);

    registerUser(trimmedEmail, trimmedPassword, selectedRole);

    showMessage({
      message: 'Account Created Successfully!',
      description: 'You can now log in with your credentials.',
      type: 'success',
    });

    setIsLoading(false);
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
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
      <Text>Select Role:</Text>
      <Picker
        selectedValue={selectedRole}
        onValueChange={(itemValue) => setSelectedRole(itemValue as Role)}
        style={styles.picker}
      >
        <Picker.Item label="Renter" value="renter" />
        <Picker.Item label="Shopkeeper" value="shopkeeper" />
      </Picker>

      <Pressable
        style={[styles.button, { backgroundColor: '#1B1F23' }]}
        onPress={handleSignUp}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>{isLoading ? 'Creating Account...' : 'Sign Up'}</Text>
      </Pressable>
    </View>
  );
};

export default SignInScreen;

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
  picker: {
    marginVertical: 10,
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