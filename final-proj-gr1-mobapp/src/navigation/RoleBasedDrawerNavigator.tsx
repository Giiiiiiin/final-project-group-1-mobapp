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
import ManageAccountsScreen from '../screens/ManageAccountsScreen';
import AddEquipmentScreen from '../screens/AddEquipmentScreen';
import UpdateEquipmentScreen from '../screens/UpdateEquipmentScreen';
import DynamicProfile from '../screens/DynamicProfile';
import { useGlobalContext } from '../context/globalContext';
import { showMessage } from 'react-native-flash-message';

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
            onPress={() => props.navigation.navigate('ManageAccounts')}
          />
        </>
      )}

      {(currentUser?.role === 'shopkeeper') && (
        <DrawerItem
          label="Shopkeeper Dashboard"
          onPress={() => props.navigation.navigate('Shopkeeper Dashboard')}
        />
      )}

      {currentUser?.role === 'renter' && (
        <DrawerItem
          label="Renter Dashboard"
          onPress={() => props.navigation.navigate('RenterDashboard')}
        />
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
          ? 'Shopkeeper Dashboard'
          : 'RenterDashboard'
      }
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      {/* Admin Screens */}
      {currentUser?.role === 'admin' && (
        <>
          <Drawer.Screen name="AdminDashboard" component={AdminDashboardScreen} options={{ title: 'Admin Dashboard' }} />
          <Drawer.Screen name="ManageAccounts" component={ManageAccountsScreen} options={{ title: 'Manage Accounts' }} />
          <Drawer.Screen name="DynamicProfile" component={DynamicProfile} options={{ title: 'Admin Profile' }} />
        </>
      )}

      {/* Shopkeeper Screen */}
      {currentUser?.role === 'shopkeeper' && (
  <>
    <Drawer.Screen name="Shopkeeper Dashboard" component={ShopkeeperDashboardScreen} />
    <Drawer.Screen 
      name="AddEquipment" 
      component={AddEquipmentScreen} 
      options={{ title: 'Add Equipment' }}
    />
    <Drawer.Screen 
      name="UpdateEquipment" 
      component={UpdateEquipmentScreen} 
      options={{ title: 'Update Equipment', drawerItemStyle: { display: 'none' } }}
    />
  </>
)}

      {/* Renter Screen */}
      {currentUser?.role === 'renter' && (
        <Drawer.Screen name="RenterDashboard" component={RenterDashboardScreen} />
      )}
    </Drawer.Navigator>
  );
};

export default RoleBasedDrawerNavigator;