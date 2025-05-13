import { StyleSheet, StatusBar } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  image: {
    width: 100,
    height: 100
  },
  imageContainer: {
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 1
  }
});