import React from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import ShopkeeperDashboardScreen from '../screens/ShopkeeperDashboardScreen';
import RenterDashboardScreen from '../screens/RenterDashboardScreen';
import ManagePaymentPlansScreen from '../screens/ManagePaymentPlansScreen';
import AdminStackNavigator from './AdminStackNavigator';
import ShopkeeperStackNavigator from './ShopkeeperStackNavigator';
import RenterStackNavigator from './RenterStackNavigator';
import DynamicProfile from '../screens/DynamicProfile';

import { useGlobalContext } from '../context/globalContext';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  const { currentUser, setIsLoggedIn } = useGlobalContext();

  const handleLogout = () => {
    setIsLoggedIn(false);
    props.navigation.closeDrawer();
  };

  return (
    <DrawerContentScrollView {...props}>
      {currentUser?.role === 'admin' && (
        <>
          <DrawerItem
            label="Admin Dashboard"
            onPress={() => props.navigation.navigate('AdminDashboard')}
          />
          <DrawerItem
            label="Manage Accounts"
            onPress={() => props.navigation.navigate('AdminStack')}
          />
          <DrawerItem
            label="Manage Payment Plans"
            onPress={() => props.navigation.navigate('ManagePaymentPlans')}
          />
        </>
      )}

      {currentUser?.role === 'shopkeeper' && (
        <>
          <DrawerItem
            label="Shopkeeper Dashboard"
            onPress={() => props.navigation.navigate('ShopkeeperDashboard')}
          />
          <DrawerItem
            label="Shopkeeper Profile"
            onPress={() => props.navigation.navigate('ShopkeeperProfile')}
          />
        </>
      )}

      {currentUser?.role === 'renter' && (
        <>
          <DrawerItem
          label="Renter Dashboard"
          onPress={() => props.navigation.navigate('RenterDashboard')}
          />
          <DrawerItem
            label="Renter Profile"
            onPress={() => props.navigation.navigate('RenterProfile')}
          />
        </>
      )}

      <DrawerItem
        label="Logout"
        onPress={handleLogout}
        labelStyle={{ color: 'red', fontWeight: 'bold' }}
      />
    </DrawerContentScrollView>
  );
};

const RoleBasedDrawerNavigator = () => {
  const { currentUser } = useGlobalContext();

  return (
    <Drawer.Navigator
      initialRouteName={
        currentUser?.role === 'admin'
          ? 'AdminDashboard'
          : currentUser?.role === 'shopkeeper'
          ? 'ShopkeeperDashboard'
          : 'RenterDashboard'
      }
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      {currentUser?.role === 'admin' && (
        <>
          <Drawer.Screen name="AdminDashboard" component={AdminDashboardScreen} options={{ title: 'Admin Dashboard' }} />
          <Drawer.Screen name="AdminStack" component={AdminStackNavigator} options={{ title: 'Manage Accounts' }} />
          <Drawer.Screen name="ManagePaymentPlans" component={ManagePaymentPlansScreen} options={{ title: 'Manage Payment Plans' }} />
        </>
      )}

      {currentUser?.role === 'shopkeeper' && (
        <>
          <Drawer.Screen name="ShopkeeperDashboard" component={ShopkeeperDashboardScreen} options={{ title: 'Shopkeeper Dashboard' }} />
          <Drawer.Screen name="ShopkeeperProfile" component={DynamicProfile} options={{ title: 'Shopkeeper Account' }} />
        </>
      )}

      {currentUser?.role === 'renter' && (
        <>
          <Drawer.Screen name="RenterDashboard" component={RenterDashboardScreen} options={{ title: 'Renter Dashboard' }} />
          <Drawer.Screen name="RenterProfile" component={DynamicProfile} options={{ title: 'Renter Account' }} />
        </>
      )}
    </Drawer.Navigator>
  );
};

export default RoleBasedDrawerNavigator;
