import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  Image,
  Dimensions,
  ScrollView,
  Pressable,
} from 'react-native';
import { useGlobalContext } from '../context/globalContext';
import { useNavigation } from '@react-navigation/native';
import BottomSpacer from '../components/BottomSpacer';

const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth - 30) / 2;

const categories = ['Knife', 'Polearm', 'Longsword', 'Armor', 'Shield', 'Other'];

const RenterDashboardScreen = () => {
  const { currentUser, users } = useGlobalContext();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const availableEquipment = users
    .filter(u => u.role === 'shopkeeper')
    .flatMap(u => u.equipmentList || []);

  const currentRentals = currentUser?.currentlyBorrowedList || [];

  const filteredEquipment = availableEquipment.filter(item => {
    const query = searchQuery.toLowerCase();

    const matchesQuery =
      item.name.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query) ||
      item.categories?.some(cat => cat.toLowerCase().includes(query));

    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.some(cat =>
        item.categories?.map(c => c.toLowerCase()).includes(cat.toLowerCase())
      );

    return matchesQuery && matchesCategory;
  });

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={currentRentals}
        keyExtractor={item => item.id}
        numColumns={2}
        ListHeaderComponent={
          <View style={styles.container}>
            <Text style={styles.title}>Welcome, Renter!</Text>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Available Equipment</Text>
              <TextInput
                placeholder="Search equipment..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchBar}
              />

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginBottom: 10 }}
                contentContainerStyle={{ paddingHorizontal: 4 }}
              >
                {categories.map((category) => (
                  <Pressable
                    key={category}
                    onPress={() => toggleCategory(category)}
                    style={[
                      styles.categoryChip,
                      selectedCategories.includes(category) && styles.categoryChipSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        selectedCategories.includes(category) && styles.categoryChipTextSelected,
                      ]}
                    >
                      {category}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>

              <FlatList
                data={filteredEquipment}
                keyExtractor={item => item.id}
                numColumns={2}
                renderItem={({ item }) => (
                  <View style={[styles.card, { width: cardWidth }]}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
                      {item.images?.map((imgUri, idx) => (
                        <Image
                          key={idx}
                          source={{ uri: imgUri }}
                          style={styles.carouselImage}
                        />
                      ))}
                    </ScrollView>
                    <View style={styles.cardDetails}>
                      <Text style={styles.gearName}>{item.name}</Text>
                      <Text style={styles.detail}>₱{item.price}/{item.plan}</Text>
                      <Text style={styles.detail}>Category: {(item.categories || []).join(', ')}</Text>
                    </View>
                  </View>
                )}
                contentContainerStyle={{
                  paddingBottom: 100,
                  gap: 10,
                }}
              />
            </View>

            <Text style={styles.sectionTitle}>Your Current Rentals</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.card, { width: cardWidth }]}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.cardDetails}>
              <Text style={styles.gearName}>{item.name}</Text>
              <Text style={styles.detail}>₱{item.price}/{item.plan}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContainer}
        ListFooterComponent={<View style={{ height: 100, backgroundColor: '#fff' }} />}
      />
      <BottomSpacer />
    </View>
  );
};

export default RenterDashboardScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  sectionContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'left',
  },
  searchBar: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  listContainer: {
    gap: 10,
  },
  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    margin: 5,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  cardDetails: {
    padding: 10,
  },
  gearName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  detail: {
    fontSize: 12,
  },
  imageScroll: {
    width: '100%',
    height: 120,
    marginBottom: 8,
  },
  carouselImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginRight: 8,
    resizeMode: 'cover',
  },
  categoryChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  categoryChipSelected: {
    backgroundColor: '#1B1F23',
    borderColor: '#1B1F23',
  },
  categoryChipText: {
    fontSize: 14,
    color: '#333',
  },
  categoryChipTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
