import React, { useState } from 'react';
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

const AddEquipmentScreen = ({ navigation }) => {
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

  const handleSubmit = (values, { resetForm }) => {
    if (images.length === 0) {
  setImageError('Equipment image is required');
  Alert.alert('Error', 'Please upload at least one equipment image');
  return false;
}

    navigation.navigate('Shopkeeper Dashboard', {
  newEquipment: {
    id: Math.random().toString(36).substring(2, 9),
    images: images, // Use the state variable directly
    ...values
  }
});
    
    resetForm();
   // setImageUri(null);
    setImageError('');
    return true;
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.formTitle}>Add New Equipment</Text>
      
      <Formik
        initialValues={{
          name: '',
          price: '',
          plan: '',
          description: '',
        }}
        validationSchema={equipmentSchema}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, resetForm }) => (
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
                onPress={() => {
                  resetForm();
                 // setImageUri(null);
                  navigation.goBack();
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.submitButton]}
                onPress={handleSubmit}
              >
                <Text style={styles.buttonText}>Add Equipment</Text>
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
  borderWidth: 1,
  borderColor: '#ddd',
  overflow: 'hidden', // Add this
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
  imageContainer: {
    position: 'relative',
    marginRight: 10,
  },
  uploadPlaceholder: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100%',
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
imageThumbnail: {
  width: 130, // Slightly reduced for better fit
  height: 130,
  borderRadius: 8,
  marginHorizontal: 5, // Changed from marginRight
},
scrollContainer: {
  flex: 1,
  width: '100%',
},
scrollContent: {
   paddingHorizontal: 10,
  alignItems: 'center',
},
scrollView: {
  flex: 1,
},
});

export default AddEquipmentScreen;