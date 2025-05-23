import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useGlobalContext } from '../context/globalContext';
import { Picker } from '@react-native-picker/picker';
import BottomSpacer from '../components/BottomSpacer';

const ShopkeeperDashboardScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { currentUser, updateUserEquipment, theme, paymentPlans } = useGlobalContext();
  const [equipmentList, setEquipmentList] = useState(currentUser?.equipmentList ?? []);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [rentalStatus, setRentalStatus] = useState('Renting');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEquipmentList = equipmentList.filter(item => {
    const matchesName = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDescription = item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesName || matchesDescription;
  });

  useEffect(() => {
    setEquipmentList(currentUser?.equipmentList ?? []);
  }, [currentUser?.equipmentList]);

  useEffect(() => {
    if (route.params?.newEquipment) {
      const newItem = {
        ...route.params.newEquipment,
        status: 'Renting',
      };
      const updated = [...equipmentList, newItem];
      setEquipmentList(updated);
      updateUserEquipment(currentUser!.id, updated);
    }
    if (route.params?.updatedEquipment) {
      const updatedItem = route.params.updatedEquipment;
      const updated = equipmentList.map(item =>
        item.id === updatedItem.id ? { ...updatedItem } : item
      );
      setEquipmentList(updated);
      updateUserEquipment(currentUser!.id, updated);
    }
  }, [route.params]);

  const handleDeleteEquipment = (id: string) => {
    Alert.alert('Delete Equipment', 'Are you sure you want to remove this item?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          const updatedList = equipmentList.filter(item => item.id !== id);
          setEquipmentList(updatedList);
          updateUserEquipment(currentUser!.id, updatedList);
        },
      },
    ]);
  };

  const handleEquipmentPress = (item) => {
    setSelectedEquipment(item);
    setRentalStatus(item.status || 'Renting');
    setModalVisible(true);
  };

  const handleEdit = (equipment) => {
    navigation.navigate('UpdateEquipment', { equipment });
  };

  const renderEquipmentItem = ({ item }) => (
    <Pressable onPress={() => handleEquipmentPress(item)}>
      <View style={styles.equipmentCard}>
        {item?.images?.length > 0 ? (
          <Image source={{ uri: item.images[0] }} style={styles.equipmentImage} />
        ) : (
          <View style={[styles.equipmentImage, styles.imagePlaceholder]}>
            <Text>No Image</Text>
          </View>
        )}
        <View style={styles.cardHeader}>
          <Text style={styles.equipmentName}>{item.name}</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              onPress={() => handleEdit(item)}
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
        <View style={styles.plansContainer}>
          {item.paymentPlanIds?.map(planId => {
            const plan = paymentPlans.find(p => p.id === planId);
            return plan ? (
              <View key={planId} style={styles.planPill}>
                <Text style={styles.planPillText}>
                  {plan.title} ({plan.durationDays}d)
                </Text>
              </View>
            ) : null;
          })}
        </View>
        <Text style={styles.equipmentPrice}>₱{item.price}/day</Text>
        <View style={[styles.statusPill, item.status === 'Rented' ? styles.rentedPill : styles.rentingPill]}>
          <Text style={styles.statusPillText}>{item.status}</Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shopkeeper Dashboard</Text>
      <Text style={styles.subtitle}>Manage your gear listings and rentals.</Text>
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: theme.primary }]}
        onPress={() => navigation.navigate('AddEquipment')}
      >
        <Text style={styles.addButtonText}>+ Add Equipment</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.searchBar}
        placeholder="Search equipment..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor="#666"
      />
      <FlatList
        data={filteredEquipmentList}
        renderItem={renderEquipmentItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.noResultsText}>No results available.</Text>}
      />
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedEquipment && (
              <>
                {selectedEquipment?.images?.length > 0 ? (
                  <FlatList
                    horizontal
                    data={selectedEquipment.images}
                    renderItem={({ item: img }) => (
                      <Image source={{ uri: img }} style={styles.modalImage} />
                    )}
                    keyExtractor={(_, index) => index.toString()}
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                  />
                ) : (
                  <Text>No images available</Text>
                )}
                <Text style={styles.modalTitle}>{selectedEquipment.name}</Text>
                <Text style={styles.modalPrice}>₱{selectedEquipment.price}/day</Text>
                <ScrollView horizontal contentContainerStyle={styles.modalPlansContainer}>
                  {selectedEquipment.paymentPlanIds?.map(planId => {
                    const plan = paymentPlans.find(p => p.id === planId);
                    return plan ? (
                      <View key={planId} style={styles.modalPlanPill}>
                        <Text style={styles.modalPlanText}>
                          {plan.title} ({plan.durationDays} days)
                        </Text>
                      </View>
                    ) : null;
                  })}
                </ScrollView>
                <Text>{selectedEquipment.description}</Text>
                <Text style={styles.statusLabel}>Rental Status:</Text>
                <Picker
                  selectedValue={rentalStatus}
                  onValueChange={(value) => {
                    setRentalStatus(value);
                    const updatedList = equipmentList.map(e =>
                      e.id === selectedEquipment.id ? { ...e, status: value } : e
                    );
                    setEquipmentList(updatedList);
                    updateUserEquipment(currentUser!.id, updatedList);
                    setSelectedEquipment({ ...selectedEquipment, status: value });
                  }}
                >
                  <Picker.Item label="Renting" value="Renting" />
                  <Picker.Item label="Rented" value="Rented" />
                </Picker>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
      <BottomSpacer />
    </View>
  );
};

export default ShopkeeperDashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    paddingBottom: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
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
  listContainer: {
    paddingBottom: 20,
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
    borderRadius: 6,
    marginBottom: 10,
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
  },
  equipmentName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  equipmentPrice: {
    fontSize: 16,
    color: '#4CAF50',
    marginBottom: 5,
    marginTop: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    backgroundColor: '#1B1F23',
  },
  deleteButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000080',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxHeight: '80%',
  },
  modalImage: {
    width: 300,
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
    marginRight: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
  },
  statusLabel: {
    marginTop: 15,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 20,
  },
  picker: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginBottom: 12,
    padding: 10,
  },
  plansContainer: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 8,
  },
  planPill: {
    backgroundColor: '#e3f2fd',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#2196F3',
    marginTop: 10,
  },
  planPillText: {
    color: '#2196F3',
    fontSize: 12,
    fontWeight: '500',
  },
  modalPlansContainer: {
    flexDirection: 'row',
    gap: 10,
    paddingBottom: 15,
  },
  modalPlanPill: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
    minWidth: 120,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  modalPlanText: {
    fontWeight: '500',
    marginBottom: 4,
  },
  searchBar: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  noResultsText: {
    textAlign: 'center',
    color: '#888',
    fontStyle: 'italic',
    marginTop: 20,
  },
});