import React from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import RenterDashboardScreen from '../screens/RenterDashboardScreen';
import ManagePaymentPlansScreen from '../screens/ManagePaymentPlansScreen';
import AdminStackNavigator from './AdminStackNavigator';
import ShopkeeperStackNavigator from './ShopkeeperStackNavigator';
import DynamicProfile from '../screens/DynamicProfile';
import DynamicMessages from '../screens/DynamicMessages';
import EquipmentRented from '../screens/EquipmentRented';
import CurrentlyRented from '../screens/CurrentlyRented';

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
          <DrawerItem
            label="User Messages"
            onPress={() => props.navigation.navigate('ShopkeeperMessages')}
          />
          <DrawerItem
            label="Equipment Rented"
            onPress={() => props.navigation.navigate('EquipmentRented')}
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
          <DrawerItem
            label="User Messages"
            onPress={() => props.navigation.navigate('RenterMessages')}
          />
          <DrawerItem
            label="Currently Rented"
            onPress={() => props.navigation.navigate('CurrentlyRented')}
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
          <Drawer.Screen name="ShopkeeperDashboard" component={ShopkeeperStackNavigator} options={{ title: 'Shopkeeper Dashboard' }} />
          <Drawer.Screen name="ShopkeeperProfile" component={DynamicProfile} options={{ title: 'Shopkeeper Account' }} />
          <Drawer.Screen name="ShopkeeperMessages" component={DynamicMessages} options={{ title: 'User Messages' }}  />
          <Drawer.Screen name="EquipmentRented" component={EquipmentRented} options={{ title: 'Equipment Rented' }} />
        </>
      )}

      {currentUser?.role === 'renter' && (
        <>
          <Drawer.Screen name="RenterDashboard" component={RenterDashboardScreen} options={{ title: 'Renter Dashboard' }} />
          <Drawer.Screen name="RenterProfile" component={DynamicProfile} options={{ title: 'Renter Account' }} />
          <Drawer.Screen name="RenterMessages" component={DynamicMessages} options={{ title: 'User Messages' }}  />
          <Drawer.Screen name="CurrentlyRented" component={CurrentlyRented} options={{ title: 'Currently Rented' }} />
        </>
      )}
    </Drawer.Navigator>
  );
};

export default RoleBasedDrawerNavigator;
