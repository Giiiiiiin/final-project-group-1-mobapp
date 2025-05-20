import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from 'react-native';

import { useGlobalContext } from '../context/globalContext';
import { useNavigation } from '@react-navigation/native';

type RoleFilter = 'shopkeeper' | 'renter' | null;

const ManageAccountsScreen = () => {
  const { users } = useGlobalContext();
  const navigation = useNavigation();
  const [selectedRole, setSelectedRole] = useState<RoleFilter>(null);

  const filteredUsers = selectedRole
    ? users.filter((user) => user.role === selectedRole)
    : [];

  return (
    <SafeAreaView style={styles.container}>
      {!selectedRole ? (
        <>
          <Text style={styles.header}>Manage Accounts</Text>
          <Pressable
            style={[styles.button, styles.adminButton]}
            onPress={() => navigation.navigate('DynamicProfile')}
          >
            <Text style={styles.buttonText}>Admin Profile</Text>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={() => setSelectedRole('shopkeeper')}
          >
            <Text style={styles.buttonText}>Shopkeepers List</Text>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={() => setSelectedRole('renter')}
          >
            <Text style={styles.buttonText}>Renters List</Text>
          </Pressable>
        </>
      ) : (
        <>
          <Text style={styles.header}>
            {selectedRole === 'shopkeeper' ? 'Shopkeepers' : 'Renters'} List
          </Text>
          <Pressable
            style={[styles.button, styles.backButton]}
            onPress={() => setSelectedRole(null)}
          >
            <Text style={styles.buttonText}>Back</Text>
          </Pressable>

          <FlatList
            data={filteredUsers}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.userCard}>
                <Text>Email: {item.email}</Text>
                <Text>Role: {item.role}</Text>
              </View>
            )}
          />
        </>
      )}
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
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#1B1F23',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#999',
  },
  adminButton: {
    backgroundColor: '#3D8BFF', 
  },
  userCard: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 6,
    marginVertical: 6,
  },
});