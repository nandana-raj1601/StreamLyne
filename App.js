import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Asset } from 'expo-asset';
import { useFonts } from 'expo-font';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import HomeScreen from './screens/HomeScreen';
import ReviewsScreen from './screens/ReviewScreen';
import NavigationScreen from './screens/NavigationScreen';
import StatisticsScreen from './screens/StatisticsScreen';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';

const Stack = createStackNavigator();

const App = () => {
  const [assets, setAssets] = useState(null);
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_700Bold,
  });

  useEffect(() => {
    (async () => {
      try {
        const borewells = Asset.fromModule(require('./assets/bangalore_borewells.geojson')).downloadAsync();
        const pumpingStations = Asset.fromModule(require('./assets/pumping-stations.geojson')).downloadAsync();
        const valves = Asset.fromModule(require('./assets/bangalore_valves.geojson')).downloadAsync();
        const lake_quality = Asset.fromModule(require('./assets/Bengaluru_Lakes_Water_Quality.csv')).downloadAsync();

        const [borewellsAsset, pumpingStationsAsset, valvesAsset, lake_qualityAsset] = await Promise.all([
          borewells,
          pumpingStations,
          valves,
          lake_quality,
        ]);

        setAssets({
          borewells: borewellsAsset.localUri,
          pumpingStations: pumpingStationsAsset.localUri,
          valves: valvesAsset.localUri,
          lake_quality: lake_qualityAsset.localUri, // Store separately for StatisticsScreen
        });
      } catch (error) {
        console.error('Error preloading assets:', error);
      }
    })();
  }, []);

  if (!fontsLoaded || !assets) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5576D9" />
        <Text style={styles.loadingText}>Loading assets and fonts...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#BBC3F2',
          },
          headerTintColor: '#2924A6',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontFamily: 'PlayfairDisplay_700Bold',
          },
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="HomeScreen">
          {() => <HomeScreen assets={{
            borewells: assets.borewells,
            pumpingStations: assets.pumpingStations,
            valves: assets.valves,
          }} />}
        </Stack.Screen>
        <Stack.Screen name="ReviewsScreen" component={ReviewsScreen} />
        <Stack.Screen name="NavigationScreen" component={NavigationScreen} />
        <Stack.Screen 
  name="StatisticsScreen" 
  component={StatisticsScreen} 
  initialParams={{ lakeQualityUri: assets.lake_quality }} 
/>

      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F7FD',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: '#2924A6',
    fontFamily: 'PlayfairDisplay_700Bold',
  },
});

export default App;
