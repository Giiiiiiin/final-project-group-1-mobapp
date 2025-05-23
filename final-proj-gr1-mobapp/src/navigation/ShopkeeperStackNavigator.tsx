import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ShopkeeperDashboardScreen from '../screens/ShopkeeperDashboardScreen';
import AddEquipmentScreen from '../screens/AddEquipmentScreen';
import UpdateEquipmentScreen from '../screens/UpdateEquipmentScreen';
import DynamicProfile from '../screens/DynamicProfile';

const Stack = createNativeStackNavigator();

const ShopkeeperStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ShopkeeperDashboard" component={ShopkeeperDashboardScreen} />
      <Stack.Screen name="AddEquipment" component={AddEquipmentScreen} />
      <Stack.Screen name="UpdateEquipment" component={UpdateEquipmentScreen} />
      <Stack.Screen name="DynamicProfile" component={DynamicProfile} />
    </Stack.Navigator>
  );
};

export default ShopkeeperStackNavigator;
