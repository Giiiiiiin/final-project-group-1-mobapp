import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useGlobalContext } from '../context/globalContext';

const UpdateEquipmentScreen = ({ navigation, route }) => {
  const { currentUser, updateUserEquipment, paymentPlans } = useGlobalContext();
  const [selectedPlanIds, setSelectedPlanIds] = useState<string[]>([]);
  const [images, setImages] = useState([]);
  const [imageError, setImageError] = useState('');
  const [form, setForm] = useState({
    id: '',
    name: '',
    price: '',
    description: '',
    status: 'Renting',
  });

  useEffect(() => {
    if (route.params?.equipment) {
      const { id, name, price, description, images, status, paymentPlanIds } = route.params.equipment;
      setForm({ 
        id, 
        name, 
        price, 
        description: description || '',
        status: status || 'Renting'
      });
      setSelectedPlanIds(paymentPlanIds || []);
      setImages(images || []);
    }
  }, [route.params]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
    });

    if (!result.canceled) {
      const newImages = result.assets.map(asset => asset.uri);
      setImages(prev => [...prev, ...newImages]);
      setImageError('');
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!form.name || !form.price) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (isNaN(Number(form.price)) || Number(form.price) <= 0) {
      Alert.alert('Error', 'Price must be a positive number');
      return;
    }

    if (images.length === 0) {
      setImageError('Equipment image is required');
      Alert.alert('Error', 'Please upload at least one equipment image');
      return;
    }

    if (selectedPlanIds.length === 0) {
      Alert.alert('Error', 'Please select at least one payment plan');
      return;
    }

    const existingNames = currentUser?.equipmentList
      ?.filter(item => item.id !== form.id)
      ?.map(item => item.name.toLowerCase().trim()) || [];
    
    const newName = form.name.toLowerCase().trim();
    
    if (existingNames.includes(newName)) {
      Alert.alert('Error', 'An equipment with this name already exists. Please use a unique name.');
      return;
    }

    const updatedItem = {
      ...form,
      name: form.name.trim(),
      images,
      paymentPlanIds: selectedPlanIds,
    };

    const updatedList = currentUser?.equipmentList?.map(item =>
      item.id === form.id ? updatedItem : item
    ) || [];

    updateUserEquipment(currentUser.id, updatedList);
    navigation.navigate('ShopkeeperDashboard');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.formTitle}>Update Equipment</Text>

      <View style={[styles.imageUploadButton, imageError && styles.imageUploadError]}>
        <ScrollView
          horizontal
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsHorizontalScrollIndicator={false}
        >
          {images.map((uri, index) => (
            <TouchableOpacity
              key={index}
              style={styles.imageContainer}
              onPress={() => removeImage(index)}
            >
              <Image source={{ uri }} style={styles.imageThumbnail} />
              <View style={styles.removeImageButton}>
                <Text style={styles.removeImageText}>×</Text>
              </View>
            </TouchableOpacity>
          ))}
          <TouchableOpacity 
            style={styles.uploadPlaceholder} 
            onPress={pickImage}
          >
            <Text style={styles.uploadText}>
              {images.length > 0 ? 'Add more' : 'Tap to upload'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      {imageError && <Text style={styles.errorText}>{imageError}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Equipment Name"
        value={form.name}
        onChangeText={(text) => setForm({ ...form, name: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Rent Price (₱)"
        value={form.price}
        onChangeText={(text) => setForm({ ...form, price: text })}
        keyboardType="numeric"
      />

      <View style={styles.plansContainer}>
        <Text style={styles.sectionTitle}>Available Payment Plans*</Text>
        <ScrollView
          style={styles.plansScroll}
          contentContainerStyle={styles.plansScrollContent}
        >
          {paymentPlans.map(plan => (
            <TouchableOpacity
              key={plan.id}
              style={[
                styles.planItem,
                selectedPlanIds.includes(plan.id) && styles.selectedPlan
              ]}
              onPress={() => {
                setSelectedPlanIds(prev => 
                  prev.includes(plan.id)
                    ? prev.filter(id => id !== plan.id)
                    : [...prev, plan.id]
                );
              }}
            >
              <Text style={styles.planTitle}>{plan.title}</Text>
              <Text>{plan.durationDays} days - ₱{plan.cost}</Text>
              {selectedPlanIds.includes(plan.id) && (
                <View style={styles.checkIcon}>
                  <Text style={styles.checkIconText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <TextInput
        style={[styles.input, styles.descriptionInput]}
        placeholder="Description (optional)"
        value={form.description}
        onChangeText={(text) => setForm({ ...form, description: text })}
        multiline
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.submitButton]}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>Update Equipment</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.cancelButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UpdateEquipmentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  imageUploadButton: {
    height: 150,
    backgroundColor: '#eee',
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    color: '#666',
  },
  imageUploadError: {
    borderColor: 'red',
    backgroundColor: '#ffeeee',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 10,
    alignItems: 'center',
    gap: 10,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 10,
  },
  imageThumbnail: {
    width: 130,
    height: 130,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    right: 5,
    top: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeImageText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
  },
  descriptionInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
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
    backgroundColor: '#1B1F23',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  uploadPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 130,
    height: 130,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f8f8f8',
  },
  plansContainer: {
    marginBottom: 15,
    maxHeight: 200,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  planItem: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedPlan: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196F3',
  },
  planTitle: {
    fontWeight: '500',
    marginBottom: 4,
  },
  checkIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
    backgroundColor: '#2196F3',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkIconText: {
    color: 'white',
    fontWeight: 'bold',
  },
});