import React, { useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { useGlobalContext } from '../context/globalContext';
import { useNavigation } from '@react-navigation/native';

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
    <View>
      <Text>Welcome, Renter!</Text>
    </View>
  );
};

export default RenterDashboardScreen;