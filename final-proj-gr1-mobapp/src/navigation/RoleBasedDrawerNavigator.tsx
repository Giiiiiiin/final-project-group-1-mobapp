// RoleBasedDrawerNavigator.tsx
import React from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import ShopkeeperDashboardScreen from '../screens/ShopkeeperDashboardScreen';
import RenterDashboardScreen from '../screens/RenterDashboardScreen';
import { useGlobalContext } from '../context/globalContext';
import { showMessage } from 'react-native-flash-message';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  const { setIsLoggedIn } = useGlobalContext();

  const handleLogout = () => {
    setIsLoggedIn(false);
    props.navigation.closeDrawer();
    showMessage({
      message: 'Logged Out',
      description: 'You have been successfully logged out.',
      type: 'info',
    });
  };

  return (
    <DrawerContentScrollView {...props}>
      {/* Conditionally render screens based on current route names */}
      {props.state.routeNames.includes('AdminDashboard') && (
        <DrawerItem
          label="Admin Dashboard"
          onPress={() => props.navigation.navigate('AdminDashboard')}
        />
      )}

      {props.state.routeNames.includes('ShopkeeperDashboard') && (
        <DrawerItem
          label="Shopkeeper Dashboard"
          onPress={() => props.navigation.navigate('ShopkeeperDashboard')}
        />
      )}

      <DrawerItem
        label="Renter Dashboard"
        onPress={() => props.navigation.navigate('RenterDashboard')}
      />

      {/* Logout Button */}
      <DrawerItem
        label="Logout"
        onPress={handleLogout}
        labelStyle={{ color: 'red', fontWeight: 'bold' }}
      />
    </DrawerContentScrollView>
  );
};

const RoleBasedDrawerNavigator = () => {
  const { role } = useGlobalContext();

  return (
    <Drawer.Navigator
      initialRouteName={
        role === 'admin'
          ? 'AdminDashboard'
          : role === 'shopkeeper'
          ? 'ShopkeeperDashboard'
          : 'RenterDashboard'
      }
      screenOptions={{ headerShown: false }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      {role === 'admin' && (
        <Drawer.Screen name="AdminDashboard" component={AdminDashboardScreen} options={{ title: 'Admin Dashboard' }} />
      )}

      {(role === 'admin' || role === 'shopkeeper') && (
        <Drawer.Screen name="ShopkeeperDashboard" component={ShopkeeperDashboardScreen} options={{ title: 'Shopkeeper Dashboard' }} />
      )}

      <Drawer.Screen name="RenterDashboard" component={RenterDashboardScreen} options={{ title: 'Renter Dashboard' }} />
    </Drawer.Navigator>
  );
};

export default RoleBasedDrawerNavigator;