import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DynamicProfile from '../screens/DynamicProfile';

const Stack = createNativeStackNavigator();

const RenterStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DynamicProfile" component={DynamicProfile} />
    </Stack.Navigator>
  );
};

export default RenterStackNavigator;
