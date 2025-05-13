import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AdminDashboardScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>
      <Text>Manage users, inventory, and rental plans.</Text>
    </View>
  );
};

export default AdminDashboardScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
});