import React from 'react';
import { SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AppNavigator } from './src/navigation/AppNavigator';
import { GlobalProvider } from './src/context/globalContext';
import { styles } from './src/styles/globalStyles';
import FlashMessage from "react-native-flash-message";
import { StatusBar } from 'react-native';

export default function App() {
  return (
    <>
    <SafeAreaView style={styles.container}>
    <FlashMessage position="top"
      style={{ marginTop: StatusBar.currentHeight }}
    />
      <GlobalProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </GlobalProvider>
    </SafeAreaView>
    </>
  );
}
