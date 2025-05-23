import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useGlobalContext } from '../context/globalContext';

const AddEquipmentScreen = ({ navigation }) => {
  const { currentUser, paymentPlans } = useGlobalContext();
  const [selectedPlanIds, setSelectedPlanIds] = useState<string[]>([]);
  const equipmentList = currentUser?.equipmentList ?? [];

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [imageError, setImageError] = useState('');

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
    if (!name || !price) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    if (isNaN(Number(price)) || Number(price) <= 0) {
      Alert.alert('Error', 'Price must be a positive number.');
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

    const existingNames = currentUser?.equipmentList?.map(item => item.name.toLowerCase().trim()) || [];
    const newName = name.toLowerCase().trim();

    if (existingNames.includes(newName)) {
      Alert.alert('Error', 'An equipment with this name already exists. Please use a unique name.');
      return;
    }

    const newItem = {
      id: Math.random().toString(36).substring(2, 9),
      name: name.trim(),
      price,
      paymentPlanIds: selectedPlanIds,
      description,
      images,
      status: 'Renting',
    };

    navigation.navigate('ShopkeeperDashboard', {
      newEquipment: newItem,
    });

    setName('');
    setPrice('');
    setDescription('');
    setImages([]);
    setImageError('');
    setSelectedPlanIds([]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.formTitle}>Add New Equipment</Text>

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
              {images.length > 0 ? 'Add More' : 'Tap to upload'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Equipment Name*"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Rent Price (₱)*"
        value={price}
        onChangeText={setPrice}
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
              <Text>{plan.durationDays} days</Text>
              {selectedPlanIds.includes(plan.id) && (
                <View style={styles.checkIcon}>
                  <Text>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <TextInput
        style={[styles.input, styles.descriptionInput]}
        placeholder="Description (optional)"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.submitButton]}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>Add Equipment</Text>
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

export default AddEquipmentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    paddingBottom: 80,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
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
    overflow: 'hidden',
  },
  imageUploadError: {
    borderColor: 'red',
    backgroundColor: '#ffeeee',
  },
  imageContainer: {
    position: 'relative',
    marginRight: 10,
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
  imageThumbnail: {
    width: 130,
    height: 130,
    borderRadius: 8,
    marginHorizontal: 5,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  uploadText: {
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  descriptionInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
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
  plansContainer: {
    marginBottom: 15,
    maxHeight: 200,
  },
  plansScroll: {
    flexGrow: 0,
  },
  plansScrollContent: {
    paddingBottom: 15,
  },
});