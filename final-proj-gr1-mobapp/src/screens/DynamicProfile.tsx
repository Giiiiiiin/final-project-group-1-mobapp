import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useGlobalContext } from '../context/globalContext';
import { showMessage } from 'react-native-flash-message';
import { useNavigation } from '@react-navigation/native';

// Email validation regex
const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation helper
const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

const DynamicProfile = () => {
  const { currentUser, users, setCurrentUser, setUsers, theme } = useGlobalContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editedEmail, setEditedEmail] = useState(currentUser?.email || '');
  const [emailError, setEmailError] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigation = useNavigation();

  if (!currentUser) {
    return null;
  }

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setEditedEmail(currentUser.email);
    setEmailError('');
  };

  const handleSave = () => {
    const trimmedEmail = editedEmail.trim().toLowerCase();
    if (!trimmedEmail) {
      setEmailError('Email is required');
      return;
    }
    if (!isValidEmail(trimmedEmail)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    if (
      users.some(user => user.email.trim().toLowerCase() === trimmedEmail.toLowerCase()) &&
      trimmedEmail !== currentUser.email
    ) {
      setEmailError('This email is already registered.');
      return;
    }

    const updatedUsersList = users.map(user =>
      user.id === currentUser.id ? { ...user, email: trimmedEmail } : user
    );
    setUsers(updatedUsersList);

    const updatedUser = { ...currentUser, email: trimmedEmail };
    setCurrentUser(updatedUser);

    showMessage({
      message: 'Success',
      description: 'Your email has been updated.',
      type: 'success',
    });

    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedEmail(currentUser.email);
    setEmailError('');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setIsEditing(false);
    setIsChangingPassword(false);
  };

  const handleImagePress = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'You need to allow access to your photo library.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedImageUri = result.assets[0].uri;

      const updatedUsers = users.map(user =>
        user.id === currentUser.id
          ? { ...user, profileImage: selectedImageUri }
          : user
      );
      setUsers(updatedUsers);

      const updatedCurrentUser = { ...currentUser, profileImage: selectedImageUri };
      setCurrentUser(updatedCurrentUser);

      showMessage({
        message: 'Success',
        description: 'Profile image updated.',
        type: 'success',
      });
    }
  };

  const handleChangePassword = () => {
    setIsChangingPassword(true);
  };

  const handlePasswordSave = () => {
    if (currentPassword !== currentUser.password) {
      setPasswordError('Current password is incorrect.');
      return;
    }
    if (!isValidPassword(newPassword)) {
      setPasswordError('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    const updatedUsersList = users.map(user =>
      user.id === currentUser.id
        ? { ...user, password: newPassword }
        : user
    );
    setUsers(updatedUsersList);

    const updatedUser = { ...currentUser, password: newPassword };
    setCurrentUser(updatedUser);

    showMessage({
      message: 'Success',
      description: 'Password has been updated.',
      type: 'success',
    });

    setIsChangingPassword(false);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Back Button - Moved to Bottom */}
      <View style={styles.contentContainer}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </Pressable>

        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Pressable onPress={handleImagePress}>
            {currentUser.profileImage ? (
              <Image source={{ uri: currentUser.profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderText}>
                  {currentUser.email.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </Pressable>

          {/* User Info */}
          {isEditing ? (
            <>
              <TextInput
                value={editedEmail}
                onChangeText={setEditedEmail}
                style={styles.editableEmailInput}
                placeholder="Enter new email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
            </>
          ) : (
            <Text style={styles.userName}>{currentUser.email}</Text>
          )}

          <Text style={styles.userRole}>
            Role: {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
          </Text>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>User Details</Text>
          <Text style={styles.infoText}>ID: {currentUser.id}</Text>
          <Text style={styles.infoText}>Email: {currentUser.email}</Text>
          <Text style={styles.infoText}>Role: {currentUser.role}</Text>
        </View>

        {/* Action Buttons - Edit & Change Password */}
        {!isChangingPassword && !isEditing && (
          <View style={styles.inlineButtons}>
            <Pressable
              style={[styles.inlineButton, { backgroundColor: theme.primary }]}
              onPress={handleChangePassword}
            >
              <Text style={styles.buttonText}>Change Password</Text>
            </Pressable>
            <Pressable
              style={[styles.inlineButton, { backgroundColor: theme.primary }]}
              onPress={handleEditToggle}
            >
              <Text style={styles.buttonText}>Edit Email</Text>
            </Pressable>
          </View>
        )}

        {/* Password Section */}
        {isChangingPassword && (
          <View style={styles.passwordSection}>
            <Text style={styles.sectionTitle}>Change Password</Text>
            <TextInput
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
              placeholder="Current Password"
              style={styles.editableEmailInput}
            />
            <TextInput
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              placeholder="New Password"
              style={styles.editableEmailInput}
            />
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              placeholder="Confirm New Password"
              style={styles.editableEmailInput}
            />
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
          </View>
        )}

        {/* Save / Cancel Buttons */}
        {(isEditing || isChangingPassword) && (
          <View style={styles.actionButtons}>
            <Pressable
              style={[styles.saveButton, styles.button]}
              onPress={isChangingPassword ? handlePasswordSave : handleSave}
            >
              <Text style={styles.buttonText}>Save</Text>
            </Pressable>
            <Pressable
              style={[styles.cancelButton, styles.button]}
              onPress={handleCancel}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default DynamicProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    marginBottom: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  placeholderImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  placeholderText: {
    fontSize: 30,
    color: '#666',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 8,
  },
  editableEmailInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 8,
    width: '80%',
    textAlign: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  userRole: {
    fontSize: 14,
    color: '#666',
  },
  infoCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 8,
    elevation: 2,
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  inlineButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  inlineButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  passwordSection: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 8,
  },
  saveButton: {
    backgroundColor: '#1B1F23',
  },
  cancelButton: {
    backgroundColor: '#D32F2F',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginLeft: 5,
    marginTop: -5,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
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