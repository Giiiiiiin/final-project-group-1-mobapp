import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ShopkeeperDashboardScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shopkeeper Dashboard</Text>
      <Text>Manage your gear listings and rentals.</Text>
    </View>
  );
};

export default ShopkeeperDashboardScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
});