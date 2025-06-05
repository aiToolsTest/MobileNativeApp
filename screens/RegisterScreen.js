import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Input, Button, Card } from '../components';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [step, setStep] = useState(1);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email';
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      } else if (!/^[0-9]{10,15}$/.test(formData.phone)) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    } else if (step === 2) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      
      if (!acceptedTerms) {
        newErrors.terms = 'You must accept the terms and conditions';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const handleNext = () => {
    if (validateForm()) {
      if (step < 2) {
        setStep(step + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigation.goBack();
    }
  };

  const handleSubmit = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to verification screen or dashboard
      navigation.replace('Dashboard');
    }, 1500);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  const toggleTerms = () => {
    setAcceptedTerms(!acceptedTerms);
    if (errors.terms) {
      setErrors({
        ...errors,
        terms: null,
      });
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <LinearGradient
        colors={['#f8f9fa', '#e9ecef']}
        style={styles.background}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={handleBack}
            >
              <Icon name="arrow-back" size={24} color="#4361ee" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create Account</Text>
            <View style={styles.stepIndicator}>
              <Text style={styles.stepText}>Step {step} of 2</Text>
            </View>
          </View>
          
          {/* Progress Bar */}
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(step / 2) * 100}%` }
              ]} 
            />
          </View>
          
          {/* Form */}
          <Card style={styles.card}>
            <View style={styles.cardContent}>
              {step === 1 ? (
                <>
                  <Text style={styles.sectionTitle}>Personal Information</Text>
                  <Text style={styles.sectionSubtitle}>
                    Please provide your personal details to create an account.
                  </Text>
                  
                  <Input
                    label="First Name"
                    placeholder="John"
                    value={formData.firstName}
                    onChangeText={(text) => handleChange('firstName', text)}
                    error={errors.firstName}
                    autoCapitalize="words"
                    left={<Icon name="person-outline" size={20} color="#666" />}
                    containerStyle={styles.inputContainer}
                  />
                  
                  <Input
                    label="Last Name"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChangeText={(text) => handleChange('lastName', text)}
                    error={errors.lastName}
                    autoCapitalize="words"
                    left={<Icon name="person-outline" size={20} color="#666" />}
                    containerStyle={styles.inputContainer}
                  />
                  
                  <Input
                    label="Email Address"
                    placeholder="john.doe@example.com"
                    value={formData.email}
                    onChangeText={(text) => handleChange('email', text)}
                    error={errors.email}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    left={<Icon name="email" size={20} color="#666" />}
                    containerStyle={styles.inputContainer}
                  />
                  
                  <Input
                    label="Phone Number"
                    placeholder="(123) 456-7890"
                    value={formData.phone}
                    onChangeText={(text) => handleChange('phone', text.replace(/[^0-9]/g, ''))}
                    error={errors.phone}
                    keyboardType="phone-pad"
                    maxLength={15}
                    left={<Icon name="phone" size={20} color="#666" />}
                    containerStyle={styles.inputContainer}
                    formatText={(text) => {
                      // Format as (XXX) XXX-XXXX
                      const cleaned = ('' + text).replace(/\D/g, '');
                      const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
                      if (match) {
                        return !match[2] 
                          ? match[1] 
                          : `(${match[1]}) ${match[2]}${match[3] ? `-${match[3]}` : ''}`;
                      }
                      return text;
                    }}
                  />
                </>
              ) : (
                <>
                  <Text style={styles.sectionTitle}>Account Security</Text>
                  <Text style={styles.sectionSubtitle}>
                    Create a strong password to secure your account.
                  </Text>
                  
                  <Input
                    label="Password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChangeText={(text) => handleChange('password', text)}
                    error={errors.password}
                    secureTextEntry={!isPasswordVisible}
                    left={<Icon name="lock" size={20} color="#666" />}
                    right={
                      <TouchableOpacity onPress={togglePasswordVisibility}>
                        <Icon 
                          name={isPasswordVisible ? 'visibility-off' : 'visibility'} 
                          size={20} 
                          color="#666" 
                        />
                      </TouchableOpacity>
                    }
                    containerStyle={styles.inputContainer}
                  />
                  
                  <Input
                    label="Confirm Password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChangeText={(text) => handleChange('confirmPassword', text)}
                    error={errors.confirmPassword}
                    secureTextEntry={!isConfirmPasswordVisible}
                    left={<Icon name="lock" size={20} color="#666" />}
                    right={
                      <TouchableOpacity onPress={toggleConfirmPasswordVisibility}>
                        <Icon 
                          name={isConfirmPasswordVisible ? 'visibility-off' : 'visibility'} 
                          size={20} 
                          color="#666" 
                        />
                      </TouchableOpacity>
                    }
                    containerStyle={styles.inputContainer}
                  />
                  
                  <View style={styles.termsContainer}>
                    <TouchableOpacity 
                      style={styles.checkboxContainer}
                      onPress={toggleTerms}
                    >
                      <View style={[
                        styles.checkbox,
                        acceptedTerms && styles.checkboxChecked
                      ]}>
                        {acceptedTerms && (
                          <Icon name="check" size={16} color="#fff" />
                        )}
                      </View>
                      <Text style={styles.termsText}>
                        I agree to the <Text style={styles.termsLink}>Terms of Service</Text> and {' '}
                        <Text style={styles.termsLink}>Privacy Policy</Text>
                      </Text>
                    </TouchableOpacity>
                    {errors.terms && (
                      <Text style={styles.errorText}>{errors.terms}</Text>
                    )}
                  </View>
                </>
              )}
              
              <View style={styles.buttonContainer}>
                <Button
                  title={step === 2 ? 'Create Account' : 'Continue'}
                  onPress={handleNext}
                  loading={isLoading}
                  icon={<Icon name={step === 2 ? 'check-circle' : 'arrow-forward'} size={20} color="#fff" />}
                  iconPosition="right"
                  style={styles.button}
                />
                
                <Text style={styles.loginText}>
                  Already have an account?{' '}
                  <Text 
                    style={styles.loginLink}
                    onPress={() => navigation.navigate('Login')}
                  >
                    Sign In
                  </Text>
                </Text>
              </View>
            </View>
          </Card>
          
          {/* Security Info */}
          <View style={styles.securityInfo}>
            <Icon name="security" size={16} color="#6c757d" />
            <Text style={styles.securityText}>
              Your information is securely encrypted
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  background: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 50,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212529',
    flex: 1,
    textAlign: 'center',
    marginLeft: -40, // Offset the back button
  },
  stepIndicator: {
    backgroundColor: '#e9ecef',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stepText: {
    fontSize: 12,
    color: '#6c757d',
    fontWeight: '500',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e9ecef',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4361ee',
    borderRadius: 2,
  },
  card: {
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  termsContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#adb5bd',
    marginRight: 10,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#4361ee',
    borderColor: '#4361ee',
  },
  termsText: {
    flex: 1,
    fontSize: 13,
    color: '#6c757d',
    lineHeight: 20,
  },
  termsLink: {
    color: '#4361ee',
    fontWeight: '500',
  },
  buttonContainer: {
    marginTop: 8,
  },
  button: {
    marginBottom: 16,
  },
  loginText: {
    textAlign: 'center',
    color: '#6c757d',
    fontSize: 14,
  },
  loginLink: {
    color: '#4361ee',
    fontWeight: '600',
  },
  securityInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  securityText: {
    fontSize: 12,
    color: '#6c757d',
    marginLeft: 6,
  },
  errorText: {
    color: '#e63946',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 30,
  },
});

export default RegisterScreen;
