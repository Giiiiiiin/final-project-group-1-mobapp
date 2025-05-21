import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, FlatList, Modal, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

const ShopkeeperDashboardScreen = ({ route }) => {
  const [equipmentList, setEquipmentList] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [rentalStatus, setRentalStatus] = useState('Renting');
  const navigation = useNavigation();

 useEffect(() => {
  if (route.params?.newEquipment) {
    const newItem = route.params.newEquipment;
    // Convert single image to images array if needed
    const equipment = newItem.image && !newItem.images
      ? { ...newItem, images: [newItem.image], status: 'Renting' }
      : { ...newItem, status: 'Renting' };
    setEquipmentList(prev => [...prev, equipment]);
  }
  if (route.params?.updatedEquipment) {
    const updatedItem = route.params.updatedEquipment;
    setEquipmentList(prev => prev.map(item => 
      item.id === updatedItem.id 
        ? { 
            ...updatedItem, 
            images: updatedItem.images || (updatedItem.image ? [updatedItem.image] : []),
            status: item.status || 'Renting' 
          } 
        : item
    ));
  }
}, [route.params]);

  const handleDeleteEquipment = (id) => {
    Alert.alert(
      'Delete Equipment',
      'Are you sure you want to remove this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setEquipmentList(prev => prev.filter(item => item.id !== id));
          }
        }
      ]
    );
  };

  const handleEquipmentPress = (item) => {
    setSelectedEquipment(item);
    setRentalStatus(item.status || 'Renting');
    setModalVisible(true);
  };

  const renderEquipmentItem = ({ item }) => (
  <Pressable onPress={() => handleEquipmentPress(item)}>
    <View style={styles.equipmentCard}>
      {item?.images?.length > 0 ? (
        <Image 
          source={{ uri: item.images[0] }} 
          style={styles.equipmentImage}
          resizeMode="cover"
        />
      ) : item?.image ? (
        <Image 
          source={{ uri: item.image }} 
          style={styles.equipmentImage}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.equipmentImage, {backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center'}]}>
          <Text>No image</Text>
        </View>
)}
        <View style={styles.cardHeader}>
          <Text style={styles.equipmentName}>{item.name}</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity 
              onPress={() => navigation.navigate('UpdateEquipment', { equipment: item })}
              style={[styles.actionButton, styles.editButton]}
            >
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => handleDeleteEquipment(item.id)}
              style={[styles.actionButton, styles.deleteButton]}
            >
              <Text style={styles.buttonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.equipmentPrice}>₱{item.price}/{item.plan}</Text>
        <View style={[
          styles.statusPill,
          item.status === 'Rented' ? styles.rentedPill : styles.rentingPill
        ]}>
          <Text style={styles.statusPillText}>{item.status || 'Renting'}</Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Shopkeeper!</Text>
      <Text style={styles.subtitle}>Manage your gear listings and rentals.</Text>

      <TouchableOpacity 
        style={styles.addButton} 
        onPress={() => navigation.navigate('AddEquipment')}
      >
        <Text style={styles.addButtonText}>+ Add Equipment</Text>
      </TouchableOpacity>

      <FlatList
        data={equipmentList}
        renderItem={renderEquipmentItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
  data={[selectedEquipment]}
  renderItem={({ item }) => (
    <>
      {item?.images?.length > 0 ? (
  <View style={styles.modalImageContainer}>
    <FlatList
      horizontal
      data={item.images}
      renderItem={({ item: imageUri }) => (
        <View style={styles.modalImageWrapper}>
          <Image 
            source={{ uri: imageUri }} 
            style={styles.modalImage}
            resizeMode="contain"
          />
        </View>
      )}
      keyExtractor={(_, index) => index.toString()}
      pagingEnabled
      showsHorizontalScrollIndicator={false}
    />
  </View>
) : item?.image ? (
  <View style={styles.modalImageWrapper}>
    <Image 
      source={{ uri: item.image }} 
      style={styles.modalImage}
      resizeMode="contain"
    />
  </View>
) : (
  <View style={[styles.modalImageWrapper, {backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center'}]}>
    <Text>No images available</Text>
  </View>
)}
                  <Text style={styles.modalTitle}>{item?.name}</Text>
                  <Text style={styles.modalPrice}>₱{item?.price}/{item?.plan}</Text>
                  <Text style={styles.modalDescTitle}>Description:</Text>
                  <Text style={styles.modalDescription}>
                    {item?.description || 'No description available'}
                  </Text>
                  
                  <View style={styles.statusContainer}>
                    <Text style={styles.statusLabel}>Rental Status:</Text>
                    <Picker
                      selectedValue={rentalStatus}
                      onValueChange={(itemValue) => {
                        setRentalStatus(itemValue);
                        setEquipmentList(prev => prev.map(equip => 
                          equip.id === item.id ? {...equip, status: itemValue} : equip
                        ));
                      }}
                      style={styles.picker}
                    >
                      <Picker.Item label="Renting" value="Renting" />
                      <Picker.Item label="Rented" value="Rented" />
                    </Picker>
                  </View>
                </>
              )}
              keyExtractor={(item) => item?.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 70 }}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    paddingBottom: 20,
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
  equipmentCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  equipmentImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginBottom: 10,
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#f44336',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 5,
  },
  actionButton: {
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#FFA500',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    maxHeight: '80%',
  },
modalImage: {
  width: '100%',
  height: '100%',
  borderRadius: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  modalDescTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 25,
  },
  modalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    lineHeight: 24,
  },
  statusContainer: {
    marginBottom: 20,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  picker: {
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
  },
  closeButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  statusPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 5,
  },
  rentingPill: {
    backgroundColor: '#4CAF50',
  },
  rentedPill: {
    backgroundColor: '#FFA500',
  },
  statusPillText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalImageContainer: {
  height: 250,
  marginBottom: 15,
},
modalImageWrapper: {
  width: 300, // Fixed width for proper paging
  height: 250,
},
});

export default ShopkeeperDashboardScreen;