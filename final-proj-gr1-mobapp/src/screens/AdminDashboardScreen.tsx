import React, { useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { useGlobalContext } from '../context/globalContext';
import { useNavigation } from '@react-navigation/native';

const AdminDashboardScreen = () => {
  const { currentUser } = useGlobalContext();
  const navigation = useNavigation();

  useEffect(() => {
    if (currentUser?.role !== 'admin') {
      Alert.alert('Access Denied', 'You do not have permission to view this page.');
      navigation.goBack(); // Or redirect to renter/shopkeeper dashboard
    }
  }, [currentUser]);

  return (
    <View>
      <Text>Welcome, Admin!</Text>
    </View>
  );
};

export default AdminDashboardScreen;