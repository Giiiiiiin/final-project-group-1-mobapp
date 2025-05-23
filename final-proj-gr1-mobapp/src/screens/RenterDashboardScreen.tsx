import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  Image,
  Pressable,
  Modal,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useGlobalContext } from '../context/globalContext';
import { useNavigation } from '@react-navigation/native';
import BottomSpacer from '../components/BottomSpacer';

const RenterDashboardScreen = () => {
  const {
    currentUser,
    users,
    paymentPlans,
    theme,
    setUsers,
    setCurrentUser,
    updateUserEquipment,

  } = useGlobalContext();
  const navigation = useNavigation();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [equipmentList, setEquipmentList] = useState(currentUser?.equipmentList ?? []);

  const currentOwner = selectedEquipment
    ? users.find(
        u =>
          u.role === 'shopkeeper' &&
          u.equipmentList?.some(eq => eq.id === selectedEquipment.id)
      )
    : null;

  const isAlreadyRequested = selectedEquipment
    ? currentUser?.currentlyBorrowedList?.some(item => 
        item.name === selectedEquipment.name && 
        item.ownerId === currentOwner?.id
      )
    : false;

  const availableEquipment = users
    .filter(u => u.role === 'shopkeeper')
    .flatMap(u => {
      const rentedEquipmentIds = new Set(
        u.equipmentRentedList?.map(eq => eq.id) || []
      );
      return u.equipmentList?.filter(eq => !rentedEquipmentIds.has(eq.id)) || [];
    });

  const filteredEquipment = availableEquipment.filter(item => {
    const query = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query)
    );
  });

  const renderEquipmentItem = ({ item }) => {
    const owner = users.find(u => u.equipmentList?.some(e => e.id === item.id));
    return (
      <Pressable onPress={() => {
        setSelectedEquipment(item);
        setModalVisible(true);
      }}>
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
          </View>
          <Text style={styles.equipmentPrice}>₱{item.price}/day</Text>
          {owner && <Text style={styles.ownerEmail}>Listed by: {owner.email}</Text>}
          <View style={[
            styles.statusPill,
            item.status === 'Rented' ? styles.rentedPill : styles.rentingPill
          ]}>
            <Text style={styles.statusPillText}>{item.status}</Text>
          </View>
        </View>
      </Pressable>
    );
  };

  const handleRent = () => {
    if (!selectedPlanId || !selectedEquipment || isAlreadyRequested) return;

    const owner = users.find(u =>
      u.role === 'shopkeeper' &&
      u.equipmentList?.some(eq => eq.id === selectedEquipment.id)
    );

    const plan = paymentPlans.find(p => p.id === selectedPlanId);

    if (!owner || !currentUser || !plan) return;

    const rentedEquipment = {
      ...selectedEquipment,
      selectedPlanId: plan.id,
      ownerId: owner.id,
      renterId: currentUser.id,
      status: 'Requested',
      requestDate: new Date().toISOString(),
      planDetails: {
        title: plan.title,
        duration: plan.durationDays,
      },
    };

    const requestMessage = {
      id: Date.now().toString(),
      fromUserId: currentUser.id,
      toUserId: owner.id,
      content: `${currentUser.email} wants to rent "${selectedEquipment.name}" with the "${plan.title}" plan.`,
      timestamp: new Date().toISOString(),
      type: 'REQUEST',
      planId: plan.id,
    };

    const selfNotification = {
      id: (Date.now() + 1).toString(),
      fromUserId: currentUser.id,
      toUserId: currentUser.id,
      content: `You requested to rent "${selectedEquipment.name}" with the "${plan.title}" plan.`,
      timestamp: new Date().toISOString(),
      type: 'NOTIFICATION',
      planId: plan.id,
    };

    setUsers(prev => {
      const updatedUsers = prev.map(user => {
        if (user.id === owner.id) {
          return {
            ...user,
            messages: [...(user.messages || []), requestMessage],
            equipmentRentedList: [
              ...(user.equipmentRentedList || []),
              rentedEquipment,
            ],
          };
        }

        if (user.id === currentUser.id) {
          return {
            ...user,
            messages: [...(user.messages || []), selfNotification],
            currentlyBorrowedList: [
              ...(user.currentlyBorrowedList || []),
              rentedEquipment,
            ],
          };
        }

        return user;
      });

      const updatedCurrentUser = updatedUsers.find(u => u.id === currentUser.id);
      if (updatedCurrentUser) {
        setCurrentUser(updatedCurrentUser);
      }

      return updatedUsers;
    });

    setModalVisible(false);
    setTimeout(() => alert('Request to rent was sent.'), 300);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Renter Dashboard</Text>
      <Text style={styles.subtitle}>Browse available equipment and manage your rentals</Text>

      <TextInput
        style={styles.searchBar}
        placeholder="Search equipment..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor="#666"
      />

      <FlatList
        data={filteredEquipment}
        horizontal
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
                    const isSelected = planId === selectedPlanId;

                    return plan ? (
                      <TouchableOpacity
                        key={planId}
                        style={[styles.modalPlanPill, isSelected && { borderColor: theme.primary, backgroundColor: '#e6f0ff' }]}
                        onPress={() => setSelectedPlanId(planId)}
                      >
                        <Text style={[styles.modalPlanText, isSelected && { fontWeight: 'bold', color: theme.primary }]}>
                          {plan.title} ({plan.durationDays} days)
                        </Text>
                      </TouchableOpacity>
                    ) : null;
                  })}
                </ScrollView>

                <Text style={styles.modalDescription}>
                  {selectedEquipment.description || 'No description available'}
                </Text>

                <TouchableOpacity
                  style={[
                    styles.button,
                    {
                      backgroundColor: selectedEquipment?.status === 'Rented' || isAlreadyRequested 
                        ? '#ccc' 
                        : selectedPlanId 
                        ? theme.primary 
                        : '#ccc',
                      opacity: selectedEquipment?.status === 'Rented' || isAlreadyRequested 
                        ? 0.6 
                        : selectedPlanId 
                        ? 1 
                        : 0.6,
                    },
                  ]}
                  disabled={selectedEquipment?.status === 'Rented' || isAlreadyRequested || !selectedPlanId}
                  onPress={selectedEquipment?.status === 'Rented' || isAlreadyRequested ? undefined : handleRent}
                >
                  <Text style={styles.buttonText}>
                    {selectedEquipment?.status === 'Rented' 
                      ? 'Already Rented'
                      : isAlreadyRequested
                      ? 'Rent Requested'
                      : 'Rent Equipment'}
                  </Text>
                </TouchableOpacity>

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

export default RenterDashboardScreen;

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
  searchBar: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  listContainer: {
    gap: 10,
    height: 100,
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
    marginVertical: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ownerEmail: {
    fontSize: 12,
    color: '#888',
    marginBottom: 5,
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
  modalDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
  },
  button: {
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 15,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 20,
  },
  noResultsText: {
    textAlign: 'center',
    color: '#888',
    fontStyle: 'italic',
    marginTop: 20,
  },
});