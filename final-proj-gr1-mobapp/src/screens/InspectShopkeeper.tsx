import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  TextInput,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useGlobalContext } from '../context/globalContext';
import { showMessage } from 'react-native-flash-message';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPassword = (password: string) => password.length >= 6;

type InspectShopkeeperRouteProp = RouteProp<
  { InspectShopkeeper: { user: any } },
  'InspectShopkeeper'
>;

const InspectShopkeeper = () => {
  const route = useRoute<InspectShopkeeperRouteProp>();
  const navigation = useNavigation();
  const { user: routeUser } = route.params;
  const { users, setUsers, currentUser, theme } = useGlobalContext();

  const [user, setUser] = useState(routeUser);
  const [isEditing, setIsEditing] = useState(false);
  const [editedEmail, setEditedEmail] = useState(user.email);
  const [emailError, setEmailError] = useState('');

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleEmailSave = () => {
    const trimmedEmail = editedEmail.trim();
    if (!trimmedEmail || !isValidEmail(trimmedEmail)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    const emailExists = users.some(
      u => u.email === trimmedEmail && u.id !== user.id
    );
    if (emailExists) {
      setEmailError('This email is already registered.');
      return;
    }
    const updated = users.map(u => u.id === user.id ? { ...u, email: trimmedEmail } : u);
    setUsers(updated);
    setUser(prev => ({ ...prev, email: trimmedEmail }));
    setIsEditing(false);
    showMessage({ message: 'Email updated successfully', type: 'success' });
  };

  const handlePasswordSave = () => {
    if (!isValidPassword(newPassword)) {
      setPasswordError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }
    const updated = users.map(u => u.id === user.id ? { ...u, password: newPassword } : u);
    setUsers(updated);
    setUser(prev => ({ ...prev, password: newPassword }));
    setIsChangingPassword(false);
    showMessage({ message: 'Password updated successfully', type: 'success' });
  };

  const handleDelete = () => {
    Alert.alert('Delete User', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setUsers(prev => prev.filter(u => u.id !== user.id));
          showMessage({ message: 'User deleted', type: 'success' });
          navigation.goBack();
        },
      },
    ]);
  };

  const handleProfileImageChange = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission Required', 'Enable media access to upload.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 1 });
    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      const updated = users.map(u => u.id === user.id ? { ...u, profileImage: { uri } } : u);
      setUsers(updated);
      setUser(prev => ({ ...prev, profileImage: { uri } }));
      showMessage({ message: 'Profile image updated', type: 'success' });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Back</Text>
      </Pressable>

      <View style={styles.header}>
        <Pressable onPress={currentUser?.role === 'admin' ? handleProfileImageChange : undefined}>
          {user.profileImage ? (
            <Image source={{ uri: user.profileImage.uri }} style={styles.image} />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.initials}>{user.email.charAt(0).toUpperCase()}</Text>
            </View>
          )}
        </Pressable>

        {isEditing ? (
          <TextInput
            value={editedEmail}
            onChangeText={setEditedEmail}
            style={styles.input}
            placeholder="Email"
          />
        ) : (
          <Text style={styles.email}>{user.email}</Text>
        )}

        <Text style={styles.role}>Role: {user.role}</Text>
        {currentUser?.role === 'admin' && (
          <Text style={styles.role}>Password: {user.password}</Text>
        )}

        {currentUser?.role === 'admin' && !isEditing && !isChangingPassword && (
          <View style={styles.adminActions}>
            <Pressable style={[styles.button, { backgroundColor: theme.primary }]} onPress={() => setIsEditing(true)}>
              <Text style={styles.buttonText}>Edit Email</Text>
            </Pressable>
            <Pressable style={[styles.button, { backgroundColor: theme.primary }]} onPress={() => setIsChangingPassword(true)}>
              <Text style={styles.buttonText}>Edit User Password</Text>
            </Pressable>
            <Pressable style={[styles.button, { backgroundColor: theme.danger }]} onPress={handleDelete}>
              <Text style={styles.buttonText}>Delete User</Text>
            </Pressable>
          </View>
        )}

        {(isEditing || isChangingPassword) && (
          <View style={styles.adminActions}>
            <Pressable
              style={[styles.button, { backgroundColor: theme.accent }]}
              onPress={isEditing ? handleEmailSave : handlePasswordSave}
            >
              <Text style={styles.buttonText}>Save</Text>
            </Pressable>
            <Pressable
              style={[styles.button, { backgroundColor: '#999' }]}
              onPress={() => {
                setIsEditing(false);
                setIsChangingPassword(false);
                setPasswordError('');
              }}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>
          </View>
        )}

        {isChangingPassword && (
          <View style={styles.passwordSection}>
            <TextInput
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              placeholder="New Password"
              style={styles.input}
            />
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              placeholder="Confirm Password"
              style={styles.input}
            />
            {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Equipment Listings</Text>
        {(user.equipmentList?.length ?? 0) > 0 ? (
          user.equipmentList!.map((item) => (
            <View key={item.id} style={styles.card}>
              <Text style={styles.itemTitle}>{item.name}</Text>
              <Text>₱{item.price}/{item.plan}</Text>
              {item.description && <Text>{item.description}</Text>}
            </View>
          ))
        ) : (
          <Text style={styles.empty}>No equipment listed.</Text>
        )}
      </View>
    </ScrollView>
  );
};

export default InspectShopkeeper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  placeholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  initials: {
    fontSize: 30,
    color: '#666',
  },
  email: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  role: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    textAlign: 'center',
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  itemTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  empty: {
    fontStyle: 'italic',
    color: '#999',
    textAlign: 'center',
    marginVertical: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginVertical: 8,
    width: '80%',
    textAlign: 'center',
  },
  adminActions: {
    width: '100%',
    paddingVertical: 10,
  },
  button: {
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginVertical: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginTop: -4,
    textAlign: 'center',
  },
  backButton: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#ddd',
    borderRadius: 6,
    alignItems: 'center',
    width: '100%',
  },
  backButtonText: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: 16,
  },
});