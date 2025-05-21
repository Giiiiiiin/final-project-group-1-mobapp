import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { useGlobalContext } from '../context/globalContext';

const ShopkeeperDashboardScreen = () => {
  const { currentUser, updateUserEquipment, theme } = useGlobalContext();
  const equipmentList = currentUser?.equipmentList ?? [];

  const [newEquipment, setNewEquipment] = useState({
    name: '',
    price: '',
    plan: '',
    description: '',
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddEquipment = () => {
    if (!newEquipment.name || !newEquipment.price || !newEquipment.plan) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const newItem = {
      id: Date.now().toString(),
      ...newEquipment,
    };

    updateUserEquipment(currentUser!.id, [...equipmentList, newItem]);
    setNewEquipment({ name: '', price: '', plan: '', description: '' });
    setShowAddForm(false);
    Alert.alert('Success', 'Equipment added to your listing!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shopkeeper Dashboard</Text>
      <Text style={styles.subtitle}>Manage your gear listings and rentals.</Text>

      {!showAddForm ? (
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.primary }]}
          onPress={() => setShowAddForm(true)}
        >
          <Text style={styles.addButtonText}>+ Add Equipment</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.addForm}>
          <Text style={styles.formTitle}>Add New Equipment</Text>

          <TextInput
            style={styles.input}
            placeholder="Equipment Name*"
            value={newEquipment.name}
            onChangeText={(text) => setNewEquipment({ ...newEquipment, name: text })}
          />

          <TextInput
            style={styles.input}
            placeholder="Daily Price (₱)"
            value={newEquipment.price}
            onChangeText={(text) => setNewEquipment({ ...newEquipment, price: text })}
            keyboardType="numeric"
          />

          <TextInput
            style={styles.input}
            placeholder="Set Payment Plan*"
            value={newEquipment.plan}
            onChangeText={(text) => setNewEquipment({ ...newEquipment, plan: text })}
          />

          <TextInput
            style={[styles.input, styles.descriptionInput]}
            placeholder="Description (optional)"
            value={newEquipment.description}
            onChangeText={(text) => setNewEquipment({ ...newEquipment, description: text })}
            multiline
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#999' }]}
              onPress={() => setShowAddForm(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.accent }]}
              onPress={handleAddEquipment}
            >
              <Text style={styles.buttonText}>Add Equipment</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <ScrollView style={styles.listContainer}>
        {equipmentList.map((item) => (
          <View key={item.id} style={styles.equipmentCard}>
            <Text style={styles.equipmentName}>{item.name}</Text>
            <Text style={styles.equipmentPrice}>₱{item.price}/{item.plan}</Text>
            {item.description && (
              <Text style={styles.equipmentDescription}>{item.description}</Text>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default ShopkeeperDashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  addButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  addForm: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  descriptionInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    padding: 12,
    borderRadius: 6,
    width: '48%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  listContainer: {
    flex: 1,
  },
  equipmentCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  equipmentName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  equipmentPrice: {
    fontSize: 16,
    color: '#4CAF50',
    marginBottom: 5,
  },
  equipmentDescription: {
    fontSize: 14,
    color: '#666',
  },
});
