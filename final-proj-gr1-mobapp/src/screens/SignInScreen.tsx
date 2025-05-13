import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Pressable } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useGlobalContext } from '../context/globalContext';

const SignInScreen = () => {
  const { setRole, setIsLoggedIn, theme } = useGlobalContext();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('renter');

  const handleSignUp = () => {
    if (email && password && selectedRole) {
      setRole(selectedRole);
      setIsLoggedIn(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />
      <Text>Select Role:</Text>
      <Picker selectedValue={selectedRole} onValueChange={setSelectedRole} style={styles.picker}>
        <Picker.Item label="Renter" value="renter" />
        <Picker.Item label="Shopkeeper" value="shopkeeper" />
        <Picker.Item label="Admin" value="admin" />
      </Picker>

      <Pressable style={[styles.button, { backgroundColor: theme.primary }]} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </Pressable>
    </View>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 5 },
  picker: { marginVertical: 10 },
  button: {
    backgroundColor: '#4B3E2E',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: { color: '#FFF', fontWeight: 'bold' },
});
