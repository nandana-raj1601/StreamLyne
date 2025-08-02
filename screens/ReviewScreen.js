import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // For icons
import { supabase } from '../supabaseClient';

const ReviewsScreen = ({ route }) => {
  const { marker } = route.params;
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('latitude', marker.coordinate.latitude)
          .eq('longitude', marker.coordinate.longitude);

        if (error) throw error;
        setReviews(data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [marker]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Loading reviews...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reviews for {marker.properties?.name || 'this location'}</Text>
      {reviews.length === 0 ? (
        <View style={styles.emptyContainer}>
          <FontAwesome name="frown-o" size={48} color="#999" />
          <Text style={styles.emptyText}>No reviews available for this location.</Text>
        </View>
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.reviewCard}>
              <Text style={styles.reviewText}>"{item.review}"</Text>
              <View style={styles.userInfo}>
                <FontAwesome name="user-circle" size={20} color="#007BFF" />
                <Text style={styles.userText}>{item.user_email}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 10,
    fontSize: 18,
    color: '#999',
  },
  reviewCard: {
    backgroundColor: '#ffffff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reviewText: {
    fontSize: 16,
    color: '#444',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#666',
  },
});

export default ReviewsScreen;
