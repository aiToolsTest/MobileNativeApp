import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useUser } from '../context/UserContext';
import { PRIMARY_BLUE } from '../src/constants/colors';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { userId, fullName, clearUser } = useUser();

  // Logout handler for top-right button
  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          onPress: () => {
            clearUser();
            navigation.navigate('Login');
          },
          style: 'destructive',
        },
      ]
    );
  };

  if (!userId) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4361ee" />
      </View>
    );
  }
  
  // Remove logout from menuItems; handled by top-right button
  const menuItems = [
  { id: '1', title: 'Personal Information', screen: 'PersonalInfo' },
  { id: '2', title: 'My Cards', screen: 'MyCards' },
  { id: '3', title: 'Statements', screen: 'Statements' },
  { id: '4', title: 'Security', screen: 'Security' },
  { id: '5', title: 'Help & Support', screen: 'Help' },
  { id: '6', title: 'Settings', screen: 'Settings' },
];

  return (
    <ScrollView style={styles.container}>
      {/* Header with user info */}
      <View style={styles.header}>
        {/* Top-right logout icon - updated to a better icon */}
        <View style={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}>
          <TouchableOpacity 
            onPress={handleLogout} 
            style={styles.logoutIconButton}
          >
            <MaterialIcons name="exit-to-app" size={28} color="#e63946" />
          </TouchableOpacity>
        </View>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {fullName ? fullName.charAt(0).toUpperCase() : 'U'}
          </Text>
        </View>
        <Text style={styles.userName}>{fullName || 'User'}</Text>
        <Text style={styles.userSince}>Member since {new Date().getFullYear()}</Text>
      </View>



      {/* Menu section */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Account Settings</Text>
        {menuItems.map(item => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.menuItem}
            onPress={() => item.onPress ? item.onPress() : (item.screen ? navigation.navigate(item.screen) : null)}
          >
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuItemText}>{item.title}</Text>
            </View>
            
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9E3',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF9E3',
  },
  header: {
    backgroundColor: '#FFF9E3',
    padding: 24,
    paddingTop: 48,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 24,
    alignItems: 'center',
    padding: 24,
    paddingTop: 48,
    marginBottom: 8,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '600',
    color: PRIMARY_BLUE,
  },
  cameraButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#4361ee',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: PRIMARY_BLUE,
    marginBottom: 4,
  },

  userSince: {
    fontSize: 14,
    color: '#adb5bd',
    marginBottom: 16,
  },
  logoutIconButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  menuSection: {
    padding: 16,
    marginTop: 8,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    marginBottom: 12,
    marginLeft: 4,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  menuItemText: {
    fontSize: 16,
    color: PRIMARY_BLUE,
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#f1f3f5',
    marginLeft: 72,
  },

  footer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  versionText: {
    fontSize: 12,
    color: '#adb5bd',
  },
});

export default ProfileScreen;
