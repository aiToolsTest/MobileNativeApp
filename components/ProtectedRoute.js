import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const navigation = useNavigation();

  React.useEffect(() => {
    if (!loading && !user) {
      navigation.navigate('Login');
    }
  }, [user, loading, navigation]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4361ee" />
      </View>
    );
  }

  if (!user) {
    return null; // Will be redirected by the useEffect
  }

  return children;
};

export default ProtectedRoute;
