import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Alert, FlatList, Image, Dimensions } from 'react-native';
import { useGlobalContext } from '../context/globalContext';
import { useNavigation } from '@react-navigation/native';

interface Duration {
  months: number;
  days: number;
  hours: number;
}

interface RentedGear {  // additional details may be added
  id: string;
  gearName: string;
  rentalPlan: 'Weekly' | 'Monthly' | 'Yearly';
  duration: Duration;
  price: string;
  image: string;
}

const rentedEquipment: RentedGear[] = [ // sample items for now
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
     image: 'https://i201.photobucket.com/albums/aa288/reversethieves/show%20images/Type%20Moon/Unlimited%20Blade%20Works/UBW%2024%20D_1.jpg~original',
    price: '$110',
  },
];

// keeps spacing for cards consistent (it's prettier now)
const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth - 30) / 2; 

const formatDuration = ({ months, days, hours }: Duration): string => { //evil ass formatting structure (placeholder for now)
  return `${months} month${months !== 1 ? 's' : ''} - ${days} day${days !== 1 ? 's' : ''} - ${hours} hour${hours !== 1 ? 's' : ''}`;
};

const RenterDashboardScreen = () => {
  const { currentUser } = useGlobalContext();
  const navigation = useNavigation();

  useEffect(() => {
    if (currentUser?.role !== 'renter') {
      Alert.alert('Access Denied', 'You do not have permission to view this page.');
      navigation.goBack(); 
    }
  }, [currentUser]);


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, Renter!</Text>
      <Text style={styles.subtitle}>Your Current Rentals:</Text>
      <FlatList
        numColumns={2}
        data={rentedEquipment}
        keyExtractor={(item) => item.id}
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
    </View>
  );
};

export default RenterDashboardScreen;

const styles = StyleSheet.create({  // considering whether or not to shift these to global contexts
  container: {
    flex: 1,
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
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
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