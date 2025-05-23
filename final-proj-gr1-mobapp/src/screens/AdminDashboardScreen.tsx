import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  Image,
  Pressable,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { useGlobalContext } from '../context/globalContext';
import { useNavigation } from '@react-navigation/native';

const AdminDashboardScreen = () => {
  const { currentUser, users, paymentPlans, theme } = useGlobalContext();
  const navigation = useNavigation();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (currentUser?.role !== 'admin') {
      alert('Access Denied: You do not have permission to view this page.');
      navigation.goBack();
    }
  }, [currentUser]);

  const equipmentList = users
    .filter(u => u.role === 'shopkeeper')
    .flatMap(u => u.equipmentList || []);

  const filteredEquipment = equipmentList.filter(item => {
    const query = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query)
    );
  });

  const renderItem = ({ item }) => {
    const owner = users.find(u => u.equipmentList?.some(e => e.id === item.id));
    return (
      <Pressable onPress={() => {
        setSelectedEquipment(item);
        setModalVisible(true);
      }}>
        <View style={styles.equipmentCard}>
          {item.images?.length > 0 ? (
            <Image source={{ uri: item.images[0] }} style={styles.equipmentImage} />
          ) : (
            <View style={[styles.equipmentImage, styles.imagePlaceholder]}>
              <Text>No Image</Text>
            </View>
          )}
          <Text style={styles.equipmentName}>{item.name}</Text>
          <Text style={styles.equipmentPrice}>₱{item.price}/day</Text>
          <Text style={styles.ownerEmail}>Listed by: {owner?.email}</Text>
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>
      <Text style={styles.subtitle}>Browse all shopkeeper listings</Text>

      <TextInput
        style={styles.searchBar}
        placeholder="Search equipment..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor="#666"
      />

      <FlatList
        data={filteredEquipment}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.noResultsText}>No results found.</Text>}
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
                {selectedEquipment.images?.length > 0 ? (
                  <FlatList
                    horizontal
                    data={selectedEquipment.images}
                    renderItem={({ item: img }) => (
                      <Image source={{ uri: img }} style={styles.modalImage} />
                    )}
                    keyExtractor={(_, idx) => idx.toString()}
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                  />
                ) : (
                  <Text>No images available</Text>
                )}
                <Text style={styles.modalTitle}>{selectedEquipment.name}</Text>
                <Text style={styles.modalPrice}>₱{selectedEquipment.price}/day</Text>

                <Text style={styles.modalDescription}>
                  {selectedEquipment.description || 'No description'}
                </Text>

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
    </View>
  );
};

export default AdminDashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
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
    height: 150,
    borderRadius: 6,
    marginBottom: 10,
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
  modalDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
  },
  closeButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  noResultsText: {
    textAlign: 'center',
    color: '#888',
    fontStyle: 'italic',
    marginTop: 20,
  },
});