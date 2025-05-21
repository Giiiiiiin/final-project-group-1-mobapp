import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Image, ScrollView } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import * as ImagePicker from 'expo-image-picker';

const equipmentSchema = yup.object().shape({
  name: yup.string().required('Equipment name is required'),
  price: yup
    .number()
    .typeError('Price must be a number')
    .positive('Price must be positive')
    .required('Price is required'),
  plan: yup.string().required('Payment plan is required'),
  description: yup.string()
});

const UpdateEquipmentScreen = ({ navigation, route }) => {
  const [images, setImages] = useState([]);
  const [imageError, setImageError] = useState('');
  const [initialValues, setInitialValues] = useState({
    name: '',
    price: '',
    plan: '',
    description: '',
  });

  useEffect(() => {
    if (route.params?.equipment) {
      const { images, image, ...rest } = route.params.equipment;
      setInitialValues(rest);
      setImages(images || (image ? [image] : []));
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

  const handleSubmit = (values) => {
    if (images.length === 0) {
      setImageError('Equipment image is required');
      Alert.alert('Error', 'Please upload at least one equipment image');
      return false;
    }

    navigation.navigate('Shopkeeper Dashboard', {
      updatedEquipment: {
        id: route.params.equipment.id,
        images: images,
        ...values
      }
    });
    
    return true;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.formTitle}>Update Equipment</Text>
      
      <Formik
        initialValues={initialValues}
        validationSchema={equipmentSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <>
            <View style={[
              styles.imageUploadButton,
              imageError && styles.imageUploadError
            ]}>
              {images.length > 0 ? (
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
                      <Image 
                        source={{ uri }} 
                        style={styles.imageThumbnail}
                      />
                      <View style={styles.removeImageButton}>
                        <Text style={styles.removeImageText}>×</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              ) : (
                <TouchableOpacity 
                  style={styles.uploadPlaceholder}
                  onPress={pickImage}
                >
                  <Text style={styles.uploadText}>
                    {imageError ? 'Image required - Tap to upload' : 'Tap to upload equipment images'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            {imageError && (
              <Text style={styles.errorText}>{imageError}</Text>
            )}

            {/* Rest of your form inputs remain exactly the same */}
            <TextInput
              style={styles.input}
              placeholder="Equipment Name"
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
            />
            {touched.name && errors.name && (
              <Text style={styles.errorText}>{errors.name}</Text>
            )}
            
            <TextInput
              style={styles.input}
              placeholder="Rent Price (₱)"
              onChangeText={handleChange('price')}
              onBlur={handleBlur('price')}
              value={values.price}
              keyboardType="numeric"
            />
            {touched.price && errors.price && (
              <Text style={styles.errorText}>{errors.price}</Text>
            )}

            <TextInput
              style={styles.input}
              placeholder="Set Payment Plan"
              onChangeText={handleChange('plan')}
              onBlur={handleBlur('plan')}
              value={values.plan}
              keyboardType="default"
            />
            {touched.plan && errors.plan && (
              <Text style={styles.errorText}>{errors.plan}</Text>
            )}
            
            <TextInput
              style={[styles.input, styles.descriptionInput]}
              placeholder="Description (optional)"
              onChangeText={handleChange('description')}
              onBlur={handleBlur('description')}
              value={values.description}
              multiline
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.cancelButton]}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.submitButton]}
                onPress={handleSubmit}
              >
                <Text style={styles.buttonText}>Update Equipment</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </Formik>
    </View>
  );
};

// Keep all your existing styles exactly the same
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
  },
  imageUploadButton: {
    height: 150,
    backgroundColor: '#eee',
    borderRadius: 8,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  uploadText: {
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    marginBottom: 5,
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
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 5,
  },
  imageUploadError: {
    borderColor: 'red',
    backgroundColor: '#ffeeee'
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  uploadPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  imageThumbnail: {
    width: 130,
    height: 130,
    borderRadius: 8,
    marginHorizontal: 5,
  },

});

export default UpdateEquipmentScreen;