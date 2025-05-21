import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DynamicProfile from '../screens/DynamicProfile';

const Stack = createNativeStackNavigator();

const ShopkeeperStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DynamicProfile" component={DynamicProfile} />
      {/* Add more shopkeeper-specific screens here as needed */}
    </Stack.Navigator>
  );
};

export default ShopkeeperStackNavigator;
