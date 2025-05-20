import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import SignInScreen from '../screens/SignInScreen';
import RoleBasedDrawerNavigator from '../navigation/RoleBasedDrawerNavigator';
import Header from '../components/Header';
import { useGlobalContext } from '../context/globalContext';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  const { isLoggedIn } = useGlobalContext();

  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        // Only show the custom header if NOT logged in
        header: !isLoggedIn ? (props) => <Header {...props} navigation={navigation} /> : undefined,
        headerShown: !isLoggedIn, // Hide default header if not logged in
      })}
    >
      {!isLoggedIn ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignIn" component={SignInScreen} />
        </>
      ) : (
        <Stack.Screen
          name="Home"
          component={RoleBasedDrawerNavigator}
          options={{
            headerTitle: 'Hema & Kendo Gear',
          }}
        />
      )}
    </Stack.Navigator>
  );
};