import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image } from 'react-native';
import { supabase } from '../supabaseClient'; // Import supabase client
import { PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';


const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    // Simple form validation
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in both fields');
      return;
    }

    try {
      // Using signInWithPassword instead of signIn
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Navigate to the home screen or dashboard after successful login
      Alert.alert('Success', 'Login successful');
      navigation.navigate('HomeScreen');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>StreamLyne</Text>
      <Image source={require('../assets/Logo.png')} style={styles.logo} />

      { /* <Text style={styles.title}>Login</Text> */}

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title="Login" color={"#5576D9"} onPress={handleLogin} />

      <Text
        style={styles.signupText}
        onPress={() => navigation.navigate('SignUp')}
      >
        Don't have an account? Sign up
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  logo: {
    width: 200, // Adjust size as needed
    height: 200, // Adjust size as needed
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 8,
  },
  signupText: {
    marginTop: 20,
    color: 'blue',
  },
  heading: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 30,
  }
});

export default LoginScreen;
