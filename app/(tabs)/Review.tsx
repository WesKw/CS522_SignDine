import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
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

  const handleRatingChange = (category: string, value: number) => {
    setRatings({ ...ratings, [category]: value });
  };

  const handleSubmit = () => {
    Alert.alert('Review Submitted', 'Thank you for your feedback!');
    setSelectedRestaurant(null);
    setRatings({ staff: 0, food: 0, ambience: 0, ordering: 0 });
    setComment('');
  };

  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedRestaurant) {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <Text style={styles.title}>{selectedRestaurant?.name || ''}</Text>
        <Text style={styles.subheading}>Rate and Review</Text>
        <View style={styles.ratingSection}>
          <Text>Friendly Staff:</Text>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => handleRatingChange('staff', star)}
              >
                <Text style={ratings.staff >= star ? styles.starFilled : styles.star}>
                  ★
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.ratingSection}>
          <Text>Food:</Text>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => handleRatingChange('food', star)}
              >
                <Text style={ratings.food >= star ? styles.starFilled : styles.star}>
                  ★
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.ratingSection}>
          <Text>Ambience/Lighting:</Text>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => handleRatingChange('ambience', star)}
              >
                <Text style={ratings.ambience >= star ? styles.starFilled : styles.star}>
                  ★
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.ratingSection}>
          <Text>Ease of Ordering:</Text>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => handleRatingChange('ordering', star)}
              >
                <Text style={ratings.ordering >= star ? styles.starFilled : styles.star}>
                  ★
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
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
      </KeyboardAvoidingView>
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
            <Text style={styles.restaurantName}>{item.name}</Text>
            <TouchableOpacity
              style={styles.reviewButton}
              onPress={() => setSelectedRestaurant(item)}
            >
              <Text style={styles.reviewButtonText}>Review</Text>
            </TouchableOpacity>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  restaurantName: {
    fontSize: 18,
  },
  reviewButton: {
    backgroundColor: '#007BFF',
    padding: 8,
    borderRadius: 4,
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