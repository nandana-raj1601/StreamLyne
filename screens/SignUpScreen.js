import React, { useState } from 'react';
import { TextInput, Button, View, Text, StyleSheet, Alert } from 'react-native';
import { supabase } from '../supabaseClient';

const SignUp = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSignUp = async () => {
    setError('');
    setSuccessMessage('');

    try {
      // Step 1: Sign up the user
      const { error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (signUpError) {
        setError('Error signing up: ' + signUpError.message);
        return;
      }

      // Step 2: Inform user to confirm their email
      /*setSuccessMessage('Sign-up successful! Please check your email to confirm your account.');*/

      // Step 3: Insert user data into the `public.users` table after confirmation
      const userResponse = await supabase.auth.getUser();
      const user = userResponse.data.user;

      if (user) {
        const { error: insertError } = await supabase
          .from('users')
          .insert([{ id: user.id, email: user.email, name: name }]);

        if (insertError) {
          setError('Error inserting user details: ' + insertError.message);
          return;
        }

        Alert.alert('Success', 'Sign-up complete! Please log in.');
        navigation.navigate('Login');
      } else {
        setError('Please confirm your email to complete sign-up.');
      }
    } catch (err) {
      setError('Unexpected error: ' + err.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Sign Up" onPress={handleSignUp} />

      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      {successMessage && <Text style={{ color: 'green' }}>{successMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
});

export default SignUp;
