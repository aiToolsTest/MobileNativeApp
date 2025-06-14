import React, { useState, useEffect } from 'react';
import { View, Text, TextInput as RNTextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Image } from 'react-native';
import { useUser } from '../context/UserContext';
import { loginUser, fetchAccounts } from '../src/services/apiService';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { PRIMARY, ACCENT, NEUTRAL, SEMANTIC } from '../src/constants/colors';
import LinearGradient from 'react-native-linear-gradient';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser, setAccounts } = useUser();
  const [loadingText, setLoadingText] = useState('');

  const handleLogin = async () => {
    setError('');
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    setLoading(true);
    setLoadingText('Authenticating...');
    
    try {
      console.log('🔐 Logging in...');
      
      const userData = await loginUser(email, password);
      const { userId, fullName } = userData;
      setUser({ userId, fullName });
      
      setLoadingText('Fetching accounts...');
      
      console.log('📡 Fetching accounts for userId:', userId);
      const accounts = await fetchAccounts(userId);
      setAccounts(accounts);
      
      setLoadingText('Redirecting to dashboard...');
      console.log('✅ Login and account fetch successful.');
      
      // Short delay to show completed progress before navigation
      setTimeout(() => {
        setLoading(false);
        setLoadingText('');
      }, 500);
    } catch (err) {
      setError('Invalid email or password');
      console.error('❌ Login/account fetch error:', err);
      setLoading(false);
      setLoadingText('');
    }
  };
  
  const handleRegister = () => {
    navigation.navigate('Register');
  };



  return (
    <LinearGradient
      colors={[NEUTRAL.WHITE, NEUTRAL.GRAY_100]}
      style={styles.container}
    >
      <View style={styles.header}>
        <Image
          source={require('../assets/a1.png')}
          style={{ width: 90, height: 90, alignSelf: 'center', marginBottom: 16 }}
          resizeMode="contain"
        />
        <Text style={styles.title}>Welcome to Laurentian</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>
      </View>
      
      <View style={styles.form}>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        
        <View style={styles.inputContainer}>
          <MaterialIcons name="email" size={20} color={NEUTRAL.GRAY_500} style={styles.inputIcon} />
          <RNTextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={NEUTRAL.GRAY_500}
            editable={!loading}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <MaterialIcons name="lock" size={20} color={NEUTRAL.GRAY_500} style={styles.inputIcon} />
          <RNTextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            placeholderTextColor={NEUTRAL.GRAY_500}
            editable={!loading}
          />
          <TouchableOpacity 
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
            disabled={loading}
          >
            <MaterialCommunityIcons 
              name={showPassword ? 'eye' : 'eye-off'} 
              size={20} 
              color={NEUTRAL.GRAY_500} 
            />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.forgotPassword} disabled={loading}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.loginButton, loading && styles.loginButtonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.loginButtonText}>Sign In</Text>
        </TouchableOpacity>
        
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity onPress={handleRegister} disabled={loading}>
            <Text style={styles.signupLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Loading overlay - fixed position */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContent}>
            <ActivityIndicator size="large" color={PRIMARY.MAIN} style={styles.spinner} />
            <Text style={styles.loadingText}>{loadingText}</Text>
          </View>
        </View>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 30,
    paddingTop: 80,
    paddingBottom: 40,
    backgroundColor: 'transparent',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: PRIMARY.MAIN,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: NEUTRAL.GRAY_700,
    textAlign: 'center',
  },
  form: {
    padding: 30,
  },
  errorText: {
    color: SEMANTIC.ERROR,
    marginBottom: 16,
    textAlign: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingContent: {
    backgroundColor: NEUTRAL.WHITE,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: NEUTRAL.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  spinner: {
    marginBottom: 10,
  },
  loadingText: {
    color: PRIMARY.MAIN,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NEUTRAL.WHITE,
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: NEUTRAL.GRAY_300,
    shadowColor: NEUTRAL.BLACK,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 56,
    color: NEUTRAL.GRAY_800,
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
    color: PRIMARY.MAIN,
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: PRIMARY.MAIN,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    elevation: 2,
    shadowColor: NEUTRAL.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: NEUTRAL.WHITE,
    fontSize: 16,
    fontWeight: '600',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  signupText: {
    color: NEUTRAL.GRAY_600,
  },
  signupLink: {
    color: PRIMARY.MAIN,
    fontWeight: '600',
  }
});

export default LoginScreen;
