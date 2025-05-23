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

const CurrentlyRented = () => {
  const { currentUser, users, paymentPlans, setCurrentUser, setUsers, sendMessage } = useGlobalContext();
  const borrowedItems = currentUser?.currentlyBorrowedList || [];

  const getOwner = (equipmentId) =>
    users.find(user =>
      user.role === 'shopkeeper' &&
      (user.equipmentList?.some(eq => eq.id === equipmentId) ||
       user.equipmentRentedList?.some(eq => eq.id === equipmentId))
    );

  const getOwnerEmail = (equipmentId) => getOwner(equipmentId)?.email || 'Unknown';

  const getPlanDetails = (equipment) => {
    return paymentPlans.find(p => p.id === equipment?.selectedPlanId);
  };

  const getCardStyleByStatus = (status) => {
    switch (status) {
      case 'Requested': return styles.cardRequested;
      case 'Received': return styles.cardReceived;
      case 'Returned': return styles.cardReturned;
      default: return {};
    }
  };

  const handleCancelRequest = (item) => {
    Alert.alert(
      'Cancel Rental Request',
      `Are you sure you want to cancel the request for "${item.name}"?`,
      [
        { text: 'No' },
        {
          text: 'Yes',
          onPress: () => {
            const owner = getOwner(item.id);
            const plan = getPlanDetails(item);

            const updatedRenter = {
              ...currentUser,
              currentlyBorrowedList: currentUser.currentlyBorrowedList.filter(eq => eq.id !== item.id),
            };
            setCurrentUser(updatedRenter);
            setUsers(prev => prev.map(user =>
              user.id === updatedRenter.id ? updatedRenter : user
            ));

            if (owner) {
              const updatedOwner = {
                ...owner,
                equipmentRentedList: owner.equipmentRentedList?.filter(eq => eq.id !== item.id),
              };
              setUsers(prev => prev.map(user =>
                user.id === updatedOwner.id ? updatedOwner : user
              ));
              sendMessage(
                owner.id,
                currentUser.id,
                `${currentUser.email} has cancelled the rent request for "${item.name}" under the "${plan?.title}" plan.`,
                'NOTIFICATION'
              );
            }

            sendMessage(
              currentUser.id,
              currentUser.id,
              `You cancelled the rent request for "${item.name}" under the "${plan?.title}" plan.`,
              'NOTIFICATION'
            );
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Currently Rented</Text>
      {borrowedItems.length === 0 ? (
        <Text style={styles.emptyText}>You have not rented any equipment yet.</Text>
      ) : (
        <FlatList
          data={borrowedItems}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const plan = getPlanDetails(item);
            const borrowStatus = item.status || 'Requested';
            return (
              <View style={[styles.card, getCardStyleByStatus(borrowStatus)]}>
                {item.images?.length > 0 ? (
                  <Image source={{ uri: item.images[0] }} style={styles.image} />
                ) : (
                  <View style={[styles.image, styles.imagePlaceholder]}>
                    <Text>No Image</Text>
                  </View>
                )}
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.plan}>
                  {plan ? `Plan: ${plan.title} (${plan.durationDays} days) / ₱${item.price} per day` : 'No plan selected'}
                </Text>
                <Text style={styles.plan}>
                  {plan ? `Total: ₱${item.price * plan.durationDays} per extension` : 'No plan selected'}
                </Text>
                <Text style={styles.owner}>Owner: {getOwnerEmail(item.id)}</Text>
                <Text style={styles.status}>Status: {borrowStatus}</Text>
                <Text style={styles.status}>
                  Extensions: {item.totalExtensions || 0}
                </Text>

                {borrowStatus === 'Requested' && (
                  <TouchableOpacity 
                    style={styles.cancelButton} 
                    onPress={() => handleCancelRequest(item)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel Request</Text>
                  </TouchableOpacity>
                )}

                {borrowStatus === 'Received' && !item.isReturnPending && (
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={styles.extendButton}
                      onPress={() => {
                        const updatedUser = {
                          ...currentUser,
                          currentlyBorrowedList: currentUser.currentlyBorrowedList.map(eq =>
                            eq.id === item.id
                              ? { ...eq, totalExtensions: (eq.totalExtensions || 0) + 1 }
                              : eq
                          ),
                        };
                        const updatedUsers = users.map(user =>
                          user.id === currentUser.id
                            ? updatedUser
                            : user.id === getOwner(item.id)?.id
                              ? {
                                  ...user,
                                  equipmentRentedList: user.equipmentRentedList.map(eq =>
                                    eq.id === item.id
                                      ? { ...eq, totalExtensions: (eq.totalExtensions || 0) + 1 }
                                      : eq
                                  ),
                                }
                              : user
                        );
                        const updatedEquipment = updatedUser.currentlyBorrowedList.find(eq => eq.id === item.id);
                        const plan = getPlanDetails(updatedEquipment);
                        const totalExt = updatedEquipment?.totalExtensions ?? 1;
                        const owner = getOwner(item.id);

                        setCurrentUser(updatedUser);
                        setUsers(updatedUsers);

                        sendMessage(
                          owner?.id,
                          currentUser.id,
                          `${currentUser.email} extended the rental for "${item.name}" (${plan?.title}) to ${totalExt} time(s).`,
                          'NOTIFICATION',
                          item.planId
                        );
                        sendMessage(
                          currentUser.id,
                          currentUser.id,
                          `You extended "${item.name}" (${plan?.title}) to ${totalExt} time(s).`,
                          'NOTIFICATION',
                          item.planId
                        );
                      }}
                    >
                      <Text style={styles.buttonText}>Extend</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.returnButton}
                      onPress={() => {
                        const updatedUser = {
                          ...currentUser,
                          currentlyBorrowedList: currentUser.currentlyBorrowedList.map(eq =>
                            eq.id === item.id
                              ? { ...eq, status: 'Returned', isReturnPending: true }
                              : eq
                          ),
                        };
                        const updatedUsers = users.map(user =>
                          user.id === currentUser.id
                            ? updatedUser
                            : user.id === getOwner(item.id)?.id
                              ? {
                                  ...user,
                                  equipmentRentedList: user.equipmentRentedList.map(eq =>
                                    eq.id === item.id
                                      ? { ...eq, status: 'Returned', isReturnPending: true }
                                      : eq
                                  ),
                                }
                              : user
                        );
                        const updatedEquipment = updatedUser.currentlyBorrowedList.find(eq => eq.id === item.id);
                        const plan = getPlanDetails(updatedEquipment);
                        const totalExt = updatedEquipment?.totalExtensions ?? 0;
                        const owner = getOwner(item.id);

                        setCurrentUser(updatedUser);
                        setUsers(updatedUsers);

                        sendMessage(
                          owner?.id,
                          currentUser.id,
                          `${currentUser.email} has returned "${item.name}" (${plan?.title}) with ${totalExt} extension(s).`,
                          'NOTIFICATION',
                          item.planId
                        );
                        sendMessage(
                          currentUser.id,
                          currentUser.id,
                          `You returned "${item.name}" (${plan?.title}) with ${totalExt} extension(s).`,
                          'NOTIFICATION',
                          item.planId
                        );
                      }}
                    >
                      <Text style={styles.buttonText}>Return</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {item.status === 'Returned' && item.isReturnPending && (
                  <View style={styles.pendingButton}>
                    <Text style={styles.buttonText}>Pending Confirmation</Text>
                  </View>
                )}
              </View>
            );
          }}
        />
      )}
    </View>
  );
};

export default CurrentlyRented;

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
  plan: {
    fontSize: 14,
    marginVertical: 4,
    color: '#555',
  },
  owner: {
    fontSize: 14,
    color: '#777',
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 6,
  },
  cancelButton: {
    marginTop: 10,
    backgroundColor: '#D32F2F',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  extendButton: {
    backgroundColor: '#3D8BFF',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    flex: 1,
    marginRight: 5,
  },
  returnButton: {
    backgroundColor: '#1B1F23',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    flex: 1,
    marginLeft: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  pendingButton: {
    alignSelf: 'flex-start',
    padding: 10,
    backgroundColor: '#FFA500',
    borderRadius: 6,
    marginTop: 10,
  },
});