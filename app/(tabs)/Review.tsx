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
  Animated,
  ScrollView,
} from 'react-native';

export default function ReviewPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [restaurants, setRestaurants] = useState([
    { id: '1', name: 'The Great Indian Dhaba', date: 'Visited: 2024-11-01', reviewed: false },
    { id: '2', name: 'Sushi World', date: 'Visited: 2024-11-10', reviewed: false },
    { id: '3', name: 'Pasta Fiesta', date: 'Visited: 2024-11-15', reviewed: false },
    { id: '4', name: 'Burger Palace', date: 'Visited: 2024-11-20', reviewed: false },
    { id: '5', name: 'Curry Kingdom', date: 'Visited: 2024-11-25', reviewed: false },
  ]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<null | { id: string; name: string }>(null);
  const [ratings, setRatings] = useState({
    staff: 0,
    food: 0,
    ambience: 0,
    ordering: 0,
  });
  const [comment, setComment] = useState('');
  const [zoomedStars, setZoomedStars] = useState(new Animated.Value(1)); // For zoom effect

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

  const handleStarHover = () => {
    Animated.spring(zoomedStars, {
      toValue: 1.3,
      friction: 3,
      useNativeDriver: true,
    }).start(() =>
      Animated.spring(zoomedStars, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }).start()
    );
  };

  const handleSubmit = () => {
    Alert.alert('Review Submitted', 'Thank you for your feedback!');
    setRestaurants((prevRestaurants) =>
      prevRestaurants.map((restaurant) =>
        restaurant.id === selectedRestaurant?.id
          ? { ...restaurant, reviewed: true }
          : restaurant
      )
    );
    setSelectedRestaurant(null); // Reset to show the restaurant list
    setRatings({ staff: 0, food: 0, ambience: 0, ordering: 0 }); // Reset ratings
    setComment(''); // Clear the comment box
  };

  const handleEditReview = (restaurant: { id: string; name: string }) => {
    setSelectedRestaurant(restaurant);
    const existingReview = restaurants.find((r) => r.id === restaurant.id);
    if (existingReview) {
      setRatings({
        staff: ratings.staff,
        food: ratings.food,
        ambience: ratings.ambience,
        ordering: ratings.ordering,
      });
      setComment(comment);
    }
  };

  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedRestaurant) {
    return (
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {/* Back Button */}
          <TouchableOpacity onPress={() => setSelectedRestaurant(null)} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>

          {/* Restaurant Image */}
          <Image
            source={restaurantImages[selectedRestaurant.id]}
            style={styles.reviewImage}
          />

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
                    onPressIn={handleStarHover} // Trigger zoom effect
                  >
                    <Animated.Text
                      style={[
                        ratings[category as keyof typeof ratings] >= star
                          ? styles.starFilled
                          : styles.star,
                        { transform: [{ scale: zoomedStars }] },
                      ]}
                    >
                      ★
                    </Animated.Text>
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
      </ScrollView>
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
              <Text style={styles.visitDate}>{item.date}</Text>
            </View>
            <View style={styles.reviewButtonContainer}>
              {item.reviewed ? (
                <>
                  <Text style={styles.reviewedLabel}>Reviewed</Text>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEditReview(item)}
                  >
                    <Text style={styles.editButtonText}>Edit Review</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  style={styles.reviewButton}
                  onPress={() => setSelectedRestaurant(item)}
                >
                  <Text style={styles.reviewButtonText}>Review</Text>
                </TouchableOpacity>
              )}
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
  scrollContainer: {
    paddingBottom: 20,
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
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  visitDate: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  reviewButtonContainer: {
    alignItems: 'flex-end',
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
  reviewedLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'green',
  },
  editButton: {
    backgroundColor: '#FFA500',
    padding: 8,
    borderRadius: 4,
    marginTop: 4,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
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
  reviewImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
});
