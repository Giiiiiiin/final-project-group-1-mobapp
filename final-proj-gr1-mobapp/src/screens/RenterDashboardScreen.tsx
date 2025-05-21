import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

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
      <Text style={styles.title}>Renter Dashboard</Text>
      <Text>Browse gear, view bookings, and manage your profile.</Text>
    </View>
  );
};

export default RenterDashboardScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
});