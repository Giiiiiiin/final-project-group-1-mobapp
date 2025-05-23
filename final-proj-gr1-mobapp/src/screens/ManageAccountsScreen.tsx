import React from 'react';
import { Text, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ManageAccountsScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <Pressable
        style={[styles.button, styles.adminButton]}
        onPress={() => navigation.navigate('DynamicProfile')}
      >
        <Text style={styles.buttonText}>Admin Profile</Text>
      </Pressable>
      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate('ShopkeepersList')}
      >
        <Text style={styles.buttonText}>Shopkeepers List</Text>
      </Pressable>
      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate('RentersList')}
      >
        <Text style={styles.buttonText}>Renters List</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default ManageAccountsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#1B1F23',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  adminButton: {
    backgroundColor: '#3D8BFF',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
