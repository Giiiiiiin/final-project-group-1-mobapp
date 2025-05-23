import React from 'react';
import {
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useGlobalContext } from '../context/globalContext';
import { useNavigation } from '@react-navigation/native';
import BottomSpacer from '../components/BottomSpacer';

const RentersList = () => {
  const { users } = useGlobalContext();
  const renters = users.filter(user => user.role === 'renter');
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Back</Text>
      </Pressable>
      <Text style={styles.header}>Renters List</Text>
      <FlatList
        data={renters}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => navigation.navigate('InspectRenter', { user: item })}
            style={styles.userCard}
          >
            <Text style={styles.userEmail}>{item.email}</Text>
            <Text style={styles.userRoleBadge}>{item.role}</Text>
          </Pressable>
        )}
      />
      <BottomSpacer />
    </SafeAreaView>
  );
};

export default RentersList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    paddingBottom: 80,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  backButton: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#ddd',
    borderRadius: 6,
    alignItems: 'center',
    width: '100%',
  },
  backButtonText: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: 16,
  },
  userCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  userEmail: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  userRoleBadge: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#666',
  },
});