import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useGlobalContext } from '../context/globalContext';

export interface PaymentPlan {
  id: string;
  title: string;
  durationDays: number;
}

const ManagePaymentPlansScreen = () => {
  const { theme, paymentPlans, setPaymentPlans } = useGlobalContext();
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDuration, setNewDuration] = useState('');

  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDuration, setEditDuration] = useState('');

  const isTitleTaken = (title: string, skipId?: string): boolean => {
    return paymentPlans.some(
        (plan) =>
        plan.title.trim().toLowerCase() === title.trim().toLowerCase() &&
        plan.id !== skipId 
    );
  };

  const handleAddPlan = () => {
  if (!newTitle || !newDuration ) {
    Alert.alert('Error', 'All fields are required.');
    return;
  }

  if (isTitleTaken(newTitle)) {
    Alert.alert('Error', 'A plan with this title already exists.');
    return;
  }

  const newPlan: PaymentPlan = {
    id: String(paymentPlans.length + 1),
    title: newTitle,
    durationDays: parseInt(newDuration),
  };

  setPaymentPlans([...paymentPlans, newPlan]);
  setNewTitle('');
  setNewDuration('');
  setIsAdding(false);
};

  const handleDeletePlan = (id: string) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this plan?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: () =>
            setPaymentPlans(paymentPlans.filter((plan) => plan.id !== id)),
          style: 'destructive',
        },
      ]
    );
  };

  const handleEditPlan = (item: PaymentPlan) => {
    setEditingPlanId(item.id);
    setEditTitle(item.title);
    setEditDuration(item.durationDays.toString());
  };

  const handleSaveEdit = () => {
  if (!editTitle || !editDuration ) {
    Alert.alert('Error', 'All fields are required.');
    return;
  }

  if (isTitleTaken(editTitle, editingPlanId)) {
    Alert.alert('Error', 'A plan with this title already exists.');
    return;
  }

  setPaymentPlans((prev) =>
    prev.map((plan) =>
      plan.id === editingPlanId
        ? {
            ...plan,
            title: editTitle,
            durationDays: parseInt(editDuration),
          }
        : plan
    )
  );

  setEditingPlanId(null);
  setEditTitle('');
  setEditDuration('');
};

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Available Payment Plans</Text>

      <FlatList
        data={paymentPlans}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.planCard}>
            {editingPlanId === item.id ? (
              <>
                <TextInput
                  value={editTitle}
                  onChangeText={setEditTitle}
                  placeholder="Plan Title"
                  style={styles.input}
                />
                <TextInput
                  value={editDuration}
                  onChangeText={setEditDuration}
                  placeholder="Duration (days)"
                  keyboardType="numeric"
                  style={styles.input}
                />
                <View style={styles.planActions}>
                  <Pressable
                    style={[styles.saveButton, { backgroundColor: theme.accent }]}
                    onPress={handleSaveEdit}
                  >
                    <Text style={styles.buttonText}>Save</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.cancelButton, { backgroundColor: '#999' }]}
                    onPress={() => setEditingPlanId(null)}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </Pressable>
                </View>
              </>
            ) : (
              <>
                <Text style={styles.planTitle}>{item.title}</Text>
                <Text>Duration: {item.durationDays} days</Text>
                <View style={styles.planActions}>
                  <Pressable
                    style={[styles.editButton, { backgroundColor: theme.accent }]}
                    onPress={() => handleEditPlan(item)}
                  >
                    <Text style={styles.buttonText}>Edit</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.deleteButton, { backgroundColor: theme.danger }]}
                    onPress={() => handleDeletePlan(item.id)}
                  >
                    <Text style={styles.buttonText}>Delete</Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        )}
      />
      {!isAdding ? (
        <Pressable
          style={[styles.addButton, { backgroundColor: theme.primary }]}
          onPress={() => setIsAdding(true)}
        >
          <Text style={styles.buttonText}>+ Add Payment Plan</Text>
        </Pressable>
      ) : (
        <View style={styles.addForm}>
          <TextInput
            placeholder="Plan Title"
            value={newTitle}
            onChangeText={setNewTitle}
            style={styles.input}
          />
          <TextInput
            placeholder="Duration (days)"
            value={newDuration}
            onChangeText={setNewDuration}
            keyboardType="numeric"
            style={styles.input}
          />

          <View style={styles.formActions}>
            <Pressable
              style={[styles.saveButton, { backgroundColor: theme.accent }]}
              onPress={handleAddPlan}
            >
              <Text style={styles.buttonText}>Save</Text>
            </Pressable>
            <Pressable
              style={[styles.cancelButton, { backgroundColor: '#999' }]}
              onPress={() => {
                setIsAdding(false);
                setNewTitle('');
                setNewDuration('');
              }}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      )}

      <View style={styles.bottomSpacer} />
    </SafeAreaView>
  );
};

export default ManagePaymentPlansScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  planCard: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  planTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  planActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  editButton: {
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
    flex: 1,
    marginLeft: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  addButton: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addForm: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 12,
    width: '100%',
    textAlign: 'center',
    backgroundColor: '#fff',
    borderRadius: 6,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    flex: 1,
    padding: 10,
    borderRadius: 6,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButton: {
    flex: 1,
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  bottomSpacer: {
    height: 60,
  },
});
