import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput } from 'react-native';
import { useGlobalContextientas } from '../context/globalContext';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';

const RenterDashboardScreen = () => {
  const { currentUser } = useGlobalContext();
  const navigation = useNavigation();

  // Role-based access check
  useEffect(() => {
    if (currentUser?.role !== 'renter') {
      Alert.alert('Access Denied', 'You do not have permission to view this page.');
      navigation.goBack();
    }
  }, [currentUser]);

  // Dummy data for available equipment
  const availableEquipment = [
    {
      id: '1',
      name: 'Arming Sword',
      plans: [
        { type: 'weekly', price: '500' },
        { type: 'monthly', price: '1800' },
        { type: 'yearly', price: '18000' },
      ],
      description: 'A classic European sword for HEMA practice.',
      status: 'Available',
    },
    {
      id: '2',
      name: 'Kendo Mask',
      plans: [
        { type: 'weekly', price: '300' },
        { type: 'monthly', price: '1000' },
        { type: 'yearly', price: '10000' },
      ],
      description: 'Protective mask for Kendo training.',
      status: 'Rented out until 2023-12-10',
    },
    {
      id: '3',
      name: 'Full-Contact Armor',
      plans: [
        { type: 'weekly', price: '800' },
        { type: 'monthly', price: '2800' },
        { type: 'yearly', price: '28000' },
      ],
      description: 'Heavy-duty armor for full-contact sparring.',
      status: 'Available',
    },
  ];

  // Dummy data for renter's current rentals
  const myRentals = [
    {
      id: '2',
      name: 'Kendo Mask',
      plan: 'weekly',
      rentalStart: '2023-11-01',
      returnDate: '2023-11-08',
      status: 'Due in 2 days',
    },
    {
      id: '1',
      name: 'Arming Sword',
      plan: 'monthly',
      rentalStart: '2023-11-15',
      returnDate: '2023-12-15',
      status: 'On time',
    },
  ];

  // State for search functionality
  const [searchQuery, setSearchQuery] = useState('');
  const filteredEquipment = availableEquipment.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Render equipment item
  const renderEquipmentItem = ({ item }) => (
    <View style={styles.equipmentCard}>
      <Text style={styles.equipmentName}>{item.name}</Text>
      <Text style={styles.equipmentDescription}>{item.description}</Text>
      <Text style={styles.equipmentStatus}>Status: {item.status}</Text>
      <Text style={styles.plansTitle}>Available Plans:</Text>
      {item.plans.map((plan, index) => (
        <Text key={index} style={styles.planText}>
          - {plan.type.charAt(0).toUpperCase() + plan.type.slice(1)}: ₱{plan.price}
        </Text>
      ))}
    </View>
  );

  // Render rental item
  const renderRentalItem = ({ item }) => (
    <View style={styles.rentalCard}>
      <Text style={styles.rentalName}>{item.name}</Text>
      <Text>Plan: {item.plan}</Text>
      <Text>Rental Start: {item.rentalStart}</Text>
      <Text>Return Date: {item.returnDate}</Text>
      <Text style={styles.rentalStatus}>Status: {item.status}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Welcome, Renter!</Text>

      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search equipment..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Available Equipment Section */}
      <Text style={styles.sectionTitle}>Browse Equipment</Text>
      <FlatList
        data={filteredEquipment}
        keyExtractor={item => item.id}
        renderItem={renderEquipmentItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No equipment found.</Text>}
      />

      {/* My Rentals Section */}
      <Text style={styles.sectionTitle}>My Rentals</Text>
      <FlatList
        data={myRentals}
        keyExtractor={item => item.id}
        renderItem={renderRentalItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No current rentals.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  searchBar: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
  },
  equipmentCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  equipmentName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  equipmentDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  equipmentStatus: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  plansTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 5,
  },
  planText: {
    fontSize: 14,
    color: '#4CAF50',
  },
  rentalCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  rentalName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  rentalStatus: {
    fontSize: 14,
    color: '#D32F2F',
    marginTop: 5,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default RenterDashboardScreen;