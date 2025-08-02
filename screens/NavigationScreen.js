import React, { useState, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';

const NavigationScreen = ({ route }) => {
  const { selectedMarker } = route.params || {};  
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const getUserLocation = async () => {
      // Request permission to access location
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Unable to access your location.');
        return;
      }

      // Get current location
      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location.coords); 
    };

    getUserLocation();
  }, []); 

  if (!userLocation) {
    // Render loading or waiting state until location is fetched
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!selectedMarker || !selectedMarker.coordinate) {
    // Render an alert or an error message if the selected marker is not provided
    return (
      <View>
        <Text>Error: Selected marker is missing or incorrectly formatted.</Text>
      </View>
    );
  }

  // access latitude and longitude from selectedMarker.coordinate
  const destination = `${selectedMarker.coordinate.latitude},${selectedMarker.coordinate.longitude}`;
  console.log(destination);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        
        <Marker coordinate={userLocation} title="Your Location" />

       
        <Marker
          coordinate={selectedMarker.coordinate}  
          title="Selected Marker"
        />

        
        <MapViewDirections
          origin={userLocation}  
          destination={destination} 
          apikey="AIzaSyBIoDHTdghaj9sKOnYbJv4sOpOQ1mEkBcM"  
          strokeWidth={3}
          strokeColor="blue"
        />
      </MapView>
    </View>
  );
};

export default NavigationScreen;
