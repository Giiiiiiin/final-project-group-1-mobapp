import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';

const ShopkeeperDashboardScreen = () => {
  const [equipmentList, setEquipmentList] = useState([]);
  const [newEquipment, setNewEquipment] = useState({
    name: '',
    price: '',
    description: '',
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddEquipment = () => {
    if (!newEquipment.name || !newEquipment.price) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setEquipmentList([...equipmentList, {
      id: Date.now().toString(),
      ...newEquipment
    }]);
    
    setNewEquipment({ name: '', price: '', description: '' });
    setShowAddForm(false);
    Alert.alert('Success', 'Equipment added to your listing!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shopkeeper Dashboard</Text>
      <Text style={styles.subtitle}>Manage your gear listings and rentals.</Text>

      {!showAddForm ? (
        <TouchableOpacity 
          style={styles.addButton} 
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
            onChangeText={(text) => setNewEquipment({...newEquipment, name: text})}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Daily Price (₹)*"
            value={newEquipment.price}
            onChangeText={(text) => setNewEquipment({...newEquipment, price: text})}
            keyboardType="numeric"
          />
          
          <TextInput
            style={[styles.input, styles.descriptionInput]}
            placeholder="Description (optional)"
            value={newEquipment.description}
            onChangeText={(text) => setNewEquipment({...newEquipment, description: text})}
            multiline
          />
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => setShowAddForm(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.submitButton]}
              onPress={handleAddEquipment}
            >
              <Text style={styles.buttonText}>Add Equipment</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <ScrollView style={styles.listContainer}>
        {equipmentList.map(item => (
          <View key={item.id} style={styles.equipmentCard}>
            <Text style={styles.equipmentName}>{item.name}</Text>
            <Text style={styles.equipmentPrice}>₹{item.price}/day</Text>
            {item.description && (
              <Text style={styles.equipmentDescription}>{item.description}</Text>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

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
    backgroundColor: '#4CAF50',
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
  cancelButton: {
    backgroundColor: '#f44336',
  },
  submitButton: {
    backgroundColor: '#2196F3',
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

export default ShopkeeperDashboardScreen;