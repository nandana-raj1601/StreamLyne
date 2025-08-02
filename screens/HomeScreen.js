import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, Button, Alert, TouchableOpacity, Modal, TextInput } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import * as FileSystem from 'expo-file-system';
import { MaterialIcons } from '@expo/vector-icons';
import { supabase } from '../supabaseClient'; 

const HomeScreen = ({ assets }) => {
  const navigation = useNavigation();
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [selectedLayers, setSelectedLayers] = useState({
    borewells: false,
    pumpingStations: false,
    valves: false,
  });
  const [layerData, setLayerData] = useState({
    borewells: [],
    pumpingStations: [],
    valves: [],
  });
  const [nearestSources, setNearestSources] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [outbreakModalVisible, setOutbreakModalVisible] = useState(false);
  const [disease, setDisease] = useState('');
  const [description, setDescription] = useState('');
  const mapRef = React.useRef(null);

  const goToCurrentLocation = () => {
    console.log("goToCurrentLocation called");
    if (!location) {
      Alert.alert('Error', 'Current location not available');
      return;
    }
  
    mapRef.current.animateToRegion({
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    });
  };

  const loadGeoJsonFile = async (layerKey, fileUri) => {
    try {
      console.log("loadgeojsonfile called");
      const fileContent = await FileSystem.readAsStringAsync(fileUri);
      const geoJson = JSON.parse(fileContent);

      if (geoJson.features && Array.isArray(geoJson.features)) {
        setLayerData((prevData) => ({
          ...prevData,
          [layerKey]: geoJson.features,
        }));
      } else {
        throw new Error('Invalid GeoJSON format');
      }
    } catch (error) {
      console.error(`Error loading ${layerKey} GeoJSON file:`, error);
      setErrorMsg(`Failed to load ${layerKey} data`);
    }
  };

  const handleLayerToggle = async (layerKey) => {
    console.log("handleLayerToggle called");
    setSelectedLayers((prevState) => {
      const newSelectedLayers = {
        ...prevState,
        [layerKey]: !prevState[layerKey],
      };
      if (newSelectedLayers[layerKey] && !layerData[layerKey].length) {
        loadGeoJsonFile(layerKey, assets[layerKey]);
      }
      return newSelectedLayers;
    });
  };

  const [optionsModalVisible, setOptionsModalVisible] = useState(false);

const handleMarkerPress = (marker) => {
  console.log("handlemarkerpress called");
  setSelectedMarker(marker); 
  setOptionsModalVisible(true); 
};

const [leaveReviewModalVisible, setLeaveReviewModalVisible] = useState(false);
const [reviewText, setReviewText] = useState('');

const submitReview = async () => {
  if (!reviewText || !selectedMarker) {
    Alert.alert('Error', 'Please write a review before submitting');
    return;
  }

  try {
    console.log("submitReview called");
    // Extract coordinates from the selected marker
    const { latitude, longitude } = selectedMarker.coordinate;
    console.log("Selected Marker Coordinates:", latitude, longitude);

    // Log the current authenticated user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error('Error fetching session:', sessionError);
      Alert.alert('Error', 'Failed to fetch session');
      return;
    }

    // Check if session exists and user is authenticated
    if (!session || !session.user) {
      Alert.alert('Error', 'You need to be logged in to submit a review');
      return;
    }

    const userId = session.user.id; 
    const userEmail=session.user.email;
    console.log("User ID:", userId);
    console.log("User Email:", userEmail);

    // Insert the review into the database
    const { data, error } = await supabase.from('reviews').insert([
      {
        review: reviewText,
        latitude,
        longitude,
        user_id: userId, // Pass user ID correctly
        user_email: userEmail
      },
    ]);

    if (error) throw error;

    Alert.alert('Success', 'Review submitted successfully!');
    setLeaveReviewModalVisible(false);
    setReviewText(''); // Clear the review text after submission
  } catch (error) {
    console.error('Error submitting review:', error);
    Alert.alert('Error', 'Failed to submit review');
  }
};


  const reportOutbreak = async () => {
    if (!disease || !description || !selectedMarker) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      
      const { latitude, longitude } = selectedMarker.coordinate;

      // Save outbreak data to the database
      const { data, error } = await supabase.from('outbreaks').insert([
        { disease, description, latitude, longitude },
      ]);

      if (error) throw error;

      Alert.alert('Success', 'Outbreak reported successfully!');
      setOutbreakModalVisible(false);
    } catch (error) {
      console.error('Error reporting outbreak:', error);
      Alert.alert('Error', 'Failed to report outbreak');
    }
  };

  const showNearestSources = () => {
    if (!location) {
      Alert.alert('Error', 'Current location not available');
      return;
    }

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371; // Radius of Earth in km
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c; // Distance in km
    };

    const allFeatures = Object.values(layerData).flat();
    const distances = allFeatures.map((feature) => {
      const [lon, lat] = feature.geometry.coordinates;
      return {
        feature,
        distance: calculateDistance(location.latitude, location.longitude, lat, lon),
      };
    });

    const sortedDistances = distances.sort((a, b) => a.distance - b.distance).slice(0, 5);
    setNearestSources(sortedDistances.map((item) => item.feature));

    if (sortedDistances.length > 0) {
      const [closestLon, closestLat] = sortedDistances[0].feature.geometry.coordinates;
      mapRef.current.animateToRegion({
        latitude: closestLat,
        longitude: closestLon,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation.coords);
      } catch (error) {
        setErrorMsg('Failed to initialize the application');
        console.error('Initialization error:', error);
      }
    })();
  }, []);

  if (!location && !errorMsg) {
    return (
      <View style={styles.container}>
        <Text>Loading your location...</Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{errorMsg}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: location?.latitude || 12.9716,
          longitude: location?.longitude || 77.5946,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
      >
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="You are here"
          description="Your current location"
        />
        {Object.entries(layerData).map(([layerKey, features]) =>
          selectedLayers[layerKey]
            ? features.map((feature, index) => {
                const [lon, lat] = feature.geometry.coordinates;
                return (
                  <Marker
                    key={`${layerKey}-${index}`}
                    coordinate={{ latitude: lat, longitude: lon }}
                    title={feature.properties?.name || 'Unknown'}
                    onPress={() => handleMarkerPress({ coordinate: { latitude: lat, longitude: lon } })}
                  />
                );
              })
            : null
        )}
        {/* Nearest Water Sources */}
        {nearestSources.map((feature, index) => {
          const [lon, lat] = feature.geometry.coordinates;
          return (
            <Marker
              key={`nearest-${index}`}
              coordinate={{ latitude: lat, longitude: lon }}
              title={feature.properties?.name || 'Nearby Source'}
              pinColor="green"
            />
          );
        })}
      </MapView>
      <Modal visible={optionsModalVisible} animationType="slide" transparent={true}>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}>
      <Text style={styles.modalTitle}>Choose an Action</Text>

      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => {
          setOptionsModalVisible(false);
          setOutbreakModalVisible(true); // Show outbreak modal
        }}
      >
        <Text style={styles.optionButtonText}>Report Outbreak</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => {
          setOptionsModalVisible(false);
          setLeaveReviewModalVisible(true); // Show review modal
        }}
      >
        <Text style={styles.optionButtonText}>Leave a Review</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => {
          setOptionsModalVisible(false);
          navigation.navigate('ReviewsScreen', { marker: selectedMarker }); // Navigate to reviews screen
        }}
      >
        <Text style={styles.optionButtonText}>See Reviews</Text>
      </TouchableOpacity>

        <TouchableOpacity
    style={styles.optionButton}
    onPress={() => {
      navigation.navigate('NavigationScreen', { selectedMarker: selectedMarker });
    }}
  >
    <Text style={styles.optionButtonText}>Take me here!</Text>
  </TouchableOpacity>


      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => setOptionsModalVisible(false)}
      >
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

