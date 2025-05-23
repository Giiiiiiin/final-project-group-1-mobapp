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
        header: !isLoggedIn ? (props) => <Header {...props} navigation={navigation} /> : undefined,
        headerShown: !isLoggedIn,
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