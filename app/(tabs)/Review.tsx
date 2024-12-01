import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
} from 'react-native';

export default function ReviewPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [restaurants, setRestaurants] = useState([
    { id: '1', name: 'The Great Indian Dhaba' },
    { id: '2', name: 'Sushi World' },
    { id: '3', name: 'Pasta Fiesta' },
    { id: '4', name: 'Burger Palace' },
    { id: '5', name: 'Curry Kingdom' },
  ]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<null | { id: string; name: string }>(null);
  const [ratings, setRatings] = useState({
    staff: 0,
    food: 0,
    ambience: 0,
    ordering: 0,
  });
  const [comment, setComment] = useState('');

  const restaurantImages: { [key: string]: any } = {
    '1': require('../../assets/images/restaurants/indian.jpeg'),
    '2': require('../../assets/images/restaurants/sushi.jpeg'),
    '3': require('../../assets/images/restaurants/pasta.jpeg'),
    '4': require('../../assets/images/restaurants/burger.jpeg'),
    '5': require('../../assets/images/restaurants/curry.jpeg'),
  };


  const handleRatingChange = (category: string, value: number) => {
    setRatings({ ...ratings, [category]: value });
  };

  const handleSubmit = () => {
    Alert.alert('Review Submitted', 'Thank you for your feedback!');
    setSelectedRestaurant(null); // Reset to show the restaurant list
    setRatings({ staff: 0, food: 0, ambience: 0, ordering: 0 }); // Reset ratings
    setComment(''); // Clear the comment box
  };

  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedRestaurant) {
    return (
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity onPress={() => setSelectedRestaurant(null)} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        {/* Restaurant Review Form */}
        <Text style={styles.title}>{selectedRestaurant?.name || ''}</Text>
        <Text style={styles.subheading}>Rate and Review</Text>

        {/* Rating Sections */}
        {['staff', 'food', 'ambience', 'ordering'].map((category) => (
          <View key={category} style={styles.ratingSection}>
            <Text>
              {category === 'staff'
                ? 'Friendly Staff'
                : category === 'food'
                ? 'Food'
                : category === 'ambience'
                ? 'Ambience/Lighting'
                : 'Ease of Ordering'}
              :
            </Text>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => handleRatingChange(category, star)}
                >
                  <Text style={ratings[category as keyof typeof ratings] >= star ? styles.starFilled : styles.star}>
                    ★
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <TextInput
          style={styles.commentBox}
          placeholder="Write your comments here..."
          value={comment}
          onChangeText={setComment}
          multiline={true}
        />
        <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search restaurants..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Text style={styles.title}>Recently Visited</Text>
      <FlatList
        data={filteredRestaurants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.restaurantItem}>
            {/* Restaurant Image */}
            <Image
              source={restaurantImages[item.id]}
              style={styles.restaurantImage}
            />
            {/* Restaurant Details */}
            <View style={styles.restaurantDetails}>
              <Text style={styles.restaurantName}>{item.name}</Text>
              <TouchableOpacity
                style={styles.reviewButton}
                onPress={() => setSelectedRestaurant(item)}
              >
                <Text style={styles.reviewButtonText}>Review</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007BFF',
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subheading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  restaurantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  restaurantImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },
  restaurantDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  restaurantName: {
    fontSize: 18,
    marginBottom: 8,
  },
  reviewButton: {
    backgroundColor: '#007BFF',
    padding: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  reviewButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  ratingSection: {
    marginBottom: 16,
  },
  stars: {
    flexDirection: 'row',
  },
  star: {
    fontSize: 24,
    color: '#ccc',
    marginHorizontal: 4,
  },
  starFilled: {
    fontSize: 24,
    color: '#FFD700',
    marginHorizontal: 4,
  },
  commentBox: {
    height: 80,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  submitButton: {
    backgroundColor: '#007BFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});