<Modal visible={leaveReviewModalVisible} animationType="slide" transparent={true}>
  <View style={styles.modalContainer}>
    <Text style={styles.modalTitle}>Leave a Review</Text>
    <TextInput
      style={[styles.input, { height: 80 }]}
      placeholder="Write your review here..."
      value={reviewText}
      onChangeText={setReviewText}
      multiline
    />
    <Button title="Submit" onPress={submitReview} />
    <Button
      title="Cancel"
      onPress={() => setLeaveReviewModalVisible(false)}
      color="#B2B2B2"
    />
  </View>
</Modal>

      <TouchableOpacity style={styles.currentLocationButton} onPress={goToCurrentLocation}>
        <MaterialIcons name="my-location" size={30} color="#5576D9" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.statsButton} onPress={() => navigation.navigate('StatisticsScreen')}>
        <MaterialIcons name="auto-graph" size={30} color="#5576D9" />
        </TouchableOpacity>


      <View style={styles.nearestbutton}>
        <Button title="Show Nearest Sources" color="#6A7C5F" onPress={showNearestSources} />
      </View>

      <View style={styles.layerButtonsContainer}>
        {Object.keys(assets).map((layerKey) => (
          <Button
            key={layerKey}
            color="#5576D9"
            title={`${selectedLayers[layerKey] ? 'Hide' : 'Show'} ${layerKey}`}
            onPress={() => handleLayerToggle(layerKey)}
          />
        ))}
      </View>

      {/* Report Outbreak Modal */}
      <Modal visible={outbreakModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Report Disease Outbreak</Text>
          <TextInput
            style={styles.input}
            placeholder="Disease Name"
            value={disease}
            onChangeText={setDisease}
          />
          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            multiline
          />
          <Button title="Report" onPress={reportOutbreak} />
          <Button title="Cancel" onPress={() => setOutbreakModalVisible(false)} color="#B2B2B2" />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  map: { ...StyleSheet.absoluteFillObject },
  error: { color: 'red' },
  layerButtonsContainer: { position: 'absolute', top: 50, left: 10 },
  currentLocationButton: {
    position: 'absolute',
    bottom: 30,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 10,
    elevation: 3,
  },
  nearestbutton: { position: 'absolute', top: 10, left: 10 },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: 'white' },
  input: {
    height: 40,
    width: 200,
    marginBottom: 10,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    backgroundColor: 'white',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  modalContainer: {
    width: 280,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  optionButton: {
    width: '100%',
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#007BFF', 
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: 12,
    backgroundColor: '#B2B2B2',
    borderRadius: 5,
    marginTop: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  statsButton: {
    position: 'absolute',
    bottom: 80,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 10,
    elevation: 3,
  }
});

export default HomeScreen;


