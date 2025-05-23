import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useGlobalContext } from '../context/globalContext';
import { useNavigation } from '@react-navigation/native';

const EquipmentRented = () => {
  const navigation = useNavigation();
  const { currentUser, users, setUsers, sendMessage, setCurrentUser, paymentPlans } = useGlobalContext();
  const rentedItems = currentUser?.equipmentRentedList || [];
  const [refreshKey, setRefreshKey] = useState(0);

  const getCardStyleByStatus = (status) => {
    switch (status) {
      case 'Requested': return styles.cardRequested;
      case 'Received': return styles.cardReceived;
      case 'Returned': return styles.cardReturned;
      default: return {};
    }
  };

  const handleAccept = (item) => {
    const updatedUsers = users.map(user => {
      if (user.id === item.renterId) {
        return {
          ...user,
          currentlyBorrowedList: user.currentlyBorrowedList.map(eq =>
            eq.id === item.id
              ? { ...eq, status: 'Received', totalExtensions: 0, isReturnPending: false }
              : eq
          ),
        };
      }
      if (user.id === currentUser.id) {
        return {
          ...user,
          equipmentRentedList: user.equipmentRentedList.map(eq =>
            eq.id === item.id
              ? { ...eq, status: 'Received', totalExtensions: 0, isReturnPending: false }
              : eq
          ),
        };
      }
      return user;
    });

    setUsers(updatedUsers);
    setCurrentUser(updatedUsers.find(u => u.id === currentUser.id));
    setRefreshKey(prev => prev + 1);

    sendMessage(
      item.renterId,
      currentUser.id,
      `Your rental request for "${item.name}" has been approved!`,
      'NOTIFICATION',
      item.planId
    );

    sendMessage(
      currentUser.id,
      currentUser.id,
      `You approved ${users.find(u => u.id === item.renterId)?.email}'s request for "${item.name}"`,
      'NOTIFICATION',
      item.planId
    );
  };

  const handleReject = (item) => {
    Alert.alert(
      'Reject Request',
      `Reject ${item.name} request from ${users.find(u => u.id === item.renterId)?.email || 'unknown user'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            const renter = users.find(u => u.id === item.renterId);
            const plan = item.planDetails;

            const updatedShopkeeper = {
              ...currentUser,
              equipmentRentedList: currentUser.equipmentRentedList.filter(eq => eq.id !== item.id)
            };

            const updatedUsers = users.map(user => {
              if (user.id === updatedShopkeeper.id) return updatedShopkeeper;
              if (user.id === renter?.id) {
                return {
                  ...user,
                  currentlyBorrowedList: user.currentlyBorrowedList?.filter(eq => eq.id !== item.id)
                };
              }
              return user;
            });

            setUsers(updatedUsers);
            setCurrentUser(updatedShopkeeper);

            sendMessage(
              item.renterId,
              currentUser.id,
              `Your request for "${item.name}" under the "${plan?.title}" plan has been rejected.`,
              'NOTIFICATION',
              item.planId
            );

            sendMessage(
              currentUser.id,
              currentUser.id,
              `You rejected ${renter?.email}'s request for "${item.name}" under the "${plan?.title}" plan.`,
              'NOTIFICATION',
              item.planId
            );
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Equipment Rented</Text>
      {rentedItems.length === 0 ? (
        <Text style={styles.emptyText}>No equipment has been rented out.</Text>
      ) : (
        <FlatList
          key={refreshKey}
          data={rentedItems}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={[styles.card, getCardStyleByStatus(item.status)]}>
              {item.images?.length > 0 ? (
                <Image source={{ uri: item.images[0] }} style={styles.image} />
              ) : (
                <View style={[styles.image, styles.imagePlaceholder]}>
                  <Text>No Image</Text>
                </View>
              )}
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>₱{item.price}</Text>
              <Text style={styles.status}>Status: {item.status}</Text>
              <Text style={styles.renter}>
                Renter: {users.find(u => u.id === item.renterId)?.email || 'Unknown'}
              </Text>

              {(() => {
                const plan = paymentPlans.find(p => p.title === item.planDetails?.title);
                return (
                  <>
                    <Text style={styles.plan}>
                      {plan ? `Plan: ${plan.title} (${plan.durationDays} days) / ₱${item.price} per day` : 'No plan selected'}
                    </Text>
                    <Text style={styles.plan}>
                      {plan ? `Total: ₱${item.price * plan.durationDays} per extension` : 'No plan selected'}
                    </Text>
                    <Text style={styles.status}>Extensions: {item.totalExtensions ?? 0}</Text>
                  </>
                );
              })()}

              {item.status === 'Requested' && (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.button, styles.acceptButton]}
                    onPress={() => handleAccept(item)}
                  >
                    <Text style={styles.buttonText}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.rejectButton]}
                    onPress={() => handleReject(item)}
                  >
                    <Text style={styles.buttonText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              )}

              {item.status === 'Returned' && item.isReturnPending && (
                <TouchableOpacity
                  style={styles.confirmReturnButton}
                  onPress={() => {
                    Alert.alert(
                      'Confirm Return',
                      `Confirm that "${item.name}" has been returned?`,
                      [
                        { text: 'Cancel', style: 'cancel' },
                        {
                          text: 'Confirm',
                          onPress: () => {
                            const updatedUsers = users.map(user => {
                              if (user.id === currentUser.id) {
                                return {
                                  ...user,
                                  equipmentRentedList: user.equipmentRentedList.filter(eq => eq.id !== item.id),
                                };
                              }
                              if (user.id === item.renterId) {
                                return {
                                  ...user,
                                  currentlyBorrowedList: user.currentlyBorrowedList.filter(eq => eq.id !== item.id),
                                };
                              }
                              return user;
                            });

                            setUsers(updatedUsers);
                            setCurrentUser(updatedUsers.find(u => u.id === currentUser.id));

                            const plan = paymentPlans.find(p => p.title === item.planDetails?.title);
                            const totalExt = item.totalExtensions ?? 0;

                            sendMessage(
                              item.renterId,
                              currentUser.id,
                              `"${item.name}" (${plan?.title}) has been successfully received by the shopkeeper. Total extensions: ${totalExt}.`,
                              'NOTIFICATION',
                              item.planId
                            );

                            sendMessage(
                              currentUser.id,
                              currentUser.id,
                              `You confirmed the return of "${item.name}" (${plan?.title}) from ${users.find(u => u.id === item.renterId)?.email}. Total extensions: ${totalExt}.`,
                              'NOTIFICATION',
                              item.planId
                            );
                          }
                        }
                      ]
                    );
                  }}
                >
                  <Text style={styles.confirmReturnButtonText}>Confirm Return</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
};

export default EquipmentRented;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    fontStyle: 'italic',
    marginTop: 50,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
  },
  image: {
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
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
    color: '#4CAF50',
    marginVertical: 4,
  },
  status: {
    fontSize: 14,
    color: '#555',
  },
  renter: {
    fontSize: 14,
    color: '#777',
    marginBottom: 4,
  },
  plan: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 10,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#D32F2F',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cardRequested: {
    borderLeftWidth: 6,
    borderLeftColor: '#FFCDD2',
  },
  cardReceived: {
    borderLeftWidth: 6,
    borderLeftColor: '#BBDEFB',
  },
  cardReturned: {
    borderLeftWidth: 6,
    borderLeftColor: '#C8E6C9',
  },
  confirmReturnButton: {
    backgroundColor: '#1B1F23',
    marginTop: 10,
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  confirmReturnButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});