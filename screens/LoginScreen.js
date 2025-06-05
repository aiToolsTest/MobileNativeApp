import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Image } from 'react-native';
import { useUser } from '../context/UserContext';
import { loginUser, fetchAccounts } from '../src/services/apiService';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { LIGHT_YELLOW, PRIMARY_BLUE } from '../src/constants/colors';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('kasi.muppina@example.com');
  const [password, setPassword] = useState('Test123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser, setAccounts } = useUser();

  const handleLogin = async () => {
    setError('');
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    setLoading(true);
    try {
      console.log('🔐 Logging in...');
      const userData = await loginUser(email, password);
      const { userId, fullName } = userData;
      setUser({ userId, fullName });
      console.log('📡 Fetching accounts for userId:', userId);
      const accounts = await fetchAccounts(userId);
      setAccounts(accounts);
      console.log('✅ Login and account fetch successful.');
    } catch (err) {
      setError('Invalid email or password');
      console.error('❌ Login/account fetch error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../assets/a1.png')}
          style={{ width: 90, height: 90, alignSelf: 'center', marginBottom: 16 }}
          resizeMode="contain"
        />
        <Text style={styles.title}>Welcome to Lorington</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>
      </View>
      
      <View style={styles.form}>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#999"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            placeholderTextColor="#999"
          />
          <TouchableOpacity 
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <MaterialCommunityIcons 
              name={showPassword ? 'eye' : 'eye-off'} 
              size={20} 
              color="#666" 
            />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
        
        
        <TouchableOpacity 
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginButtonText}>Sign In</Text>
          )}
        </TouchableOpacity>
        
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity onPress={handleRegister}>
            <Text style={styles.signupLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LIGHT_YELLOW,
  },
  header: {
    padding: 30,
    paddingTop: 80,
    paddingBottom: 40,
    backgroundColor: LIGHT_YELLOW,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: PRIMARY_BLUE,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: PRIMARY_BLUE,
  },
  form: {
    padding: 30,
    marginTop: -20,
  },
  errorText: {
    color: '#e63946',
    marginBottom: 16,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  input: {
    flex: 1,
    height: 56,
    color: PRIMARY_BLUE,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 10,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: PRIMARY_BLUE,
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: LIGHT_YELLOW,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    elevation: 2,
  },
  loginButtonText: {
    color: PRIMARY_BLUE,
    fontSize: 16,
    fontWeight: '600',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  signupText: {
    color: '#6c757d',
  },
  signupLink: {
    color: PRIMARY_BLUE,
    fontWeight: '600',
  }
});

export default LoginScreen;
