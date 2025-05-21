import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, FlatList, StyleSheet, TextInput, Image, Dimensions, Alert } from 'react-native';
import { useGlobalContext } from '../context/globalContext';
import { useNavigation } from '@react-navigation/native';

// Interface for rental duration
interface Duration {
  months: number;
  days: number;
  hours: number;
}

// Interface for rented gear
interface RentedGear {
  id: string;
  gearName: string;
  rentalPlan: 'Weekly' | 'Monthly' | 'Yearly';
  duration: Duration;
  price: string;
  image: string;
}

// Interface for available gear
interface AvailableGear {
  id: string;
  name: string;
  description: string;
  plans: { type: 'Weekly' | 'Monthly' | 'Yearly'; price: string }[];
  image: string;
  status: string;
}

// Dummy data for rented equipment
const rentedEquipment: RentedGear[] = [
  {
    id: '1',
    gearName: 'Item 1',
    rentalPlan: 'Monthly',
    duration: { months: 0, days: 12, hours: 6 },
    price: '$75',
    image: 'https://i201.photobucket.com/albums/aa288/reversethieves/show%20images/Type%20Moon/Unlimited%20Blade%20Works/UBW%2024%20D_1.jpg~original',
  },
  {
    id: '2',
    gearName: 'Item 2',
    rentalPlan: 'Weekly',
    duration: { months: 0, days: 6, hours: 0 },
    price: '$30',
    image: 'https://i201.photobucket.com/albums/aa288/reversethieves/show%20images/Type%20Moon/Unlimited%20Blade%20Works/UBW%2024%20D_1.jpg~original',
  },
  {
    id: '3',
    gearName: 'Item 3',
    rentalPlan: 'Yearly',
    duration: { months: 11, days: 28, hours: 12 },
    price: '$110',
    image: 'https://i201.photobucket.com/albums/aa288/reversethieves/show%20images/Type%20Moon/Unlimited%20Blade%20Works/UBW%2024%20D_1.jpg~original',
  },
];

// Dummy data for available equipment
const availableEquipment: AvailableGear[] = [
  {
    id: '4',
    name: 'Arming Sword',
    description: 'A classic European sword for HEMA practice.',
    plans: [
      { type: 'Weekly', price: '$50' },
      { type: 'Monthly', price: '$180' },
      { type: 'Yearly', price: '$1800' },
    ],
    image: 'https://i201.photobucket.com/albums/aa288/reversethieves/show%20images/Type%20Moon/Unlimited%20Blade%20Works/UBW%2024%20D_1.jpg~original',
    status: 'Available',
  },
  {
    id: '5',
    name: 'Kendo Mask',
    description: 'Protective mask for Kendo training.',
    plans: [
      { type: 'Weekly', price: '$30' },
      { type: 'Monthly', price: '$100' },
      { type: 'Yearly', price: '$1000' },
    ],
    image: 'https://i201.photobucket.com/albums/aa288/reversethieves/show%20images/Type%20Moon/Unlimited%20Blade%20Works/UBW%2024%20D_1.jpg~original',
    status: 'Rented out until 2023-12-10',
  },
];

// Calculate card width for consistent two-column layout
const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth - 30) / 2;

// Format duration string
const formatDuration = ({ months, days, hours }: Duration): string => {
  return `${months} month${months !== 1 ? 's' : ''} - ${days} day${days !== 1 ? 's' : ''} - ${hours} hour${hours !== 1 ? 's' : ''}`;
};

const RenterDashboardScreen = () => {
  const { currentUser } = useGlobalContext();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');

  // Restrict access to renters only
  useEffect(() => {
    if (currentUser?.role !== 'renter') {
      Alert.alert('Access Denied', 'You do not have permission to view this page.');
      navigation.goBack();
    }
  }, [currentUser]);

  // Filter available equipment based on search query
  const filteredEquipment = availableEquipment.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Welcome, Renter!</Text>

      {/* Search Bar for Available Equipment */}
      <TextInput
        placeholder="Search equipment..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchBar}
      />

      {/* Available Equipment Section */}
      <Text style={styles.subtitle}>Available Equipment</Text>
      <FlatList
        data={filteredEquipment}
        keyExtractor={item => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <View style={[styles.card, { width: cardWidth }]}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.cardDetails}>
              <Text style={styles.gearName}>{item.name}</Text>
              <Text style={styles.detail}>Status: {item.status}</Text>
              <Text style={styles.detail}>From {item.plans[0].price}/{item.plans[0].type.toLowerCase()}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContainer}
      />

      {/* Current Rentals Section */}
      <Text style={styles.subtitle}>Your Current Rentals</Text>
      <FlatList
        data={rentedEquipment}
        keyExtractor={item => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <View style={[styles.card, { width: cardWidth }]}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.cardDetails}>
              <Text style={styles.gearName}>{item.gearName}</Text>
              <Text style={styles.detail}>Plan: {item.rentalPlan}</Text>
              <Text style={styles.detail}>Duration: {formatDuration(item.duration)}</Text>
              <Text style={styles.detail}>Price: {item.price}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContainer}
      />
    </ScrollView>
  );
};

export default RenterDashboardScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  searchBar: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'left',
  },
  listContainer: {
    gap: 10,
  },
  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    margin: 5,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  cardDetails: {
    padding: 10,
  },
  gearName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  detail: {
    fontSize: 12,
  },
});